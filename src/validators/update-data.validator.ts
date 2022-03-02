import * as yup from 'yup';
import { DateTime } from 'luxon';

export const updateDataValidator = yup.object({
  adminCode: yup.string().required(),
  data: yup.string().optional(),
  accessTimesCount: yup.number().optional(),
  expirationTime: yup
    .string()
    .optional()
    .trim()
    .test((value) => !!value && DateTime.fromISO(value).isValid),
});
