const getProfileUrl = (tokenInfo: any) => {
  let profileUrl = "/";
  if (tokenInfo?.role === "admin" || tokenInfo?.role === "super-admin") {
    profileUrl = "/admin/profile";
  } else if (tokenInfo?.role === "seller") {
    profileUrl = "/seller/profile";
  } else if (tokenInfo?.role === "customer") {
    profileUrl = "/customer/profile";
  }
  return profileUrl;
};

export default getProfileUrl;
