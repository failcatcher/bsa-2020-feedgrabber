import * as Yup from 'yup';

export const mainSchema = Yup.object().shape({
  name: Yup.string().required('Question should have name'),
  categoryTitle: Yup.string().required('Category can not be empty')
});

export const multichoiceSchema = Yup.object().shape({
  name: Yup.string().required('required'),
  answers: Yup.array()
    .of(Yup
      .string()
      .required(`Answer can't be empty`)
      .max(200, 'Answer must be shorter then 200 symbols')
    )
    .min(3, 'A multiple choice question must contain at least 3 answer choices')
});

export const radioSchema = Yup.object().shape({
    name: Yup.string().required('required'),
    answers: Yup.array()
    .of(Yup
      .string()
      .required(`Answer can't be empty`)
      .max(200, 'Answer must be shorter then 200 symbols')
    )
});

export const checkboxSchema = Yup.object().shape({
    name: Yup.string().required('required'),
    answers: Yup.array()
    .of(Yup
      .string()
      .required(`Answer can't be empty`)
      .max(200, 'Answer must be shorter then 200 symbols')
    )
});

export const fileUploadSchema = Yup.object().shape({
    name: Yup.string().required('required'),
    filesType: Yup.string().required('Choose file type'),
    filesNumber: Yup.number()
        .typeError("Enter number")
        .positive("Number must be positive")
        .integer("Number must be integer")
        .min(1, "At least 1 file")
        .max(10, "Maximum files: 10")
        .required("Enter number of files"),
    filesSize: Yup.number("Enter number")
        .typeError("Enter number")
        .positive("Number must be positive")
        .integer("Number must be integer")
        .min(1, "Minimum: 1")
        .required("Enter files size")
});