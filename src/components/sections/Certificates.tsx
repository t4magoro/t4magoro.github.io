import { CertificateGrid } from "@/components/gallery/CertificateGrid";
import { PixelEdge } from "@/components/pixel/PixelEdge";
import { Section, SectionHeader } from "@/components/ui/Section";

// "Badges": certificates, each with a picture as proof. Data: src/content/certificates.ts.
export function Certificates() {
  return (
    <Section id="badges" className="bg-grass" edge={<PixelEdge color="fill-sky-soft" accent="fill-lemon" offset={40} />}>
      <SectionHeader title="Badges" sub="Certificates I've earned. Click one to see the proof." />
      <CertificateGrid />
    </Section>
  );
}