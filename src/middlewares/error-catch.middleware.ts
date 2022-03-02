import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors';
import { ErrorCodes, HttpStatusCode } from '../types';

export const errorCatchMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  let status;
  let code;

  switch (err.constructor) {
    case HttpError:
    default:
      status = HttpStatusCode.InternalServerError;
      code = ErrorCodes.UndefinedError;
  }

  const resData: any = {
    status: err.code ?? code,
    message: err.message ?? 'Unresolved error',
  };

  if (err.type === 'entity.parse.failed') {
    status = err.statusCode;
    resData.message = 'Incorrect data passed to request';
  }

  return res.status(status).json(resData);
};
