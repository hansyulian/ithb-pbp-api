import { PublicService } from "~/service/public";
import { BaseService } from "../BaseService";

export abstract class BasePublicService extends BaseService {
  protected service: PublicService;

  public constructor(parent: PublicService) {
    super(parent.parent);
    this.service = parent;
  }
}
