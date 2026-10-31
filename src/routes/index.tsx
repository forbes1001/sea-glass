import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ProductCard, EmptyProducts } from "@/components/ProductCard";
import { productsQueryOptions } from "@/lib/shopify";
import { getCategories } from "@/lib/categories";
import hero from "@/assets/hero.jpg";
import maker from "@/assets/maker.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sea Glass & Shards — Handmade beach-found crafts" },
      { name: "description", content: "One-of-a-kind jewellery, mosaics and homeware handmade from sea glass and broken ceramics collected on the beach." },
      { property: "og:title", content: "Sea Glass & Shards — Handmade beach-found crafts" },
      { property: "og:description", content: "One-of-a-kind crafts made from sea glass and broken ceramics found on the shore." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions),
  component: Index,
});

function Index() {
  const { data: products } = useSuspenseQuery(productsQueryOptions);
  const tagged = products.filter((p) => p.node.tags.some((t) => t.toLowerCase() === "featured"));
  const featured = (tagged.length ? tagged : products).slice(0, 4);
  const categories = getCategories(products);

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 md:grid-cols-2 md:pt-16">
        <div>
          <div className="mb-6 rounded-2xl border border-primary/20 bg-seafoam px-5 py-4 text-secondary-foreground shadow-soft" role="status">
            <p className="font-semibold">Website coming very soon</p>
            <p className="mt-1 text-sm">Please check back for an update.</p>
          </div>
          <p className="text-sm uppercase tracking-[0.25em] text-primary">Gathered by the tide · made by hand</p>
          <h1 className="mt-4 text-5xl leading-[1.05] md:text-6xl">
            Beautiful treasures from <em className="text-primary">broken things</em>
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            Sea glass and old pottery shards, washed smooth by the waves, reborn as jewellery, mosaics and keepsakes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full px-8"><Link to="/shop">Shop the collection</Link></Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8"><Link to="/contact">Commission a piece</Link></Button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 -z-10 shard bg-blush" />
          <img src={hero} alt="Sea glass and ceramic shard jewellery on sand and driftwood" width={1600} height={1008} className="aspect-[4/3] w-full rounded-[2.5rem] object-cover shadow-soft" />
        </div>
      </section>

      {categories.length > 0 && (
        <section className="mx-auto mt-20 max-w-6xl px-4">
          <h2 className="text-3xl">Browse by category</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((c, i) => (
              <Link key={c} to="/shop" search={{ category: c }} className={`rounded-full px-6 py-3 text-secondary-foreground transition-transform hover:-translate-y-0.5 ${["bg-seafoam", "bg-blush", "bg-sand", "bg-sky"][i % 4]}`}>
                {c}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto mt-20 max-w-6xl px-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl">Featured pieces</h2>
          <Link to="/shop" className="text-sm text-primary underline-offset-4 hover:underline">See everything →</Link>
        </div>
        <div className="mt-8">
          {featured.length === 0 ? (
            <EmptyProducts />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => <ProductCard key={p.node.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto mt-24 grid max-w-6xl items-center gap-10 px-4 md:grid-cols-[2fr_3fr]">
        <img src={maker} alt="Artisan sorting sea glass and pottery shards" width={1008} height={1200} loading="lazy" className="aspect-[4/5] w-full rounded-[2.5rem] object-cover shadow-soft" />
        <div>
          <h2 className="text-4xl">From the shoreline to your home</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every piece begins with a walk on the beach. Frosted glass and fragments of old crockery are gathered by hand,
            sorted by colour, and shaped into something new at a small coastal workbench. No two are ever the same.
          </p>
        </div>
      </section>
    </>
  );
}
