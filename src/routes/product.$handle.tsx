import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, productQueryOptions } from "@/lib/shopify";

export const Route = createFileRoute("/product/$handle")({
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(productQueryOptions(params.handle));
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Unavailable — Sea Glass & Shards" }, { name: "robots", content: "noindex" }] };
    const p = loaderData.node;
    const img = p.images.edges[0]?.node.url;
    const desc = p.description.slice(0, 155) || "Handmade from sea glass and ceramic shards.";
    return {
      meta: [
        { title: `${p.title} — Sea Glass & Shards` },
        { name: "description", content: desc },
        { property: "og:title", content: p.title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        ...(img ? [{ property: "og:image", content: img }, { name: "twitter:image", content: img }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl">This piece has washed away</h1>
      <Link to="/shop" className="mt-4 inline-block text-primary">Back to the shop</Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const { data } = useSuspenseQuery(productQueryOptions(handle));
  const product = data!;
  const p = product.node;
  const variants = p.variants.edges.map((e) => e.node);
  const [variantId, setVariantId] = useState(variants[0]?.id);
  const [imageIdx, setImageIdx] = useState(0);
  const variant = variants.find((v) => v.id === variantId) ?? variants[0];
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const images = p.images.edges.map((e) => e.node);

  const add = async () => {
    if (!variant) return;
    await addItem({ product, variantId: variant.id, variantTitle: variant.title, price: variant.price, quantity: 1, selectedOptions: variant.selectedOptions });
    toast.success(`${p.title} added to your basket`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-[2rem] bg-seafoam shadow-soft">
            {images[imageIdx] ? (
              <img src={images[imageIdx].url} alt={images[imageIdx].altText ?? p.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">No photo yet</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button key={img.url} onClick={() => setImageIdx(i)} className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 ${i === imageIdx ? "border-primary" : "border-transparent"}`}>
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          {p.productType && <p className="text-xs uppercase tracking-widest text-primary">{p.productType}</p>}
          <h1 className="mt-2 text-4xl md:text-5xl">{p.title}</h1>
          {variant && <p className="mt-4 font-display text-2xl">{formatPrice(variant.price.amount, variant.price.currencyCode)}</p>}
          <p className="mt-6 whitespace-pre-line leading-relaxed text-muted-foreground">{p.description}</p>

          {variants.length > 1 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {variants.map((v) => (
                <button key={v.id} onClick={() => setVariantId(v.id)} className={`rounded-full border px-4 py-2 text-sm ${v.id === variant?.id ? "border-primary bg-secondary" : "bg-card"}`}>
                  {v.title}
                </button>
              ))}
            </div>
          )}

          <Button size="lg" className="mt-8 w-full rounded-full sm:w-auto sm:px-12" onClick={add} disabled={isLoading || !variant?.availableForSale}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : variant?.availableForSale === false ? "Sold out" : "Add to basket"}
          </Button>
          <p className="mt-6 rounded-2xl bg-sand p-4 text-sm text-secondary-foreground">
            Made by hand from beach-found materials, so colours and shapes vary slightly — that's part of the charm.
          </p>
        </div>
      </div>
    </div>
  );
}
