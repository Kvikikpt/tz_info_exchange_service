import { unmanaged } from 'inversify';
import { model, Schema, Document, Model, SchemaDefinition, FilterQuery } from 'mongoose';

export class BaseRepository<TEntity, TModel extends Document> {
  private readonly _name: string;
  protected Model: Model<TModel>;

  public constructor(
    @unmanaged() name: string,
    @unmanaged() schemaDefinition: SchemaDefinition
  ) {
    this._name = name;
    const schema = new Schema(schemaDefinition, { collection: this._name });
    this.Model = model<TModel>(this._name, schema);
  }

  public async findOneByFilters(
    filters: FilterQuery<TModel>
  ): Promise<TModel | undefined> {
    return new Promise<TModel | undefined>((resolve, reject) => {
      this.Model.findOne(filters, (err, res) => {
        if (err) {
          return reject(err);
        }
        if (res === null) {
          return resolve(undefined);
        }
        resolve(res);
      });
    });
  }

  public async findManyByFilters(filters: FilterQuery<TModel>): Promise<TModel[]> {
    return new Promise<TModel[]>((resolve, reject) => {
      this.Model.find(filters, (err, res) => {
        if (err) {
          return reject(err);
        }
        if (res === null) {
          return resolve([]);
        }
        resolve(res);
      });
    });
  }

  public async findAll(): Promise<TModel[]> {
    return new Promise<TModel[]>((resolve, reject) => {
      this.Model.find((err, res) => {
        if (err) {
          return reject(err);
        }
        if (res === null) {
          return resolve([]);
        }
        resolve(res);
      });
    });
  }

  public async create(doc: TEntity): Promise<TModel> {
    return new Promise<TModel>((resolve, reject) => {
      const instance = new this.Model(doc);
      instance.save((err, res) => {
        if (err) {
          return reject(err);
        }
        resolve(res);
      });
    });
  }
}
