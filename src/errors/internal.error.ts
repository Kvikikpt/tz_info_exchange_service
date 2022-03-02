import { ErrorCodes, HttpStatusCode } from '../types';

export abstract class InternalError extends Error {
  protected constructor(
    message = 'Internal error',
    public readonly httpStatusCode: number = HttpStatusCode.InternalServerError,
    public readonly code: number = ErrorCodes.UndefinedError
  ) {
    super(message);
    Error.captureStackTrace(this, InternalError);
  }
}
