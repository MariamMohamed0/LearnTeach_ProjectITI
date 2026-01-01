export interface PaginatedResponse<T> {
  sessions: T[];     
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
