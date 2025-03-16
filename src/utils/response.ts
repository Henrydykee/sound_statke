export interface ApiResponse<T> {
    message: string;
    status: boolean;
    data?: T;
  }
  
  export const successResponse = <T>(message: string, data?: T): ApiResponse<any> => {
    return {
      message,
      status: true,
      data,
    };
  };
  
  export const errorResponse = (message: string, data: any = null): ApiResponse<any> => {
    return {
      message,
      status: false,
      data,
    };
  };
  