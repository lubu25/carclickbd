"use client";

import React from "react";
import {
  ArrowRightOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Input, Button, Form, Modal } from "antd";
import { useSendMessageMutation } from "@/Redux/api/contactApi";
import { WhatsAppOutlined } from "@ant-design/icons";
import { getWhatsAppUrl, siteContact } from "@/constants/siteContact";
import { MapPin, ShieldCheck } from "lucide-react";

const contactCards = [
  {
    title: "Office Address",
    icon: MapPin,
    content: (
      <>
        {siteContact.company}
        <br />
        {siteContact.addressLines[0]}
        <br />
        {siteContact.addressLines[1]}
      </>
    ),
  },
  {
    title: "Email",
    icon: MailOutlined,
    content: (
      <a
        href={`mailto:${siteContact.email}`}
        className="font-semibold text-slate-700 transition hover:text-[#003399]"
      >
        {siteContact.email}
      </a>
    ),
  },
];

export default function ContactUsPage() {
  const [form] = Form.useForm();
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  const handleFinish = async (values: any) => {
    try {
      await sendMessage(values).unwrap();
      Modal.success({
        title: "Message Sent!",
        content:
          "Thank you for contacting us. We will get back to you shortly.",
      });
      form.resetFields();
    } catch (error) {
      Modal.error({
        title: "Failed to Send",
        content: "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <main className="bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white md:px-8">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f0b90b]">
            Contact CarClickBD
          </p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-5xl">
                Talk to our team about verified cars, sellers, and auction sheet support.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                Send an inquiry or start a WhatsApp conversation. We will help
                you verify information, understand listing details, and connect
                with the right next step.
              </p>
            </div>

            <a
              href={getWhatsAppUrl("Hello CarClickBD, I need assistance.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/15 bg-white/10 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.18)] backdrop-blur transition hover:border-[#f0b90b]/60 hover:bg-white/15"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#25D366] text-2xl text-white">
                  <WhatsAppOutlined />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-[#f0b90b]">
                    WhatsApp Support
                  </p>
                  <p className="mt-1 text-lg font-black text-white">
                    {siteContact.whatsapp}
                  </p>
                </div>
                <ArrowRightOutlined className="ml-auto text-lg text-white/70" />
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-4">
          {contactCards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-slate-950 text-white">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-950">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm font-medium leading-7 text-slate-600">
                      {item.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="rounded-lg border border-[#f0b90b]/30 bg-[#f0b90b]/10 p-5">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 shrink-0 text-[#003399]" size={20} />
              <p className="text-sm font-semibold leading-7 text-slate-700">
                For faster response, include the car model, stock ID, or page
                link in your message.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_22px_60px_rgba(15,23,42,0.10)] md:p-8">
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#003399]">
              Send Inquiry
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">
              We will get back to you shortly.
            </h2>
          </div>

          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input className="!h-11 !rounded-md" placeholder="Your full name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input className="!h-11 !rounded-md" placeholder="example@email.com" />
            </Form.Item>

            <Form.Item
              label="WhatsApp Number"
              name="phone"
              rules={[
                { required: true, message: "Please enter your WhatsApp number" },
              ]}
            >
              <Input className="!h-11 !rounded-md" placeholder="+880..." />
            </Form.Item>

            <Form.Item
              label="Message"
              name="message"
              rules={[{ required: true, message: "Please enter your message" }]}
            >
              <Input.TextArea
                rows={5}
                className="!rounded-md"
                placeholder="Write your message..."
              />
            </Form.Item>

            <Form.Item className="!mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                className="!h-12 !w-full !rounded-md !bg-[#e50914] !font-black hover:!bg-[#111111]"
              >
                Send Message
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>
    </main>
  );
}
