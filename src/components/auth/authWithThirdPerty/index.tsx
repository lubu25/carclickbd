"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button, Divider, message, Spin } from "antd";
import { FacebookFilled, AppleFilled } from "@ant-design/icons";
import google from "../../../../public/assets/icons/google.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGoogleLoginMutation } from "@/Redux/api/authApi";
import { useAppDispatch } from "@/Redux/hooks";
import { setIsLoggedIn, setProfileInfo } from "@/Redux/Slices/authSlice";
import handleRedirect from "@/utils/handleRedirect";

declare global {
  interface Window {
    google?: any;
  }
}

const AuthWithThirdPerty: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [googleLogin, { isLoading }] = useGoogleLoginMutation();
  const googleBtnContainerRef = useRef<HTMLDivElement>(null);
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);

  const googleClientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "";

  const handleCredentialResponse = async (response: any) => {
    if (!response?.credential) {
      message.error("Could not obtain Google credentials.");
      return;
    }

    try {
      const res = await googleLogin({ credential: response.credential }).unwrap();

      if ((res?.statusCode === 200 || res?.success) && res?.data) {
        const { accessToken, user } = res.data;

        if (user?.isDisabled) {
          message.error("Your account is disabled.");
          return;
        }

        if (accessToken && user) {
          dispatch(setIsLoggedIn(accessToken));
          dispatch(setProfileInfo(user));
          message.success(res?.message || "Signed in with Google successfully!");
          handleRedirect(user?.role, router);
        } else {
          message.error("Invalid response from server. Please try again.");
        }
      } else {
        message.error(res?.message || "Google sign-in failed.");
      }
    } catch (error: any) {
      const errorMsg =
        (typeof error?.data?.message === "string" && error.data.message) ||
        (typeof error?.message === "string" && error.message) ||
        (Array.isArray(error?.errorMessages) && error.errorMessages[0]?.message) ||
        (Array.isArray(error?.data?.errorMessages) && error.data.errorMessages[0]?.message) ||
        "Google sign-in failed. Please check your credentials.";
      message.error(errorMsg);
    }
  };

  useEffect(() => {
    // Dynamically load Google Identity Services script if not present
    const scriptId = "google-gsi-client";
    const existingScript = document.getElementById(scriptId);

    const initializeGoogle = () => {
      if (window.google?.accounts?.id && googleClientId) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleCredentialResponse,
        });

        if (googleBtnContainerRef.current) {
          googleBtnContainerRef.current.innerHTML = "";
          window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
            theme: "outline",
            size: "large",
            width: "384",
            text: "continue_with",
            shape: "rectangular",
            logo_alignment: "left",
          });
        }
        setIsGsiLoaded(true);
      }
    };

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.body.appendChild(script);
    } else {
      initializeGoogle();
    }
  }, [googleClientId]);

  const handleCustomGoogleClick = () => {
    if (!googleClientId) {
      message.warning(
        "Google Client ID is not configured yet. Please add NEXT_PUBLIC_GOOGLE_CLIENT_ID to your .env file."
      );
      return;
    }

    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      message.loading("Loading Google sign-in...");
    }
  };

  return (
    <div>
      {/* Google Button */}
      <div className="w-full mb-2.5">
        {googleClientId && isGsiLoaded ? (
          <div className="flex justify-center w-full min-h-[40px]">
            {isLoading ? (
              <div className="flex items-center justify-center py-2">
                <Spin size="small" />
                <span className="ml-2 text-xs text-slate-500">Signing in with Google...</span>
              </div>
            ) : (
              <div ref={googleBtnContainerRef} className="w-full flex justify-center" />
            )}
          </div>
        ) : (
          <Button
            onClick={handleCustomGoogleClick}
            loading={isLoading}
            icon={
              <Image
                src={google}
                width={20}
                height={20}
                className="w-4 h-4 inline-block"
                alt="Google"
              />
            }
            size="large"
            style={{ width: "100%" }}
            className="flex items-center justify-center font-medium"
          >
            <span>Continue with Google</span>
          </Button>
        )}
      </div>

      {/* Facebook Button (Placeholder) */}
      <Button
        disabled
        icon={<FacebookFilled />}
        size="large"
        style={{
          width: "100%",
          marginBottom: "10px",
        }}
        title="Facebook login coming soon"
      >
        Continue with Facebook
      </Button>

      {/* Apple Button (Placeholder) */}
      <Button
        disabled
        icon={<AppleFilled />}
        size="large"
        style={{
          width: "100%",
        }}
        title="Apple login coming soon"
      >
        Continue with Apple
      </Button>

      {/* Divider */}
      <Divider>or</Divider>
    </div>
  );
};

export default AuthWithThirdPerty;

