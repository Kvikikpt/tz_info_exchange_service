import { TYPES } from '../constants';
import { inject } from 'inversify';
import { DataRepository } from '../repositories/mongo';
import { HttpError } from '../errors';
import { HttpStatusCode } from '../types';
import { Data, DataModel } from '../interfaces';
import crypto from 'crypto';
import { provideSingleton } from '../ioc/decorators';

@provideSingleton(TYPES.DataService)
export class DataService {
  @inject(TYPES.DataRepository)
  private readonly dataRepository!: DataRepository;

  public async deleteByAdminCode(adminCode: string): Promise<void> {
    const arrayOfDataToDelete = await this.dataRepository.findManyByFilters({
      adminCode,
    });
    if (arrayOfDataToDelete.length === 0) {
      throw new HttpError(
        'Not found data to delete by adminCode',
        HttpStatusCode.NotFound
      );
    }
    await Promise.all([
      arrayOfDataToDelete.map((dataToDelete) => {
        return new Promise<void>((resolve, reject) => {
          dataToDelete?.deleteOne((err) => {
            if (err) {
              reject(err);
            }
            resolve();
          });
        });
      }),
    ]);
  }

  public async updateData(adminCode, fieldsToUpdate: Partial<Data>): Promise<DataModel> {
    const dataToUpdate = await this.dataRepository.findOneByFilters({ adminCode });
    if (!dataToUpdate) {
      throw new HttpError(
        'Not found data to update by admin code',
        HttpStatusCode.NotFound
      );
    }
    for (let field in fieldsToUpdate) {
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
            resolve();
          });
        });
      }),
    ]);
  }
}
