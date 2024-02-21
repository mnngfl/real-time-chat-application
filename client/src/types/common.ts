export interface CommonTimestamp {
  createdAt: string;
  updatedAt: string;
}

export interface CommonPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPage: number;
  hasMorePages: boolean;
}
