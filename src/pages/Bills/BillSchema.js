import React, { useState, useRef, useEffect } from "react";

import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";

const validationSchema = Yup.object().shape({
  clientDetails: Yup.array().of(
    Yup.string().trim().required("Client Details is required")
  ),
  code: Yup.string().trim().required("Code is required"),
  date: Yup.date().required("Date is required"),
  type: Yup.string().trim().required("Type is required"),
  currency: Yup.string().trim().required("Currency is required"),
  exchangeRate: Yup.number()
    .required("Exchange Rate is required")
    .positive("Exchange Rate must be positive")
    .max(99, "Exchange Rate must be less than or equal to 99"),
  vatRate: Yup.number()
    .when("selectedClient.country", {
      is: (country) => country !== "EU",
      then: Yup.number()
        .required("VAT Rate is required")
        .positive("VAT Rate must be positive")
        .max(99, "VAT Rate must be less than or equal to 99"),
    }),
  customDutyVAT: Yup.number()
    .when("selectedClient.country", {
      is: (country) => country === "Non-EU",
      then: Yup.number()
        .required("Custom Duty VAT is required")
        .positive("Custom Duty VAT must be positive")
        .max(99, "Custom Duty VAT must be less than or equal to 99"),
    }),
  notes: Yup.string().trim(),
  category: Yup.array().of(
    Yup.string().trim().required("Category is required")
  ),
  subCategory: Yup.string().trim().required("Subcategory is required"),
  numberOfItems: Yup.number()
    .required("Number of items is required")
    .positive("Number of items must be positive")
    .max(99, "Number of items must be less than or equal to 99"),
  ...Array.from({ length: 2 }, (_, i) => ({
    [`code-${i}`]: Yup.string().trim().required(`Code ${i + 1} is required`),
    [`name-${i}`]: Yup.string().trim().required(`Name ${i + 1} is required`),
    [`category-${i}`]: Yup.string().trim(),
    [`subCategory-${i}`]: Yup.string().trim(),
    [`description-${i}`]: Yup.string().trim(),
    [`unitOfMeasurement-${i}`]: Yup.string().trim(),
    [`quantity-${i}`]: Yup.number()
      .required(`Quantity ${i + 1} is required`)
      .positive(`Quantity ${i + 1} must be positive`)
      .max(999, `Quantity ${i + 1} must be less than or equal to 999`),
    [`unitPrice-${i}`]: Yup.number()
      .required(`Price ${i + 1} is required`)
      .positive(`Price ${i + 1} must be positive`)
      .max(99, `Price ${i + 1} must be less than or equal to 99`),
    [`composition-${i}`]: Yup.string().trim(),
    [`material-${i}`]: Yup.string().trim(),
    [`structure-${i}`]: Yup.string().trim(),
    [`design-${i}`]: Yup.string().trim(),
    [`weaving-${i}`]: Yup.string().trim(),
    [`color-${i}`]: Yup.string().trim(),
    [`finishing-${i}`]: Yup.string().trim(),
    [`rating-${i}`]: Yup.string().trim(),
  })),
});

const initialValues = {
    clientDetails: "",
    code: "",
    date: "",
    type: "",
    currency: "",
    exchangeRate: "",
    vatRate: "",
    customDutyVAT: "",
    notes: "",
    category: [],
    subCategory: "",
    numberOfItems: "",
    items: Array.from({ length: 1 }, () => ({
      code: "",
      name: "",
      category: "",
      subCategory: "",
      description: "",
      unitOfMeasurement: "",
      quantity: "",
      unitPrice: "",
      composition: "",
      material: "",
      structure: "",
      design: "",
      weaving: "",
      color: "",
      finishing: "",
      rating: "",
    })),
  };

  const BillSchema = () => {
    const formik = useFormik({
      initialValues,
      validationSchema,
      onSubmit: values => {
        console.log(values);
      },
    });
  
    return (
        <div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={values => {
                    console.log(values);
                }}
            >
                <Form>
                    <div>
                        <label htmlFor="clientDetails">Client Details</label>
                        <Field name="clientDetails" />
                        <ErrorMessage name="clientDetails" />
                    </div>
                    <div>
                        <label htmlFor="code">Code</label>
                        <Field name="code" />
                        <ErrorMessage name="code" />
                    </div>
                    <div>
                        <label htmlFor="date">Date</label>
                        <Field name="date" />
                        <ErrorMessage name="date" />
                    </div>
                    <div>
                        <label htmlFor="type">Type</label>
                        <Field name="type" />
                        <ErrorMessage name="type" />
                    </div>
                    <div>
                        <label htmlFor="currency">Currency</label>
                        <Field name="currency" />
                        <ErrorMessage name="currency" />
                    </div>
                    <div>
                        <label htmlFor="exchangeRate">Exchange Rate</label>
                        <Field name="exchangeRate" />
                        <ErrorMessage name="exchangeRate" />
                    </div>
                    <div>
                        <label htmlFor="vatRate">VAT Rate</label>
                        <Field name="vatRate" />
                        <ErrorMessage name="vatRate" />
                    </div>
                    <div>
                        <label htmlFor="customDutyVAT">Custom Duty VAT</label>
                        <Field name="customDutyVAT" />
                        <ErrorMessage name="customDutyVAT" />
                    </div>
                    <div>
                        <label htmlFor="notes">Notes</label>
                        <Field name="notes" />
                        <ErrorMessage name="notes" />
                    </div>
                    <div>
                        <label htmlFor="category">Category</label>
                        <Field name="category" />
                        <ErrorMessage name="category" />
                    </div>
                    <div>
                        <label htmlFor="subCategory">Subcategory</label>
                        <Field name="subCategory" />
                        <ErrorMessage name="subCategory" />
                    </div>
                    <div>
                        <label htmlFor="numberOfItems">Number of Items</label>
                        <Field name="numberOfItems" />
                        <ErrorMessage name="numberOfItems" />
                    </div>
                    <div>
                        <label htmlFor="code-0">Code 1</label>
                        <Field name="code-0" />
                        <ErrorMessage name="code-0" />
                    </div>
                    <div>
                        <label htmlFor="name-0">Name 1</label>
                        <Field name="name-0" />
                        <ErrorMessage name="name-0" />
                    </div>
                    <div>
                        <label htmlFor="category-0">Category 1</label>
                        <Field name="category-0" />
                        <ErrorMessage name="category-0" />
                    </div>
                    <div>
                        <label htmlFor="subCategory-0">Subcategory 1</label>
                        <Field name="subCategory-0" />
                        <ErrorMessage name="subCategory-0" />
                    </div>
                    
                    
                </Form>
            </Formik>
        </div>
    );
  };
    
    export default BillSchema;