import { DataModel } from '../interfaces';
import { DataCredentialsResponse, DataMessageResponse } from '../responses';

export const mapData = (result: DataModel): DataMessageResponse => ({
  data: result.data,
});

export const mapDataCredentials = (result: DataModel): DataCredentialsResponse => ({
  shareCode: result.shareCode,
  adminCode: result.adminCode,
});
