import * as Yup from "yup";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
// min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.

// export const basicSchema = Yup.object().shape({
//   email: Yup.string().email("Please enter a valid email").required("Required"),
//   age: Yup.number().positive().integer().required("Required"),
//   password: Yup
//     .string()
//     .min(5)
//     .matches(passwordRules, { message: "Please create a stronger password" })
//     .required("Required"),
//   confirmPassword: Yup
//     .string()
//     .oneOf([Yup.ref("password"), null], "Passwords must match")
//     .required("Required"),
// });

export const advancedSchema = Yup.object().shape({
  type: Yup.string().oneOf(["buyer", "supplier"]).required("Type is required"),
  name: Yup.string().required("Name is required"),
  code: Yup.string().required("Code is required"),
  address: Yup.string(),
  zipCode: Yup.string(),
  city: Yup.string().required("City is required"),
  country: Yup.string().required("Country is required"),
  cif: Yup.string(),
  ocr: Yup.string(),
  iban: Yup.string(),
  swift: Yup.string(),
  bank: Yup.string(),
  contact: Yup.string(),
  phone1: Yup.string(),
  phone2: Yup.string(),
  email: Yup.string().email("Invalid email"),
  website: Yup.string(),
  notes: Yup.string(),
  category: Yup.array(),
});


export const billSchema = Yup.object().shape({
  clientDetails: Yup.array().required(),
  code: Yup.string().required(),
  date: Yup.date().required(),
  type: Yup.string().required(),
  currency: Yup.string().required(),
  exchangeRate: Yup.number().required().positive().max(99),
  vatRate: Yup.number().when('currency', {
    is: (currency) => currency !== 'lei',
    then: Yup.number().required().positive().max(99),
  }),
  customDutyVAT: Yup.number().when('currency', {
    is: 'Non-EU',
    then: Yup.number().required().positive().max(99),
  }),
  notes: Yup.string(),
  category: Yup.array().required(),
  subCategory: Yup.string(),
  numberOfItems: Yup.number().required().positive().max(99),
  item: Yup.array().of(
    Yup.object().shape({
      code: Yup.string().required(),
      name: Yup.string().required(),
      category: Yup.string(),
      subCategory: Yup.string(),
      description: Yup.string(),
      unitOfMeasurement: Yup.string(),
      quantity: Yup.number().required().positive(),
      unitPrice: Yup.number().required().positive(),
      isFabric: Yup.boolean().required(),
      composition: Yup.string().when('isFabric', {
        is: true,
        then: Yup.string().required(),
      }),
      material: Yup.string().when('isFabric', {
        is: true,
        then: Yup.string().required(),
      }),
      structure: Yup.string().when('isFabric', {
        is: true,
        then: Yup.string().required(),
      }),
      design: Yup.string().when('isFabric', {
        is: true,
        then: Yup.string().required(),
      }),
      weaving: Yup.string().when('isFabric', {
        is: true,
        then: Yup.string().required(),
      }),
      color: Yup.string().when('isFabric', {
        is: true,
        then: Yup.string().required(),
      }),
      finishing: Yup.string().when('isFabric', {
        is: true,
        then: Yup.string().required(),
      }),
      rating: Yup.string().when('isFabric', {
        is: true,
        then: Yup.string().required(),
      }),
    })
  ),
});
