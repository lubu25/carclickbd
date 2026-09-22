"use client";
import React from "react";
import {  Button,Divider } from "antd";
import {
  FacebookFilled,
  AppleFilled,
} from "@ant-design/icons";
import google from "../../../../public/assets/icons/google.png";
import Image from "next/image";
const AuthWithThirdPerty = () => {
  return (
    <div>
      {/* Google Button */}
      <Button
      disabled
        icon={
          <Image
            src={google}
            width={500}
            height={500}
            className="w-4 h-4"
            alt={""}
          />
        }
        size="large"
        style={{ width: "100%", marginBottom: "10px" }}
      >
        <span>Continue with Google</span>
      </Button>

      {/* Facebook Button */}
      <Button
      disabled
        icon={<FacebookFilled />}
        size="large"
        style={{
          
          color: "white",
          width: "100%",
          marginBottom: "10px",
        }}
      >
        Continue with Facebook
      </Button>

      {/* Apple Button */}
      <Button
      disabled
        icon={<AppleFilled />}
        size="large"
        style={{
          color: "white",
          width: "100%",
        }}
      >
        Continue with Apple
      </Button>

      {/* Divider */}
      <Divider>or</Divider>
    </div>
  );
};

export default AuthWithThirdPerty;
