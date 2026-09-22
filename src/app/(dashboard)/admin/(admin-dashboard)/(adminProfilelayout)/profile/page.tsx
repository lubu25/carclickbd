import ProfileComponentPage from "@/components/dashboardlayout/profile/Page";
import PrivateRoute from "@/components/shared/protectors/PrivateRoute";
import React from "react";

const ProfilePage = () => {
  return (
    <PrivateRoute>
        <ProfileComponentPage />
    </PrivateRoute>
  );
};

export default ProfilePage;
