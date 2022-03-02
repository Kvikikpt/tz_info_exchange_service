import {
  controller,
  httpGet,
  httpPost,
  requestParam,
  requestBody,
  response,
} from 'inversify-express-utils';
// eslint-disable-next-line node/no-extraneous-import
import { Response } from 'express';
import { API_DATA_PREFIX, TYPES } from '../constants';
import {
  deleteDataValidator,
  pushDataValidator,
  updateDataValidator,
} from '../validators';
import { inject } from 'inversify';
import { DataService } from '../services';
import { HttpStatusCode } from '../types';
import { mapData, mapDataCredentials } from '../mappers';
import { DataCredentialsResponse, DataMessageResponse } from '../responses';

@controller(`${API_DATA_PREFIX}`)
export class ApiDataController {
  @inject(TYPES.DataService)
  private readonly dataService!: DataService;

  @httpPost('/push')
  public async push(@requestBody() body: unknown): Promise<DataCredentialsResponse> {
    const dataFields = await pushDataValidator.validate(body);

    return mapDataCredentials(await this.dataService.createData(dataFields));
  }

  @httpPost('/update')
  public async update(
    @requestBody() body: unknown,
    @response() res: Response
  ): Promise<void> {
    const { data, accessTimesCount, expirationTime, adminCode } =
      await updateDataValidator.validate(body);
    await this.dataService.updateData(adminCode, {
      data,
      accessTimesCount,
      expirationTime,
    });
    res.status(HttpStatusCode.Ok);
  }

  @httpGet('/:shareCode')
  public async getByShareCode(
    @requestParam('shareCode') shareCode: string
  ): Promise<DataMessageResponse> {
    return mapData(await this.dataService.findDataByShareCode(shareCode));
  }

  @httpPost('/delete')
  public async delete(
    @requestBody() body: unknown,
    @response() res: Response
  ): Promise<void> {
    const { adminCode } = await deleteDataValidator.validate(body);
    await this.dataService.deleteByAdminCode(adminCode);
    res.status(HttpStatusCode.Ok);
  }
}
