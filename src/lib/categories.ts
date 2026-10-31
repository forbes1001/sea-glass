import type { ShopifyProduct } from "./shopify";

export function getCategories(products: ShopifyProduct[]): string[] {
  return Array.from(new Set(products.map((p) => p.node.productType).filter(Boolean))).sort();
}

export function filterProducts(products: ShopifyProduct[], q?: string, category?: string) {
  const term = q?.trim().toLowerCase();
  return products.filter((p) => {
    if (category && p.node.productType !== category) return false;
    if (!term) return true;
    const hay = [p.node.title, p.node.description, p.node.productType, ...p.node.tags].join(" ").toLowerCase();
    return hay.includes(term);
  });
}
