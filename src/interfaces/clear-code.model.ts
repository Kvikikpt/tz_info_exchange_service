import { Document } from 'mongoose';
import { ClearCode } from './clear-code';

export interface ClearCodeModel extends ClearCode, Document {}
