import * as multer from 'multer';
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CsvUploadService } from './csv-upload.service';

@Controller('csv-upload')
export class CsvUploadController {
  constructor(private readonly csvUploadService: CsvUploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage() })) // Memory storage for file
  async uploadCsv(@UploadedFile() file: Express.Multer.File): Promise<void> {
    console.log(file);

    await this.csvUploadService.processCsv(file.buffer, file.fieldname);
  }
}
