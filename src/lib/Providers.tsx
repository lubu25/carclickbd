"use client";
import { store } from "@/Redux/store";
import React from "react";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#00C853",
          },
        }}
      >
        <AntdRegistry>{children}</AntdRegistry>
      </ConfigProvider>
    </Provider>
  );
};

export default Providers;
