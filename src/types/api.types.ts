export interface ApiListResponse<T> {
  limit: number;
  skip: number;
  total: number;
  products: T[];
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
}
