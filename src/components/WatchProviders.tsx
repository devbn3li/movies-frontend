"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getWatchProviders } from "@/lib/api";
import { WatchProvidersResponse, WatchProvider, CountryWatchProviders } from "@/types/index";

interface WatchProvidersProps {
  id: number;
  mediaType: "movie" | "tv";
  country?: string;
}

const WatchProviders = ({ id, mediaType, country = "US" }: WatchProvidersProps) => {
  const [providers, setProviders] = useState<CountryWatchProviders | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data: WatchProvidersResponse = await getWatchProviders(id, mediaType);

        if (data && data.results) {
          // Try to get providers for the specified country, fallback to US
          const countryProviders = data.results[country] || data.results["US"];
          setProviders(countryProviders || null);
        } else {
          setProviders(null);
        }
      } catch (err) {
        console.error("Error fetching watch providers:", err);
        setError("Failed to load watch providers");
        setProviders(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, [id, mediaType, country]);

  const renderProviderSection = (title: string, providerList: WatchProvider[] | undefined) => {
    if (!providerList || providerList.length === 0) return null;

    return (
      <div className="mb-4">
        <h4 className="text-white text-lg font-semibold mb-2">{title}</h4>
        <div className="flex flex-wrap gap-2">
          {providerList.map((provider) => (
            <div
              key={provider.provider_id}
              className="flex flex-col items-center p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
              title={provider.provider_name}
            >
              <Image
                src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                alt={provider.provider_name}
                width={40}
                height={40}
                className="rounded-lg mb-1"
              />
              <span className="text-xs text-white/80 text-center max-w-[60px] truncate">
                {provider.provider_name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="border border-white/20 p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl">
        <h3 className="text-white text-xl font-bold mb-4">Watch Providers</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded mb-2"></div>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-12 h-12 bg-white/20 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-white/20 p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl">
        <h3 className="text-white text-xl font-bold mb-4">Watch Providers</h3>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!providers) {
    return null; // Don't show anything if no providers
  }

  // Check if there are any providers available
  const hasAnyProviders = providers.flatrate?.length ||
    providers.rent?.length ||
    providers.buy?.length ||
    providers.ads?.length ||
    providers.free?.length;

  if (!hasAnyProviders) {
    return null; // Don't show anything if no providers in any category
  }

  return (
    <div className="border border-white/20 p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl">
      <h3 className="text-white text-xl font-bold mb-4">Watch Providers</h3>

      <div className="space-y-4">
        {renderProviderSection("Stream", providers.flatrate)}
        {renderProviderSection("Rent", providers.rent)}
        {renderProviderSection("Buy", providers.buy)}
        {renderProviderSection("Free with Ads", providers.ads)}
        {renderProviderSection("Free", providers.free)}
      </div>
    </div>
  );
};

export default WatchProviders;
