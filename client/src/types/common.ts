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

export interface CommonQueryRes {
  acknowledged: boolean | undefined;
  matchedCount: number;
  modifiedCount: number;
  upsertedCount: number;
  upsertedId: string | null;
}
