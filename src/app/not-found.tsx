import { Button, Result } from "antd";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, this carclickbd page does not exist."
        extra={
          <Link href={"/"}>
            <Button type="primary">Back Home</Button>
          </Link>
        }
      />
    </div>
  );
};

export default NotFound;
