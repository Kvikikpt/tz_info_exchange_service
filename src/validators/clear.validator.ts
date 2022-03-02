import * as yup from 'yup';

export const ClearValidator = yup.object({
  code: yup.string().uuid().required(),
});
