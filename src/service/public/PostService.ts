import { BasePublicService } from "~/service/public/BasePublicService";
import { Post, PostCreationAttributes, PostAttributes } from "~/models/Post";
import { WhereOptions } from "sequelize";
import { PaginatedArrayResponse } from "~/lib/apiBlueprint";
import { NotFoundException } from "~/exceptions/NotFoundExceptions";
import { cleanUndefined } from "~/utils/cleanUndefined";

export class PostService extends BasePublicService {
  async create(data: PostCreationAttributes): Promise<Post> {
    return Post.create(data);
  }

  async getById(id: string): Promise<Post> {
    const record = await Post.findByPk(id);
    if (!record) {
      throw new NotFoundException("post", { id });
    }
    return record;
  }

  async update(id: string, data: Partial<PostAttributes>): Promise<Post> {
    const record = await this.getById(id);
    const result = await record.update({ ...cleanUndefined(data) });
    return result;
  }

  async delete(id: string): Promise<void> {
    const record = await this.getById(id);
    await record.destroy();
  }

  async list(
    query: WhereOptions<PostAttributes>,
    options: SequelizePaginationOptions & SequelizeIncludeOptions
  ): Promise<PaginatedArrayResponse<Post>> {
    const { rows, count } = await Post.findAndCountAll({
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
}
