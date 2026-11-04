import Shell from "@/components/Shell";
import { HomeView } from "@/components/Views";
import { alternatesFor } from "@/lib/locales";

export const metadata = {
  title: { absolute: "ScrizaOne | Fintech, AI & Custom Software Engineering" },
  alternates: { canonical: "/", languages: alternatesFor("") },
};

export default function Page() {
  return (
    <Shell locale="global">
      <HomeView locale="global" />
    </Shell>
  );
}
