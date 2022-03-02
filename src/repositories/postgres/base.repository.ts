import {
  ObjectType,
  Repository,
  AbstractRepository,
  ObjectLiteral,
  getConnection,
} from 'typeorm';

export interface Identifiable extends ObjectLiteral {
  id: number | string;
}

export abstract class BaseRepository<
  Entity extends Identifiable
> extends AbstractRepository<Entity> {
  protected abstract getEntity(): ObjectType<Entity>;

  public async getRepository(): Promise<Repository<Entity>> {
    if (this.manager) {
      return this.manager.getRepository(this.getEntity());
    }

    return getConnection().getRepository(this.getEntity());
  }
}
