import { Data, DataModel } from '../../interfaces';
import { BaseRepository } from './base.repository';
import { TYPES } from '../../constants';
import { provideSingleton } from '../../ioc/decorators';

@provideSingleton(TYPES.DataRepository)
export class DataRepository extends BaseRepository<Data, DataModel> {
  public constructor() {
    super('Data', {
      shareCode: String,
      adminCode: String,
      data: String,
      accessTimesCount: Number,
      expirationTime: Date,
    });
  }
}
