import * as yup from "yup";

export const editProfessionSchema = yup.object({
  id: yup.number().required("Поле 'id' обов'язкове"),
  code_kp: yup
    .string()
    .required("Поле 'code_kp' обов'язкове")
    .matches(
      /^[0-9]{1,10}$/,
      "Поле 'code_kp' має бути числовим рядком довжиною до 10 символів"
    ),
  name: yup
    .string()
    .required("Поле 'name' обов'язкове")
    .max(255, "Поле 'name' має бути не більше 255 символів"),
});
