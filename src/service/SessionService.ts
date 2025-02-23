import { appConfig } from "~/config";
import {
  SessionNotFoundException,
  UserNotFoundException,
} from "~/exceptions/NotFoundExceptions";
import {
  InvalidCredentialException,
  InvalidOldPasswordException,
  UnacceptablePasswordException,
  UnauthorizedException,
} from "~/exceptions/SessionExceptions";
import { JwtModule } from "~/lib/JwtModule";
import { Session } from "~/models/Session";
import { User, UserProfileUpdatePayload } from "~/models/User";
import { BaseService } from "~/service/BaseService";
import { cleanUndefined } from "~/utils/cleanUndefined";
import { findUserByEmail } from "~/utils/findUserByEmail";
import { generateResetPasswordToken } from "~/utils/generateResetPasswordToken";
import { uuid } from "~/utils/uuid";
import { verifyPassword } from "~/utils/verifyPassword";
import { verifyPasswordCharacters } from "~/utils/verifyPasswordCharacters";

export class SessionService extends BaseService {
  async emailLogin(email: string, password: string) {
    const user = await findUserByEmail(email);
    if (!(await verifyPassword(password, user.password))) {
      throw new InvalidCredentialException();
    }
    const { token } = await this.userIdLogin(user.id);
    return {
      token,
    };
  }

  async userIdLogin(userId: string) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new UserNotFoundException({ id: userId });
    }
    const id = uuid();
    const token = await JwtModule.signToken({
      sessionId: id,
    });
    const session = await Session.create({
      id,
      userId: user.id,
      token,
      expiredAt: new Date(Date.now() + appConfig.jwt.expiry),
    });
    session.token = token;
    await session.save();
    user.lastLoginAt = new Date();
    await user.save();
    return {
      token,
    };
  }

  async logout() {
    const sessionId = this.serviceSession?.session.id;
    if (!sessionId) {
      throw new UnauthorizedException();
    }
    const session = await Session.findByPk(sessionId);
    if (!session) {
      throw new SessionNotFoundException();
    }
    await session.destroy();
  }

  async getUserInfo() {
    const sessionId = this.serviceSession?.session.id;
    if (!sessionId) {
      throw new UnauthorizedException();
    }
    const session = await Session.findByPk(sessionId);
    if (!session) {
      throw new SessionNotFoundException();
    }
    const me = await User.findByPk(session.userId);
    if (!me) {
      throw new UserNotFoundException();
    }
    return me;
  }

  async updatePassword(oldPassword: string, newPassword: string) {
    const me = await this.getUserInfo();
    if (!verifyPasswordCharacters(newPassword)) {
      throw new UnacceptablePasswordException();
    }
    if (!(await verifyPassword(oldPassword, me.password))) {
      throw new InvalidOldPasswordException();
    }
    me.password = newPassword;
    await me.save();
  }

  async forgetPassword(email: string) {
    const { token, expiredAt } = generateResetPasswordToken();
    try {
      const user = await findUserByEmail(email);
      user.resetToken = token;
      user.resetTokenExpiry = expiredAt;
      await user.save();
      // this can be awaited or maybe just ignored, but maybe later we will move this part
      // to microservice to send emails
    } catch (err) {
      // "if the email is found in our database, we will send you the forget password email shortly"
      if (err instanceof UserNotFoundException) {
        return {
          expiredAt,
        };
      }
      throw err;
    }
    return {
      expiredAt,
    };
  }

  async resetPassword(resetToken: string, password: string) {
    // pretend for every failure here as user not found exception,
    // unless some other unknown errors
    if (!verifyPasswordCharacters(password)) {
      throw new UnacceptablePasswordException();
    }
    const user = await User.findOne({
      where: {
        resetToken,
      },
    });
    if (!user) {
      throw new UserNotFoundException();
    }
    user.password = password;
    await user.save();

    await user.update({
      resetTokenExpiry: undefined,
      resetToken: undefined,
    });
    return user;
  }

  async updateProfile(payload: UserProfileUpdatePayload) {
    const me = await this.getUserInfo();
    const { name } = payload;

    await me.update(
      cleanUndefined({
        name,
      })
    );
  }
}
