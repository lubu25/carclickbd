import { redirect } from "next/navigation";

export default function FeaturedAuctionsRedirect() {
  redirect("/cars?featured=true");
}
