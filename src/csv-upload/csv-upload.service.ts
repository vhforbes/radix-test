import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as csv from 'csv-parser';
import { SensorReadingService } from '../sensor-reading/sensor-reading.service';
import { Readable } from 'stream';
import { CsvData } from './csv-upload.interface';
import { CsvUpload, CsvUploadStatus } from './csv-upload.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CsvUploadService {
  private readonly logger = new Logger(CsvUploadService.name);

  constructor(
    private readonly sensorReadingService: SensorReadingService,
    @InjectRepository(CsvUpload)
    private readonly csvUploadRepository: Repository<CsvUpload>,
  ) {}

  async processCsv(fileBuffer: Buffer, filename: string): Promise<void> {
    const results: CsvData[] = [];

    const upload = await this.csvUploadRepository.save({
      filename,
      errors: null,
    });

    const stream = Readable.from(fileBuffer.toString());

    try {
      await new Promise<void>((resolve, reject) => {
        stream
          .pipe(csv())
          .on('data', (data: CsvData) => results.push(data))
          .on('end', () => resolve())
          .on('error', (err) => {
            this.logger.error('Error during CSV parsing', err.stack);
            reject(new BadRequestException('Error during CSV parsing'));
          });
      });

      await this.saveCsvData(results, upload);
      if (!upload.status) {
        upload.status = CsvUploadStatus.PROCESSED;
      }

      await this.csvUploadRepository.save(upload);
    } catch (err) {
      this.logger.error('Error processing CSV', err.stack);
      upload.status = CsvUploadStatus.FAILURE;
      upload.errors = err.message;

      await this.csvUploadRepository.save(upload);
      throw new BadRequestException('Failed to process CSV data');
    }
  }

  private async saveCsvData(data: CsvData[], upload: CsvUpload): Promise<void> {
    const failedRows: string[] = []; // Track failed rows

    for (const row of data) {
      try {
        const timestamp = row.timestamp;

        if (isNaN(new Date(row.timestamp).getTime())) {
          this.logger.error(`Invalid timestamp in row: ${JSON.stringify(row)}`);
          failedRows.push(`Invalid timestamp in row: ${JSON.stringify(row)}`);
          continue;
        }

        // I can add more validations as needed according to each rows

        const dto = {
          equipmentId: row.equipmentId,
          timestamp,
          value: parseFloat(row.value),
        };

        await this.sensorReadingService.create(dto);
      } catch (err) {
        this.logger.error('Error saving CSV data row:', row, err.stack);
        failedRows.push(`Error saving row: ${JSON.stringify(row)}`);
      }
    }

    if (failedRows.length > 0) {
      this.logger.error('Failed to process the following rows:', failedRows);
      upload.status = CsvUploadStatus.PROCESSED_WITH_ERRORS;
      upload.errors = failedRows.join('; ');
      await this.csvUploadRepository.save(upload);
    }
  }
}
