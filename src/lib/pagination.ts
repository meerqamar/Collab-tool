export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

interface ModelDelegate<T> {
  findMany: (args: Record<string, unknown>) => Promise<T[]>;
  count: (args: { where?: unknown }) => Promise<number>;
}

/**
 * Generic pagination utility compatible with Prisma delegates.
 */
export async function paginate<T>(
  modelDelegate: ModelDelegate<T>,
  args: Record<string, unknown> = {},
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<T>> {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const [data, total] = await Promise.all([
    modelDelegate.findMany({ ...args, skip, take }),
    modelDelegate.count({ where: args.where }),
  ]);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
