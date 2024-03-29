import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions = {
  limits: {
    fileSize: 1000000, // 1000kb = 1mb
  },
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new BadRequestException(
          `Unsupported file type ${extname(file.originalname)}`,
        ),
        false,
      );
    }
  },
  storage: diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/kols');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg');
    },
  }),
};
