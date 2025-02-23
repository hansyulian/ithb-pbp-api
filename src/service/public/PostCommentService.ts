import { BasePublicService } from "~/service/public/BasePublicService";
import {
  PostComment,
  PostCommentCreationAttributes,
  PostCommentAttributes,
} from "~/models/PostComment";
import { WhereOptions } from "sequelize";
import { PaginatedArrayResponse } from "~/lib/apiBlueprint";

export class PostCommentService extends BasePublicService {
  async create(data: PostCommentCreationAttributes): Promise<PostComment> {
    await this.service.post.getById(data.postId);
    return PostComment.create(data);
  }

  async getById(id: string): Promise<PostComment | null> {
    return PostComment.findByPk(id);
  }

  async update(
    id: string,
    data: Partial<PostCommentAttributes>
  ): Promise<[number, PostComment[]]> {
    return PostComment.update(data, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: string): Promise<number> {
    return PostComment.destroy({
      where: { id },
    });
  }

  async list(
    query: WhereOptions<PostCommentAttributes>,
    options: SequelizePaginationOptions & SequelizeIncludeOptions
  ): Promise<PaginatedArrayResponse<PostComment>> {
    const { rows, count } = await PostComment.findAndCountAll({
      where: {
        ...query,
      },
      ...options,
    });
    return {
      info: {
        count,
      },
      records: rows,
    };
  }

  async info(
    query: WhereOptions<PostCommentAttributes>
  ): Promise<{ count: number }> {
    const count = await PostComment.count({
      where: {
        ...query,
      },
    });
    return { count };
  }
}
