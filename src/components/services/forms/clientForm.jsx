import { Form, Formik } from "formik";
import { FormLabel } from "react-bootstrap";
import { advancedSchema } from "../schemas";
import { categoriesList } from "../../constants";

const onSubmit = async (values, actions) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  actions.resetForm();
  console.log(values);
};

const AdvancedForm = () => {
  return (
    <Formik
      initialValues={{
        type: "buyer",
        name: "",
        code: "",
        address: "",
        zipCode: "",
        city: "",
        country: "",
        cif: "",
        ocr: "",
        iban: "",
        swift: "",
        bank: "",
        contact: "",
        phone1: "",
        phone2: "",
        email: "",
        website: "",
        notes: "",
        category: [], // if type is "buyer", category can be an empty array
      }}
      validationSchema={advancedSchema}
      onSubmit={onSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit} className="filter">
          <select
            name="type"
            placeholder="Type"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.type}
          >
            <option value="buyer">Buyer</option>
            <option value="supplier">Supplier</option>
          </select>
          {values.type === "supplier" && (
            <>
              <FormLabel htmlFor="category">
                Category: (ctrl for multi select)
              </FormLabel>
              <select
                name="category"
                placeholder="Category"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.category}
                multiple
              >
                {categoriesList.map((category, index) => (
                  <option value={category} key={index}>
                    {category}
                  </option>
                ))}
              </select>
            </>
          )}
          <FormLabel>Details</FormLabel>

          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
          />
          {errors.name && touched.name && <div>{errors.name}</div>}
          <input
            type="text"
            name="code"
            placeholder="Code"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.code}
          />
          {errors.code && touched.code && <div>{errors.code}</div>}
          <input
            type="text"
            name="address"
            placeholder="Address"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.address}
          />
          <input
            type="text"
            name="zipCode"
            placeholder="Zip Code"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.zipCode}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.city}
          />
          {errors.city && touched.city && <div>{errors.city}</div>}
          <select
            name="country"
            placeholder="Country"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.country}
          >
            <option value="">Country</option>
            <option value="Romania">Romania</option>
            <option value="EU">EU</option>
            <option value="Non-EU">Non-EU</option>
          </select>
          {errors.country && touched.country && <div>{errors.country}</div>}
          <FormLabel>Details</FormLabel>

          <input
            type="text"
            name="cif"
            placeholder="CIF"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.cif}
          />
          <input
            type="text"
            name="ocr"
            placeholder="OCR"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.ocr}
          />
          <input
            type="text"
            name="iban"
            placeholder="IBAN"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.iban}
          />
          <input
            type="text"
            name="swift"
            placeholder="SWIFT"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.swift}
          />
          <input
            type="text"
            name="bank"
            placeholder="Bank"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.bank}
          />
          <FormLabel>Contact</FormLabel>
          <input
            type="text"
            name="contact"
            placeholder="Contact"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.contact}
          />
          <input
            type="text"
            name="phone1"
            placeholder="Phone 1"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.phone1}
          />
          <input
            type="text"
            name="phone2"
            placeholder="Phone 2"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.phone2}
          />
          <input
            type="text"
            name="email"
            placeholder="E-mail"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
          />
          {errors.email && touched.email && <div>{errors.email}</div>}
          <input
            type="text"
            name="website"
            placeholder="WWW"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.website}
          />
          <FormLabel>Notes</FormLabel>
          <textarea
            name="notes"
            placeholder="Notes"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.notes}
          />

          <input
            type="submit"
            value="Submit"
            style={{ backgroundColor: "black", color: "white" }}
          />

          <input type="reset" value="Reset" className="resetButton" />
        </form>
      )}
    </Formik>
  );
};
export default AdvancedForm;
