import { isArray } from 'lodash';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';

@Catch(BadRequestException)
export class DeleteFileOnErrorFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const files = JSON.parse(JSON.stringify(request.files, null, 2));
    const getFiles = (files: Express.Multer.File[] | any | undefined) => {
      if (!files) return [];
      if (isArray(files)) return files;
      return files.images;
    };
    const filePaths: any = getFiles(files);
    if (filePaths && filePaths.length > 0) {
      filePaths.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error(err);
            return err;
          }
        });
      });
    }

    response.status(status).json(exception.getResponse());
  }
}
