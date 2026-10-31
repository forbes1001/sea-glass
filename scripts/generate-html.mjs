import { writeFileSync, copyFileSync } from "node:fs";

async function generate() {
  console.log("Generating static HTML pages for Firebase Hosting...");
  const { default: server } = await import("../.output/server/_ssr/ssr.mjs");

  const routes = [
    { path: "/", file: ".output/public/index.html" },
    { path: "/shop", file: ".output/public/shop.html" },
    { path: "/about", file: ".output/public/about.html" },
    { path: "/contact", file: ".output/public/contact.html" },
    { path: "/current-projects", file: ".output/public/current-projects.html" },
  ];

  for (const route of routes) {
    const res = await server.fetch(new Request(`https://claireforbes-1234.web.app${route.path}`), {}, {});
    const html = await res.text();
    writeFileSync(route.file, html, "utf8");
    console.log(`✓ Rendered ${route.path} -> ${route.file} (${html.length} bytes)`);
  }

  // Also write 404.html using index.html so client router can handle dynamic routes
  copyFileSync(".output/public/index.html", ".output/public/404.html");
  console.log("✓ Created .output/public/404.html fallback");
}

generate().catch((err) => {
  console.error("Failed to generate static pages:", err);
  process.exit(1);
});
