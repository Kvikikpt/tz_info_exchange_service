import { provideSingleton } from '../../ioc/decorators';
import { BaseRepository } from './base.repository';
import { DeletionLogs } from '../../entities/deletion-logs.entity';
import { EntityRepository, ObjectType } from 'typeorm';
import { TYPES } from '../../constants';

@provideSingleton(TYPES.DeletionLogsRepository)
@EntityRepository(DeletionLogs)
export class DeletionLogsRepository extends BaseRepository<DeletionLogs> {
  protected getEntity(): ObjectType<DeletionLogs> {
    return DeletionLogs;
  }

  public async createNewDeletionLog(shareCode: string) {
    return await this.getRepository().save({ shareCode });
  }
}
