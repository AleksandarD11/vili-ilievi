"use client";

import { useQuery } from "@tanstack/react-query";
import { CloudSun } from "lucide-react";

import { useSiteCopy } from "@/hooks/use-site-copy";

type WeatherResponse = {
  current?: {
    temperature_2m: number;
  };
};

async function fetchWeather() {
  const response = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=41.9517&longitude=24.1571&current=temperature_2m&timezone=Europe%2FSofia",
  );

  if (!response.ok) {
    throw new Error("Failed to load weather");
  }

  return (await response.json()) as WeatherResponse;
}

export function WeatherPill() {
  const { copy } = useSiteCopy();
  const { data } = useQuery({
    queryKey: ["weather", "tsigov-chark"],
    queryFn: fetchWeather,
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });

  const temperature = data?.current?.temperature_2m;

  return (
    <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-stone-100/80 backdrop-blur-md md:flex">
      <CloudSun className="h-4 w-4 text-bronze-300" />
      <span>
        {copy.weather.label}: {typeof temperature === "number" ? `${Math.round(temperature)}°C` : copy.weather.loading}
      </span>
    </div>
  );
}
