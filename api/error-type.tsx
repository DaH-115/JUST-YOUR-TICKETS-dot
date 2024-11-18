export interface ErrorResponse {
  title: string;
  errorMessage: string;
  status?: number;
}

export interface ApiError {
  status?: number;
  message: string;
}
