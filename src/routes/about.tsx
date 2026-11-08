import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import maker from "@/assets/maker.jpg";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Studio by the Shore" },
      { name: "description", content: "How one-of-a-kind sea glass and broken ceramic crafts are gathered on the beach and made by hand at a small coastal workbench." },
      { property: "og:title", content: "About Studio by the Shore" },
      { property: "og:description", content: "The maker, the shoreline, and how every piece is found and finished by hand." },
    ],
  }),
  component: About,
});

const steps = [
  {
    title: "Gathered on the walk",
    body: "Every piece starts as a beach find: sea glass frosted by decades in the tide, and shards of old pottery and crockery left behind by the waves.",
    tone: "bg-seafoam",
  },
  {
    title: "Sorted by hand",
    body: "Finds are rinsed, dried and sorted by colour and shape. Only the pieces with soft edges and a story worth keeping make it to the workbench.",
    tone: "bg-blush",
  },
  {
    title: "Made one at a time",
    body: "Shards are drilled, wired and set into silver-toned findings, or pressed into mosaics and trays. Nothing is cast, moulded or made in a batch.",
    tone: "bg-sand",
  },
  {
    title: "Checked before it ships",
    body: "Each finished piece is inspected, photographed and wrapped in recycled paper, so what arrives is exactly the one you fell for.",
    tone: "bg-sky",
  },
];

function About() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 md:grid-cols-2 md:pt-16">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-primary">The maker</p>
          <h1 className="mt-4 text-5xl leading-[1.05] md:text-6xl">
            A beachcomber&apos;s <em className="text-primary">workbench</em>
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            Studio by the Shore is a one-person workshop. Everything here was broken, washed and found —
            then given a second life as something you can actually wear or keep on a shelf.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full px-8"><Link to="/shop">Browse the pieces</Link></Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8"><Link to="/contact">Ask about a commission</Link></Button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 -z-10 shard bg-sand" />
          <img src={maker} alt="The maker sorting sea glass and pottery shards at a coastal workbench" width={1008} height={1200} className="aspect-[4/5] w-full rounded-[2.5rem] object-cover shadow-soft" />
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4">
        <h2 className="text-3xl">From broken to beautiful</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Nothing is bought in. Four things happen between a beach walk and a parcel on your doorstep.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {steps.map((s, i) => (
            <article key={s.title} className={`rounded-[2rem] p-7 ${s.tone}`}>
              <span className="font-display text-2xl text-primary">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 text-xl">{s.title}</h3>
              <p className="mt-2 text-secondary-foreground">{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4">
        <div className="grid items-center gap-10 md:grid-cols-[3fr_2fr]">
          <div>
            <h2 className="text-3xl">Why sea glass and old pottery</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Sea glass is rubbish that time has made lovely. Real pieces are usually decades old, their edges
              softened by the sea, their colour faded by the sun. Broken crockery tells you where it came from —
              a pattern, a maker&apos;s mark, a colour nobody makes any more.
            </p>
            <p className="mt-4 text-lg text-muted-foreground">
              Working only with what the tide leaves behind means stock is small and constantly changing. When a
              piece is gone, it is gone for good — which is rather the point.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 -z-10 shard bg-seafoam" />
            <img src={hero} alt="Sea glass and ceramic shard jewellery laid out on sand and driftwood" width={1600} height={1008} loading="lazy" className="aspect-[4/3] w-full rounded-[2.5rem] object-cover shadow-soft" />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4">
        <div className="bg-shore shard px-8 py-12 text-center md:px-16">
          <h2 className="text-3xl md:text-4xl">Looking for something in particular?</h2>
          <p className="mx-auto mt-3 max-w-lg text-secondary-foreground">
            Commissions are welcome. Tell me the colours, the occasion or the shard you have been saving,
            and I will tell you honestly whether I can make it.
          </p>
          <Button asChild size="lg" className="mt-7 rounded-full px-8"><Link to="/contact">Get in touch</Link></Button>
        </div>
      </section>
    </>
  );
}
