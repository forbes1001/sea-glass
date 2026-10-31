import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & commissions — Sea Glass & Shards" },
      { name: "description", content: "Get in touch about an order, a custom commission, or sea glass you'd like turned into something special." },
      { property: "og:title", content: "Contact — Sea Glass & Shards" },
      { property: "og:description", content: "Questions, orders and custom commissions." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Please add your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  message: z.string().trim().min(1, "Please write a message").max(2000),
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Please check the form"); return; }
    setBusy(true);
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    setBusy(false);
    if (error) { toast.error("Sorry, your message didn't send. Please try again."); return; }
    setSent(true);
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-4 pt-12 md:grid-cols-2">
      <div>
        <h1 className="text-4xl md:text-5xl">Say hello</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Questions about a piece, a gift, or a commission using glass or pottery from your own favourite beach? I'd love to hear from you.
        </p>
        <div className="mt-8 rounded-3xl bg-shore p-6 text-secondary-foreground">
          <p className="font-display text-xl">Commissions</p>
          <p className="mt-2 text-sm">Send me a little about what you have in mind and I'll reply within a few days.</p>
        </div>
      </div>
      <div className="rounded-3xl bg-card p-6 shadow-soft md:p-8">
        {sent ? (
          <div className="py-12 text-center">
            <p className="font-display text-2xl">Thank you!</p>
            <p className="mt-2 text-muted-foreground">Your message is on its way. I'll be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="rounded-xl" />
            </div>
            <Button type="submit" size="lg" className="w-full rounded-full" disabled={busy}>
              {busy ? "Sending…" : "Send message"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
