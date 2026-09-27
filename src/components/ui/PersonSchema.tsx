import { profile } from "@/content/profile";
import { SITE_URL } from "@/lib/site";

// Structured data (JSON-LD): tells Google this site is about a person, and links your profiles.
// Invisible on the page. Check it with https://search.google.com/test/rich-results
export function PersonSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: SITE_URL,
    jobTitle: "Customer Relations Officer",
    worksFor: { "@type": "Organization", name: "PT Uniguard Indonesia" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Telkom University" },
    address: { "@type": "PostalAddress", addressLocality: "Bandung", addressCountry: "ID" },
    knowsAbout: ["Internet of Things", "Microcontrollers", "Project management", "C/C++", "Python"],
    sameAs: [profile.linkedin, profile.github],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}