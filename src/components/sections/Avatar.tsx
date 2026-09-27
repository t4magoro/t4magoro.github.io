import Image from "next/image";
import { PixelArt } from "@/components/pixel/PixelArt";
import { SPRITES } from "@/components/pixel/sprites";
import { profile } from "@/content/profile";

// Your photo in a square pixel frame. Until profile.photo is set, the robot mascot stands in.
// Size it with a width class, e.g. "w-24".
export function Avatar({ className = "" }: { className?: string }) {
  return (
    <div className={`relative aspect-square shrink-0 overflow-hidden border-4 border-white bg-sky ${className}`}>
      {profile.photo ? (
        <Image src={profile.photo} alt={`Photo of ${profile.name}`} fill sizes="112px" className="object-cover" />
      ) : (
        <PixelArt art={SPRITES.robot} className="size-full p-2" title="Robot avatar (photo coming soon)" />
      )}
    </div>
  );
}