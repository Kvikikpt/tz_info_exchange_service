import { Document } from 'mongoose';

export interface DataModel extends Document {
  expirationTime: Date;
  shareCode: string;
  adminCode: string;
  data: string;
  accessTimesCount: number;
}
