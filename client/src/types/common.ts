export interface Timestamp {
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPage: number;
  hasMorePages: boolean;
}

export type PageParams = Partial<Pick<Pagination, "page" | "limit">>;

export interface QueryResponse {
  acknowledged: boolean | undefined;
  matchedCount: number;
  modifiedCount: number;
  upsertedCount: number;
  upsertedId: string | null;
}
