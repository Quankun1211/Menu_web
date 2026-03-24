export type BackendResponse<T> = {
    code: T;
    data: T;
    unreadCount: number
}
export type Pagination = {
    meta: {
        page: number;
        limit: number;
        total: number;
    }
}

export type BackendErrorResponse = {
    error: number;
    message: string;
    statusCode: number;
}

export type PaginationInfo = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
};

export interface PaginatedBackendResponse<T> {
  code: number;
  message?: string;
  data: T;
  pagination: PaginationInfo;
}

export interface GetProductByRegionParams {
    region: string;
    categoryId?: string;
    sort?: string;
    page?: number;
    limit?: number;
}