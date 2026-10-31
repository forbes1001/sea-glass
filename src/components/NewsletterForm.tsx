import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const schema = z.string().trim().email("Please enter a valid email").max(255);

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(email);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Please check the form"); return; }
    setBusy(true);
    const { error } = await supabase.from("subscribers").insert({ email: parsed.data.toLowerCase() });
    setBusy(false);
    if (error && error.code !== "23505") { toast.error("Something went wrong, please try again."); return; }
    toast.success("Thank you! You're on the list for new pieces.");
    setEmail("");
  };

  return (
    <form onSubmit={submit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
      <Input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-full bg-card" aria-label="Email address" />
      <Button type="submit" className="h-11 rounded-full px-6" disabled={busy}>
        {busy ? "Joining…" : "Join the list"}
      </Button>
    </form>
  );
}
