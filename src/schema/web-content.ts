import * as Yup from "yup";

// Define the validation schema for the IHeaderCarouselSlide interface
const headerCarouselYupValidationSchema = Yup.object().shape({
  slideTitle: Yup.string().required("slideTitle is required"),
  slideText: Yup.string().required("slideText is required"),
  slideButton: Yup.object()
    .shape({
      label: Yup.string().required("slideButton.label is required"),
      link: Yup.string().required("slideButton.link is required"),
    })
    .required("slideButton is required"),
});

export const webContentValidation = {
  headerCarouselYupValidationSchema,
};
