"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/interactive/Reveal";
import { PixelArt } from "@/components/pixel/PixelArt";
import { SPRITES } from "@/components/pixel/sprites";
import { Window } from "@/components/ui/Window";
import { certificates, type Certificate } from "@/content/certificate";
import { Lightbox, type LightboxItem } from "./Lightbox";

// Only certificates with a picture can open in the viewer.
type WithPicture = Certificate & { src: string };
const viewable = certificates.filter((c): c is WithPicture => Boolean(c.src));
const slides: LightboxItem[] = viewable.map((c) => ({ ...c, description: `Issued by ${c.issuer}` }));

function CertificateCard({ cert, index, onOpen }: { cert: Certificate; index: number; onOpen: () => void }) {
  const { title, issuer, year, src, alt, verifyUrl } = cert;

  return (
    <Reveal delay={index * 0.06} className="h-full bg-ink">
      <Window title={issuer} className="lift h-full">
        {src ? (
          <button
            type="button"
            onClick={onOpen}
            aria-label={`View certificate: ${title}`}
            className="relative block aspect-[4/3] w-full cursor-zoom-in bg-paper"
          >
            <Image src={src} alt={alt} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-contain p-3" />
          </button>
        ) : (
          <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 bg-paper">
            <PixelArt art={SPRITES.trophy} className="w-12" />
            <p className="font-pixel text-xs uppercase">Picture coming soon</p>
          </div>
        )}
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="font-pixel text-sm font-bold uppercase leading-tight">{title}</h3>
          {year && <p className="text-sm text-ink/70">Issued {year}</p>}
          {verifyUrl && (
            <a href={verifyUrl} target="_blank" rel="noreferrer" className="chip-btn mt-auto self-start">
              Verify
            </a>
          )}
        </div>
      </Window>
    </Reveal>
  );
}

// Certificate cards + the shared picture viewer. `open` = index in `slides`; null = closed.
export function CertificateGrid() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert, i) => (
          <li key={cert.title}>
            <CertificateCard cert={cert} index={i} onOpen={() => setOpen(viewable.findIndex((v) => v === cert))} />
          </li>
        ))}
      </ul>
      <Lightbox items={slides} index={open} onChange={setOpen} />
    </>
  );
}