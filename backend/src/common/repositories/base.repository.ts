import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface RepositoryPaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export abstract class BaseRepository<T = any> {
  protected readonly logger = new Logger(BaseRepository.name);

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: string,
  ) {}

  protected get delegate(): any {
    return (this.prisma as any)[this.modelName];
  }

  async findById(id: string): Promise<T | null> {
    return this.delegate.findUnique({ where: { id } });
  }

  async findMany(where?: Record<string, any>, take = 50, skip = 0): Promise<T[]> {
    return this.delegate.findMany({ where, take, skip });
  }

  async findPaginated(where?: Record<string, any>, page = 1, limit = 20): Promise<RepositoryPaginatedResult<T>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.delegate.findMany({ where, take: limit, skip }),
      this.delegate.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async create(data: Record<string, any>): Promise<T> {
    return this.delegate.create({ data });
  }

  async update(id: string, data: Record<string, any>): Promise<T> {
    return this.delegate.update({ where: { id }, data });
  }

  async delete(id: string): Promise<T> {
    return this.delegate.delete({ where: { id } });
  }
}
