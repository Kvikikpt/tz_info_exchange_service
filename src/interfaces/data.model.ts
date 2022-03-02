import { Data } from './data';
import { Document } from 'mongoose';

export interface DataModel extends Data, Document {}
