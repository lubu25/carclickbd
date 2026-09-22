import React from "react";
import { Button, Result } from "antd";
import Link from "next/link";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Unauthorized 403 ",
  description: "CarEBid Home Page",
};
const NotAuthorizedPage = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Link href={"/"}>
            <Button type="primary">Back Home</Button>
          </Link>
        }
      />
    </div>
  );
};

export default NotAuthorizedPage;
