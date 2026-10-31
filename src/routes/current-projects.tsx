import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import maker from "@/assets/maker.jpg";

export const Route = createFileRoute("/current-projects")({
  head: () => ({
    meta: [
      { title: "Current Projects — Sea Glass & Shards" },
      { name: "description", content: "What is on the workbench right now: sea glass and broken ceramic pieces in progress, commissions under way, and what is coming next." },
      { property: "og:title", content: "Current Projects — Sea Glass & Shards" },
      { property: "og:description", content: "A look at the workbench: pieces in progress, commissions under way, and what is coming next." },
    ],
  }),
  component: CurrentProjects,
});

const projects = [
  {
    name: "Tide-line mirror",
    status: "In progress",
    tone: "bg-seafoam",
    progress: 65,
    stage: "Setting the shards",
    body: "A round driftwood-framed mirror edged with frosted sea glass in greens and blues. The frame is finished and the shards are being pressed into the border, one by one.",
    when: "Aiming to finish by the end of November",
  },
  {
    name: "House sign for a cottage in the dunes",
    status: "Commission",
    tone: "bg-blush",
    progress: 40,
    stage: "Lettering laid out",
    body: "A mosaic house sign built from broken crockery the family saved from their old kitchen. Colours are matched, and the letters are laid out on the backing board.",
    when: "Being photographed as it goes",
  },
  {
    name: "Winter tray collection",
    status: "Gathering",
    tone: "bg-sky",
    progress: 15,
    stage: "Sorting finds",
    body: "Six small trays in grey, smoke and pale green, using the shards that only turn up once the storms start moving the sand. Still waiting on enough usable glass.",
    when: "Expected in the shop after the new year",
  },
  {
    name: "Shard and wire earrings",
    status: "Nearly done",
    tone: "bg-sand",
    progress: 90,
    stage: "Final hooking",
    body: "A small run of single-shard earrings, each one wired by hand. Most are strung and boxed; the last few need their hooks closed and a photo each.",
    when: "Going up as soon as the photos are taken",
  },
];

function CurrentProjects() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 md:grid-cols-2 md:pt-16">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-primary">On the workbench</p>
          <h1 className="mt-4 text-5xl leading-[1.05] md:text-6xl">
            What I&apos;m making <em className="text-primary">just now</em>
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            A running note of the pieces in progress, the commissions being built, and what should be
            coming through the shop next. Nothing here is mass-produced, so timings move with the tide and the weather.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full px-8"><Link to="/shop">See what&apos;s ready</Link></Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8"><Link to="/contact">Start a commission</Link></Button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 -z-10 shard bg-blush" />
          <img src={maker} alt="Sea glass and pottery shards laid out on a workbench mid-project" width={1008} height={1200} className="aspect-[4/5] w-full rounded-[2.5rem] object-cover shadow-soft" />
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4">
        <h2 className="text-3xl">In progress</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Each project is worked on alongside everything else, so a piece can pause while the glue dries
          or while I wait for the right shard to turn up.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <article key={p.name} className="rounded-[2rem] border bg-card p-7 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-2xl">{p.name}</h3>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold text-secondary-foreground ${p.tone}`}>
                  {p.status}
                </span>
              </div>
              <p className="mt-3 text-muted-foreground">{p.body}</p>
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs text-secondary-foreground">
                  <span>{p.stage}</span>
                  <span>{p.progress}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${p.progress}%` }} />
                </div>
              </div>
              <p className="mt-4 text-sm text-secondary-foreground">{p.when}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4">
        <div className="bg-shore shard px-8 py-12 text-center md:px-16">
          <h2 className="text-3xl md:text-4xl">Want a piece made to your own brief?</h2>
          <p className="mx-auto mt-3 max-w-lg text-secondary-foreground">
            I take on a small number of commissions at a time so each one gets the attention it needs.
            Send me the colours, the size and the story, and I will tell you honestly whether it fits.
          </p>
          <Button asChild size="lg" className="mt-7 rounded-full px-8"><Link to="/contact">Tell me about it</Link></Button>
        </div>
      </section>
    </>
  );
}
