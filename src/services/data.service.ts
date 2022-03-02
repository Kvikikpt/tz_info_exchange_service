import { TYPES } from '../constants';
import { inject } from 'inversify';
import { DataRepository } from '../repositories/mongo';
import { HttpError } from '../errors';
import { HttpStatusCode } from '../types';
import { Data, DataModel } from '../interfaces';
import crypto from 'crypto';
import { provideSingleton } from '../ioc/decorators';
import { LoggerFactory } from '../logger';
import { DeletionLogsRepository } from '../repositories/postgres';

@provideSingleton(TYPES.DataService)
export class DataService {
  private logger = LoggerFactory.getLogger('DataService');

  @inject(TYPES.DataRepository)
  private readonly dataRepository!: DataRepository;

  @inject(TYPES.DeletionLogsRepository)
  private readonly deletionLogsRepository!: DeletionLogsRepository;

  public async deleteData(dataToDelete: DataModel): Promise<void> {
    const { shareCode } = dataToDelete;
    return new Promise<void>((resolve, reject) => {
      dataToDelete?.deleteOne((err) => {
        if (err) {
          reject(err);
        }
        this.deletionLogsRepository.createNewDeletionLog(shareCode);
        resolve();
      });
    });
  }

  public async deleteByAdminCode(adminCode: string): Promise<void> {
    const arrayOfDataToDelete = await this.dataRepository.findManyByFilters({
      adminCode,
    });
    if (arrayOfDataToDelete.length === 0) {
      this.logger.error('Not found data to delete by admin code');
      throw new HttpError(
        'Not found data to delete by adminCode',
        HttpStatusCode.NotFound
      );
    }
    await Promise.all([arrayOfDataToDelete.map(this.deleteData)]);
  }

  public async updateData(adminCode, fieldsToUpdate: Partial<Data>): Promise<DataModel> {
    const dataToUpdate = await this.dataRepository.findOneByFilters({ adminCode });
    if (!dataToUpdate) {
      this.logger.error('Not found data to update by admin code');
      throw new HttpError(
        'Not found data to update by admin code',
        HttpStatusCode.NotFound
      );
    }
    for (const field in fieldsToUpdate) {
      dataToUpdate[field] = fieldsToUpdate[field];
    }
    return await dataToUpdate.save();
  }

  public async createData(
    dataFields: Pick<Data, 'data' | 'accessTimesCount' | 'expirationTime'>
  ): Promise<DataModel> {
    try {
      return await this.dataRepository.create({
        data: dataFields.data,
        accessTimesCount: dataFields.accessTimesCount,
        expirationTime: dataFields.expirationTime,
        shareCode: crypto.randomBytes(10).toString('hex'),
        adminCode: crypto.randomBytes(10).toString('hex'),
      });
    } catch (e) {
      this.logger.error('Error while trying to create new data', {
        message: (e as Error).message || 'Unknown',
      });
      throw new HttpError(
        'Error, while trying to create new data',
        HttpStatusCode.InternalServerError
      );
    }
  }

  public async deleteAll(): Promise<void> {
    const arrayOfDataToDelete = await this.dataRepository.findAll();
    await Promise.all([
      arrayOfDataToDelete.map((dataToDelete) => {
        return new Promise<void>((resolve, reject) => {
          dataToDelete?.deleteOne((err) => {
            if (err) {
              reject(err);
            }
            this.logger.info('Successful deleted all data');
            resolve();
          });
        });
      }),
    ]);
  }

  public async findDataByShareCode(shareCode: string): Promise<DataModel> {
    const foundData = await this.dataRepository.findOneByFilters({ shareCode });
    if (!foundData) {
      this.logger.error('Not found data by shareCode', {
        shareCode,
      });
      throw new HttpError('Not found data by shareCode', HttpStatusCode.NotFound);
    }
    foundData.accessTimesCount -= 1;
    if (foundData.accessTimesCount === 0) {
      this.logger.info('Data access times count expired, deleting', {
        shareCode,
      });
      await this.deleteData(foundData);
    } else {
      await foundData.save();
    }
    return foundData;
  }
}
