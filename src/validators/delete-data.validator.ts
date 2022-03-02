import * as yup from 'yup';

export const deleteDataValidator = yup.object({
  adminCode: yup.string().required(),
});
