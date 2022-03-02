import * as yup from 'yup';
import { DateTime } from 'luxon';

export const pushDataValidator = yup.object({
  data: yup
    .string()
    .required()
    .trim()
    .test((value) => !!value && DateTime.fromISO(value).isValid),
  accessTimesCount: yup.number().required(),
  expirationTime: yup.date().required(),
});
