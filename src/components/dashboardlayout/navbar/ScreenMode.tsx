"use client";
import React, { useState, useEffect } from "react";
import { GoScreenFull } from "react-icons/go";
import { RxExitFullScreen } from "react-icons/rx";

const ScreenMode = () => {
  const [isFullScreen, setFullScreen] = useState(false);

  // Function to enter full-screen mode
  const enterFullScreen = () => {
    const elem = document.documentElement as HTMLElement & {
      mozRequestFullScreen?: () => Promise<void>;
      webkitRequestFullscreen?: () => Promise<void>;
      msRequestFullscreen?: () => Promise<void>;
    };

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      // Firefox
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      // Chrome, Safari and Opera
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      // IE/Edge
      elem.msRequestFullscreen();
    }
    setFullScreen(true);
  };

  // Function to exit full-screen mode
  const exitFullScreen = () => {
    const doc = document as Document & {
      mozCancelFullScreen?: () => Promise<void>;
      webkitExitFullscreen?: () => Promise<void>;
      msExitFullscreen?: () => Promise<void>;
    };

    if (doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if (doc.mozCancelFullScreen) {
      // Firefox
      doc.mozCancelFullScreen();
    } else if (doc.webkitExitFullscreen) {
      // Chrome, Safari and Opera
      doc.webkitExitFullscreen();
    } else if (doc.msExitFullscreen) {
      // IE/Edge
      doc.msExitFullscreen();
    }
    setFullScreen(false);
  };

  // Toggle full-screen mode
  const toggleFullScreen = () => {
    if (isFullScreen) {
      exitFullScreen();
    } else {
      enterFullScreen();
    }
  };

  // Add event listeners to detect when full-screen mode changes
  useEffect(() => {
    const handleFullScreenChange = () => {
      setFullScreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("mozfullscreenchange", handleFullScreenChange);
    document.addEventListener("MSFullscreenChange", handleFullScreenChange);

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullScreenChange,
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullScreenChange,
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullScreenChange,
      );
    };
  }, []);

  return (
    <div>
      <button
        onClick={toggleFullScreen}
        className="relative text-gray-500 sm:h-[3rem] h-[2.5rem]   sm:w-[3rem] w-[2.5rem]  text-[1.5rem] sm:text-2xl flex items-center justify-center   hover:bg-slate-200 colortransition p-2 rounded-full dark:hover:text-gray-500          "
      >
        {isFullScreen ? <RxExitFullScreen /> : <GoScreenFull />}
      </button>
    </div>
  );
};

export default ScreenMode;
