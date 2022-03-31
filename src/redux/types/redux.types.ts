export interface Response<T> {
  statusCode: number;
  error: string;
  message?: string;
  fields?: { field: string; message: string }[];
  data: T;
}
