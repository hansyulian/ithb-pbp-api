import { Mailer } from "~/lib/mailer";
import { Session } from "~/models/Session";
import { SessionService } from "~/service/SessionService";
import { User } from "~/models/User";
import { Sequelize } from "sequelize-typescript";

export type ServiceOptions = {
  mailer?: Mailer;
  sequelizeInstance: Sequelize;
};

export type ServiceSession = {
  session: Session;
  user: User;
};

export class Service {
  private _sequelize: Sequelize;
  session: SessionService;

  mailer: Mailer;
  serviceSession?: ServiceSession;

  public constructor(options: ServiceOptions) {
    const { mailer, sequelizeInstance } = options;
    this._sequelize = sequelizeInstance;
    this.session = new SessionService(this);
    this.mailer = mailer || new Mailer();
  }

  public get sequelize() {
    return this._sequelize;
  }
}
