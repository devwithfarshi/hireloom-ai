export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  page: number;
  start: number;
  end: number;
  next: number | null;
  prev: number | null;
}

export interface PaginatedResult<T> {
  data: T[];
  metadata: PaginationMeta;
}

export async function paginatePrisma<T>(
  model: any,
  options: PaginationOptions,
  query: {
    where: any;
    include?: any;
    orderBy?: any;
  },
): Promise<PaginatedResult<T>> {
  const { page, limit } = options;
  const skip = (page - 1) * limit;

  const total = await model.count({ where: query.where });

  const data = await model.findMany({
    skip,
    take: limit,
    ...query,
  });

  const start = total > 0 ? skip + 1 : 0;
  const end = total > 0 ? Math.min(skip + limit, total) : 0;
  const totalPages = Math.ceil(total / limit);
  const next = page < totalPages ? page + 1 : null;
  const prev = page > 1 ? page - 1 : null;

  return {
    data,
    metadata: {
      total,
      limit,
      page,
      start,
      end,
      next,
      prev,
    },
  };
}
