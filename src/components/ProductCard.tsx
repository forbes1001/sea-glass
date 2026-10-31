import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const p = product.node;
  const variant = p.variants.edges[0]?.node;
  const image = p.images.edges[0]?.node;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success(`${p.title} added to your basket`);
  };

  return (
    <Link to="/product/$handle" params={{ handle: p.handle }} className="group flex flex-col rounded-3xl bg-card p-3 shadow-soft transition-transform hover:-translate-y-1">
      <div className="aspect-square overflow-hidden rounded-2xl bg-seafoam">
        {image ? (
          <img src={image.url} alt={image.altText ?? p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No photo yet</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 px-1 pt-3">
        {p.productType && <span className="text-xs uppercase tracking-widest text-muted-foreground">{p.productType}</span>}
        <h3 className="text-lg leading-snug">{p.title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-semibold">{formatPrice(p.priceRange.minVariantPrice.amount, p.priceRange.minVariantPrice.currencyCode)}</span>
          <Button size="sm" className="rounded-full" onClick={handleAdd} disabled={isLoading || !variant?.availableForSale}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : variant?.availableForSale === false ? "Sold out" : "Add to basket"}
          </Button>
        </div>
      </div>
    </Link>
  );
}

export function EmptyProducts() {
  return (
    <div className="rounded-3xl border border-dashed bg-card p-12 text-center text-muted-foreground">
      <p className="font-display text-xl text-foreground">No products found</p>
      <p className="mt-2 text-sm">New treasures are being made — check back soon.</p>
    </div>
  );
}
