import Link from "next/link";
import Shell from "@/components/Shell";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <Shell locale="global">
      <section className="hero hero-sm">
        <div className="wrap">
          <h1>Page not found</h1>
          <p className="lede">The page you were looking for doesn't exist.</p>
          <Link className="btn" href="/">Go to the homepage</Link>
        </div>
      </section>
    </Shell>
  );
}
