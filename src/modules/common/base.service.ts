import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseService {
  protected catchError(error: any) {
    const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const errorMessage = error.message || 'Internal server error';
    throw new HttpException(errorMessage, statusCode);
  }
}
