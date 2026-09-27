import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Required by output: "export": build the file once, at build time.
export const dynamic = "force-static";

// /sitemap.xml: the list of pages for search engines. Add new pages here.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/art`, changeFrequency: "monthly", priority: 0.6 },
  ];
}