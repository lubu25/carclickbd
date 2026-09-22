"use client";

import { ShareAltOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";

import ShareContent from "./share-content";
import ModalWrapper from "@/shared/modal/ModalWrapper";

export default function ShareProductButton() {
  const [isOpenShare, setIsOpenShare] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpenShare(!isOpenShare)}
        icon={<ShareAltOutlined />}
        className="flex items-center bg-zinc-800 text-white border-none hover:bg-zinc-700"
      >
        Share
      </Button>

      <ModalWrapper isOpen={isOpenShare} setIsOpen={setIsOpenShare}>
        <ShareContent url={window.location.href} />
      </ModalWrapper>
    </>
  );
}
