import * as yup from "yup";

export const SignUpSchema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),

  name: yup.string().required("Username is required"),
});
export const signInSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const resetPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters") // Adjusted to match the error message
    .max(20, "Password must be at most 20 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
  confirmNewPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("newPassword"), ""], "Passwords must match"),
});

export const changePasswordSchema = yup.object().shape({
  oldPassword: yup
    .string()
    .required("old password is required")
    .min(6, "Current password must be at least 6 characters long"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(6, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your new password")
    .oneOf([yup.ref("newPassword"), ""], "Passwords must match"),
});

export const changeEmailSchema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"),
  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email address"),
});

export const bangladeshiContactNumberSchema = yup.object().shape({
  contactNo: yup.string().required("Contact number is required"),
  // .matches(
  //   /^(?:\+880|880)?\d{10}$/,
  //   "Must be a valid Bangladeshi contact number"
  // ),
});
