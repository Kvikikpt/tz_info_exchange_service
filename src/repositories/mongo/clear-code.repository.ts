import { ClearCodeModel } from '../../interfaces';
import { BaseRepository } from './base.repository';
import { TYPES } from '../../constants';
import { ClearCode } from '../../interfaces';
import { provideSingleton } from '../../ioc/decorators';

@provideSingleton(TYPES.ClearCodeRepository)
export class ClearCodeRepository extends BaseRepository<ClearCode, ClearCodeModel> {
  public constructor() {
    super('ClearCode', {
      code: String,
    });
    if (!process.env.INITIAL_CLEAR_CODE) {
      throw new Error('The app started without first clear code');
    }
    this.create({ code: process.env.INITIAL_CLEAR_CODE }).then(() => {
      console.log('The first clear code was initialized');
    });
  }
}
