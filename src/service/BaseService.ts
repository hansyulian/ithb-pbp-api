import { UnexpectedStateException } from "~/exceptions/UnexpectedStateException";
import { Service } from "~/service";

export abstract class BaseService {
  protected parent: Service;

  public constructor(parent: Service) {
    this.parent = parent;
  }

  protected get serviceSession() {
    return this.parent.serviceSession;
  }
  protected get mailer() {
    return this.parent.mailer;
  }

  protected get sessionUser() {
    if (!this.serviceSession) {
      // this state is actually unexpected, all part timer logic should be secluded only to the part timer itself
      // thus having no session is actually unexpected state
      throw new UnexpectedStateException();
    }
    return this.serviceSession.user;
  }

  protected get userRole() {
    return this.sessionUser.role;
  }
}
