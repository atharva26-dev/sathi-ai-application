import { Response } from 'express';

export interface ApiResponseMeta {
  request_id: string;
  timestamp: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta: ApiResponseMeta;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorDetail;
  meta: ApiResponseMeta;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  requestId = 'req_default'
): void => {
  const responsePayload: ApiSuccessResponse<T> = {
    success: true,
    data,
    meta: {
      request_id: requestId,
      timestamp: new Date().toISOString()
    }
  };
  res.status(statusCode).json(responsePayload);
};

export const sendError = (
  res: Response,
  code: string,
  message: string,
  statusCode = 400,
  details: Record<string, any> = {},
  requestId = 'req_default'
): void => {
  const responsePayload: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      details
    },
    meta: {
      request_id: requestId,
      timestamp: new Date().toISOString()
    }
  };
  res.status(statusCode).json(responsePayload);
};
