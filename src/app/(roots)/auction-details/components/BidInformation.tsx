"use client";

import { Button, Input, message as antMessage } from "antd";
import { WhatsAppOutlined } from "@ant-design/icons";
import { Calculator, CalendarClock, Mail, Percent, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { getWhatsAppUrl, siteContact } from "@/constants/siteContact";
import { useCreateProductInquiryNotificationMutation } from "@/Redux/api/notificationApi";

const getNumericPrice = (product: any) => {
  const value =
    product?.mainPrice ||
    product?.price ||
    product?.fixedPrice ||
    product?.highestBid ||
    product?.minBid ||
    0;
  const numeric = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
};

const formatBdt = (value: number) =>
  `BDT ${Math.max(0, Math.round(value)).toLocaleString("en-US")}`;

export default function BidInformation({ product }: { product: any }) {
  const vehiclePrice = getNumericPrice(product);
  const [createInquiryNotification, { isLoading: isSendingInquiry }] =
    useCreateProductInquiryNotificationMutation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [messageText, setMessageText] = useState("");
  const [loanAmount, setLoanAmount] = useState(vehiclePrice);
  const [downPayment, setDownPayment] = useState(vehiclePrice ? Math.round(vehiclePrice * 0.2) : 0);
  const [interestRate, setInterestRate] = useState(10.5);
  const [loanTerm, setLoanTerm] = useState(60);
  const whatsappUrl = getWhatsAppUrl(
    `Hello CarClickBD, I am interested in ${product?.title || "this car"} (${product?._id || ""}).`
  );
  const loanSummary = useMemo(() => {
    const principal = Math.max(0, loanAmount - downPayment);
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment =
      principal > 0 && loanTerm > 0
        ? monthlyRate > 0
          ? (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -loanTerm))
          : principal / loanTerm
        : 0;

    return {
      principal,
      monthlyPayment,
      totalPayable: monthlyPayment * loanTerm + downPayment,
    };
  }, [downPayment, interestRate, loanAmount, loanTerm]);

  const handleInquiry = async () => {
    if (!name.trim() || !phone.trim()) {
      antMessage.error("Please enter your name and phone number.");
      return;
    }

    try {
      await createInquiryNotification({
        product: product?._id,
        itemName: product?.title,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: messageText.trim(),
      }).unwrap();
      antMessage.success("Inquiry saved. Our team will respond within 24 hours.");
      setName("");
      setEmail("");
      setPhone("");
      setMessageText("");
    } catch (error) {
      antMessage.error("Failed to send inquiry. Please try again.");
    }
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">
          Seller contact
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-slate-950">
          Contact final availability
        </h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Share your contact details and our team will help you verify availability.
        </p>
      </div>

      <div className="space-y-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          prefix={<UserRound size={16} className="text-slate-400" />}
          className="!rounded-md !py-3"
        />
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          prefix={<Mail size={16} className="text-slate-400" />}
          className="!rounded-md !py-3"
        />
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="WhatsApp number"
          prefix={<WhatsAppOutlined className="text-slate-400" />}
          className="!rounded-md !py-3"
        />
        <Input.TextArea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Write a message to the seller"
          rows={4}
          className="!rounded-md"
        />
        <Button
          type="primary"
          className="!h-12 !w-full !rounded-md !bg-slate-950 !font-bold hover:!bg-sky-600"
          onClick={handleInquiry}
          loading={isSendingInquiry}
        >
          Send inquiry
        </Button>
        <div className="space-y-3">
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="block">
            <Button
              className="!h-12 !w-full !rounded-md !font-bold"
              icon={<WhatsAppOutlined />}
            >
              Chat on WhatsApp
            </Button>
          </a>
          <p className="rounded-md bg-slate-50 p-3 text-xs font-medium leading-5 text-slate-500">
            WhatsApp: {siteContact.whatsapp}. Dealer information is verified before buyer
            handoff.
          </p>
        </div>
        <div className="rounded-lg border border-sky-100 bg-gradient-to-br from-slate-950 via-[#073b82] to-[#0057c2] p-4 text-white shadow-[0_18px_40px_rgba(2,6,23,0.18)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-sky-200">
                Loan calculator
              </p>
              <h3 className="mt-1 text-lg font-black">Estimate monthly payment</h3>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#f0b90b] text-slate-950">
              <Calculator size={20} />
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            <label className="space-y-1">
              <span className="text-xs font-bold text-sky-100">Vehicle price</span>
              <Input
                type="number"
                min={0}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
                className="!h-10 !rounded-md !border-white/20 !bg-white/95 !font-bold !text-slate-950"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1">
                <span className="text-xs font-bold text-sky-100">Down payment</span>
                <Input
                  type="number"
                  min={0}
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value) || 0)}
                  className="!h-10 !rounded-md !border-white/20 !bg-white/95 !font-bold !text-slate-950"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-bold text-sky-100">Term</span>
                <Input
                  type="number"
                  min={1}
                  value={loanTerm}
                  suffix={<CalendarClock size={14} />}
                  onChange={(e) => setLoanTerm(Number(e.target.value) || 1)}
                  className="!h-10 !rounded-md !border-white/20 !bg-white/95 !font-bold !text-slate-950"
                />
              </label>
            </div>

            <label className="space-y-1">
              <span className="text-xs font-bold text-sky-100">Interest rate</span>
              <Input
                type="number"
                min={0}
                step="0.1"
                value={interestRate}
                suffix={<Percent size={14} />}
                onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                className="!h-10 !rounded-md !border-white/20 !bg-white/95 !font-bold !text-slate-950"
              />
            </label>
          </div>

          <div className="mt-4 rounded-md bg-white/10 p-3 ring-1 ring-white/15">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-sky-100">
                  Estimated EMI
                </p>
                <p className="mt-1 text-2xl font-black text-white">
                  {formatBdt(loanSummary.monthlyPayment)}
                </p>
              </div>
              <p className="text-right text-xs font-semibold leading-5 text-sky-100">
                Loan: {formatBdt(loanSummary.principal)}
                <br />
                Total: {formatBdt(loanSummary.totalPayable)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
