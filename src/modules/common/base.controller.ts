import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseController {
  protected validateEmptyBody(body: any) {
    if (Object.keys(body).length > 0) {
      throw new HttpException(
        'This endpoint does not accept content',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  protected catchError(error: any) {
    const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const errorMessage = error.message || 'Internal server error';
    throw new HttpException(errorMessage, statusCode);
  }
}
