import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "./CartDrawer";
import { NewsletterForm } from "./NewsletterForm";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/shop", label: "Shop" },
  { to: "/current-projects", label: "Current Projects" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="font-display text-xl">
          Sea Glass <span className="italic text-primary">&amp;</span> Shards
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground font-semibold" }} activeOptions={{ exact: true }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <CartDrawer />
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {open && (
        <nav className="flex flex-col border-t px-4 py-2 md:hidden">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-3 text-base">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-shore">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2">
        <div>
          <h2 className="text-3xl">Hear about new finds first</h2>
          <p className="mt-2 max-w-sm text-secondary-foreground">
            Every piece is one of a kind. Join the list and be the first to know when a fresh batch leaves the workbench.
          </p>
          <div className="mt-5">
            <NewsletterForm />
          </div>
        </div>
        <div className="flex flex-col gap-2 text-sm text-secondary-foreground md:items-end">
          <Link to="/shop">Shop all</Link>
          <Link to="/contact">Contact &amp; commissions</Link>
          <p className="mt-6">© {new Date().getFullYear()} Sea Glass &amp; Shards · Handmade by the sea</p>
        </div>
      </div>
    </footer>
  );
}
