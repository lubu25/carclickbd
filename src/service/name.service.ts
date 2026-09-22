const FullName = (name: any): string => {
  if (name?.firstName && name?.lastName) {
    return `${name?.firstName} ${" "} ${name?.lastName}`;
  } else {
    return name?.firstName || "";
  }
};

export default FullName;
