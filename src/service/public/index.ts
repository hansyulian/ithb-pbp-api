import { Service } from "~/service";
import { PostCommentService } from "~/service/public/PostCommentService";
import { PostService } from "~/service/public/PostService";

export class PublicService {
  parent: Service;

  post: PostService;
  postComment: PostCommentService;

  public constructor(parent: Service) {
    this.parent = parent;
    this.post = new PostService(this);
    this.postComment = new PostCommentService(this);
  }
}
