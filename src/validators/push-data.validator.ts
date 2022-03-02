import * as yup from 'yup';
import { DateTime } from 'luxon';

export const pushDataValidator = yup.object({
  data: yup.string().required(),
  accessTimesCount: yup.number().required(),
  expirationTime: yup
    .string()
    .required()
    .trim()
    .test((value) => !!value && DateTime.fromISO(value).isValid),
});
