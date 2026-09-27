import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Required by output: "export": build the file once, at build time.
export const dynamic = "force-static";

// /robots.txt: lets every search engine in and points them to the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}