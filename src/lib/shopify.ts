import { toast } from "sonner";
import { queryOptions } from "@tanstack/react-query";

export const SHOPIFY_API_VERSION = "2026-10";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "sea-glass-shards-d7m3b-fvwwqxiz.myshopify.com";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
export const SHOPIFY_STOREFRONT_TOKEN = "380dafbb2df3f4575a1a5ea52c775ec5";

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    productType: string;
    tags: string[];
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
    images: { edges: Array<{ node: { url: string; altText: string | null } }> };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: { amount: string; currencyCode: string };
          availableForSale: boolean;
          selectedOptions: Array<{ name: string; value: string }>;
        };
      }>;
    };
    options: Array<{ name: string; values: string[] }>;
  };
}

const PRODUCT_FIELDS = `
  id title description handle productType tags
  priceRange { minVariantPrice { amount currencyCode } }
  images(first: 5) { edges { node { url altText } } }
  variants(first: 10) { edges { node { id title price { amount currencyCode } availableForSale selectedOptions { name value } } } }
  options { name values }
`;

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) { edges { node { ${PRODUCT_FIELDS} } } }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProduct($handle: String!) {
    productByHandle(handle: $handle) { ${PRODUCT_FIELDS} }
  }
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}): Promise<any> {
  try {
    const response = await fetch(SHOPIFY_STOREFRONT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (response.status === 402) {
      if (typeof window !== "undefined") {
        toast.error("Shopify: Payment required", {
          description:
            "Shopify API access requires an active Shopify billing plan. Visit https://admin.shopify.com to upgrade.",
        });
      }
      return { data: { products: { edges: [] } } };
    }
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data.errors) {
      throw new Error(`Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(", ")}`);
    }
    return data;
  } catch (error) {
    console.error("Shopify storefront API error:", error);
    return { data: { products: { edges: [] } } };
  }
}

export async function fetchProducts(first = 100, query?: string): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(PRODUCTS_QUERY, { first, query: query || null });
  return data?.data?.products?.edges ?? [];
}

export async function fetchProduct(handle: string): Promise<ShopifyProduct | null> {
  const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
  const node = data?.data?.productByHandle;
  return node ? { node } : null;
}

export const productsQueryOptions = queryOptions({
  queryKey: ["products"],
  queryFn: () => fetchProducts(100),
});

export const productQueryOptions = (handle: string) =>
  queryOptions({ queryKey: ["product", handle], queryFn: () => fetchProduct(handle) });

export function formatPrice(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: currencyCode }).format(parseFloat(amount));
}
