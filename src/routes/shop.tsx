import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { ProductCard, EmptyProducts } from "@/components/ProductCard";
import { productsQueryOptions } from "@/lib/shopify";
import { filterProducts, getCategories } from "@/lib/categories";

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Shop — Studio by the Shore" },
      { name: "description", content: "Browse handmade sea glass jewellery, ceramic shard mosaics and coastal homeware." },
      { property: "og:title", content: "Shop — Studio by the Shore" },
      { property: "og:description", content: "Browse handmade sea glass and ceramic shard crafts." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions),
  component: Shop,
});

function Shop() {
  const { q, category } = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const { data: products } = useSuspenseQuery(productsQueryOptions);
  const categories = getCategories(products);
  const results = filterProducts(products, q, category);

  const chip = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm transition-colors ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-seafoam"}`;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="text-4xl md:text-5xl">The collection</h1>
      <p className="mt-2 text-muted-foreground">Each piece is handmade and one of a kind.</p>

      <div className="relative mt-8 max-w-md">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search earrings, mosaics, blue glass…"
          defaultValue={q ?? ""}
          onChange={(e) => navigate({ search: (s) => ({ ...s, q: e.target.value || undefined }), replace: true })}
          className="h-12 rounded-full bg-card pl-11"
          aria-label="Search products"
        />
      </div>

      {categories.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <button className={chip(!category)} onClick={() => navigate({ search: (s) => ({ ...s, category: undefined }) })}>All</button>
          {categories.map((c) => (
            <button key={c} className={chip(category === c)} onClick={() => navigate({ search: (s) => ({ ...s, category: c }) })}>
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="mt-10">
        {results.length === 0 ? (
          <EmptyProducts />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => <ProductCard key={p.node.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
