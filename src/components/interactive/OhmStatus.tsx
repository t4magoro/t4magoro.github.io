"use client";

import { useEffect, useState } from "react";

// How Ohm is doing right now, read from its public API once per visit.
type Stat = { v: number; at: number; rate: number };
type OhmState = {
  pet: { status: "on" | "off"; charge: Stat; mood: Stat };
  weather: { isDay: boolean };
  online: number;
  now: number;
};

// Same formula as Ohm's own code: a stat drains in real time from its last saved value.
const valueNow = (s: Stat, now: number) => Math.max(0, s.v - (s.rate * (now - s.at)) / 3_600_000);

function describe({ pet, weather, online, now }: OhmState) {
  const charge = valueNow(pet.charge, now);
  const mood = valueNow(pet.mood, now);
  if (pet.status === "off" || charge === 0) return { on: false, text: "Ohm is off. Go reboot it!" };
  const feeling = !weather.isDay ? "asleep" : mood >= 60 ? "happy" : mood >= 25 ? "okay" : "sad";
  return {
    on: true,
    text: `Ohm is ${feeling} · mood ${Math.round(mood)}% · battery ${Math.round(charge)}% · ${online} online`,
  };
}

export function OhmStatus({ api }: { api: string }) {
  const [status, setStatus] = useState<{ on: boolean; text: string } | null>(null);

  useEffect(() => {
    let live = true;
    fetch(`${api}/state`)
      .then((res) => (res.ok ? (res.json() as Promise<OhmState>) : Promise.reject(new Error(`${res.status}`))))
      .then((s) => live && setStatus(describe(s)))
      .catch(() => live && setStatus({ on: false, text: "Ohm can't be reached right now" }));
    return () => {
      live = false;
    };
  }, [api]);

  return (
    <p className="flex items-center gap-2 border-2 border-ink bg-paper px-2 py-1 text-xs" aria-live="polite">
      <span aria-hidden className={`size-2 shrink-0 ${status?.on ? "bg-grass" : "bg-pink"}`} />
      <span>
        <b className="font-pixel uppercase">Live</b> {status ? status.text : "Checking on Ohm…"}
      </span>
    </p>
  );
}