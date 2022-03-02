import * as yup from 'yup';

export const updateDataValidator = yup.object({
  adminCode: yup.string().required(),
  data: yup.string().optional(),
  accessTimesCount: yup.number().optional(),
  expirationTime: yup.date().optional(),
});
