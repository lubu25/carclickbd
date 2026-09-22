export const getErrorMessageByPropertyName = (
  errors: any,
  propertyPath: string,
) => {
  const properties = propertyPath.split(".");
  let value = errors;

  for (let prop of properties) {
    if (value && value[prop]) {
      value = value[prop];
    } else {
      return undefined;
    }
  }

  return value?.message;
};
