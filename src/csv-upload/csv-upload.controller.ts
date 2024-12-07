import * as multer from 'multer';
import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CsvUploadService } from './csv-upload.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { CsvUpload } from './csv-upload.entity';

@ApiTags('csv-upload')
@Controller('csv-upload')
export class CsvUploadController {
  constructor(private readonly csvUploadService: CsvUploadService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage() }))
  async uploadCsv(@UploadedFile() file: Express.Multer.File): Promise<void> {
    await this.csvUploadService.processCsv(file.buffer, file.originalname);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async getAllCsvUploads(): Promise<CsvUpload[]> {
    return this.csvUploadService.getAllCsvUploads();
  }
}
