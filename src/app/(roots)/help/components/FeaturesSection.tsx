import { Typography } from "antd";
import {
  CheckCircleOutlined,
  DollarOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const features = [
  {
    id: 1,
    icon: <SearchOutlined />,
    title: "Cool Car Stock",
    description:
      "Explore a diverse collection of quality vehicles, from compact city cars to premium SUVs and luxury models. Every listing includes detailed specifications, clear photos, and transparent pricing to help you make the right choice. Our inventory is updated regularly, so you can discover fresh options that match your needs and budget.",
  },
  {
    id: 2,
    icon: <DollarOutlined />,
    title: "Cost Free",
    description:
      "CarClickBD believes in transparent pricing with no hidden charges. Clear listing information helps you understand the total cost upfront and make an informed buying decision with confidence.",
  },
  {
    id: 3,
    icon: <CheckCircleOutlined />,
    title: "Easy to Use",
    description:
      "CarClickBD makes online vehicle buying and selling simple with practical search, listing, inquiry, and comparison tools designed for a smooth marketplace experience.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="rounded-lg bg-slate-50 p-6 md:p-10">
      <div className="mb-10 max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
          How it Works
        </p>
        <Title level={1} className="!mb-3 !text-slate-950">
          A simpler way to find the right vehicle
        </Title>
        <Paragraph className="!text-base !leading-7 !text-slate-600">
          Browse fresh vehicle stock, review clear details, and contact sellers
          with confidence through CarClickBD.
        </Paragraph>
        <div className="mt-5 h-1.5 w-28 rounded-full bg-[#f0b90b]" />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.id}
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-sky-50 text-2xl text-[#003399] ring-1 ring-sky-100">
              {feature.icon}
            </div>
            <Title level={3} className="!mb-3 !text-xl !font-black !text-slate-950">
              {feature.title}
            </Title>
            <p className="text-sm font-medium leading-7 text-slate-600">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
