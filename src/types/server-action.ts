export type ServerActionResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};
