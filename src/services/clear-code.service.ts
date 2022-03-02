import { inject } from 'inversify';
import { TYPES } from '../constants';
import { ClearCodeRepository } from '../repositories/mongo';
import { randomUUID } from 'crypto';
import { HttpError } from '../errors';
import { HttpStatusCode } from '../types';
import { provideSingleton } from '../ioc/decorators';

@provideSingleton(TYPES.ClearCodeService)
export class ClearCodeService {
  @inject(TYPES.ClearCodeRepository)
  private readonly clearCodeRepository!: ClearCodeRepository;

  public async createNewClearCode(): Promise<string> {
    try {
      return (await this.clearCodeRepository.create({ code: randomUUID() })).code;
    } catch (e) {
      throw new HttpError(
        'Cant create new clear code',
        HttpStatusCode.InternalServerError
      );
    }
  }

  public async updateClearCode(oldClearCode: string): Promise<string> {
    const foundOldClearCode = await this.clearCodeRepository.findOneByFilters({
      code: oldClearCode,
    });
    if (!foundOldClearCode) {
      throw new HttpError('Clear code not found', HttpStatusCode.InternalServerError);
    }
    await new Promise<void>((resolve, reject) => {
      foundOldClearCode.deleteOne((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
    return await this.createNewClearCode();
  }
}
