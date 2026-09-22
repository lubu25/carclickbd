import * as yup from "yup";

// Define the validation schema for the Package interface
const packageSchema = yup
  .object({
    internet: yup.string().nullable(),
    voice: yup.string().nullable(),
  })
  .test(
    "at-least-one",
    "At least one field (internet or voice) must be provided",
    function (value) {
      // Return true if at least one field is non-null and non-empty
      return (
        (value?.internet && value.internet.trim() !== "") ||
        (value?.voice && value.voice.trim() !== "") ||
        this.createError({
          message: "At least one field (internet or voice) must be provided",
        })
      );
    },
  );

// Define the validation schema for the Offer interface
const offerSchema = yup.object({
  package: packageSchema.required("Package is required"),
  banner: yup.string().url("Banner must be a valid URL").nullable(), // Assuming banner can be an empty string or null
  discountPercentage: yup
    .string()
    .matches(/^\d+$/, "Discount percentage must be a number"),
  regularPrice: yup
    .string()
    .matches(/^\d+$/, "Regular price must be a number")
    .required("Regular price is required"),
  duration: yup.string().required("Duration is required"),
  termsAndConditions: yup
    .array()
    .of(yup.string().required("Each term must be a string"))
    .min(1, "At least one term and condition is required"),
});

export default offerSchema;
