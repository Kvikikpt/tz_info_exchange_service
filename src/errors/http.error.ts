import { InternalError } from './internal.error';
import { ErrorCodes } from '../types';

export class HttpError extends InternalError {
  constructor(message: string, status: number) {
    super(message, status, ErrorCodes.HttpError);
  }
}
