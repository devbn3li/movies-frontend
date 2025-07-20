"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getWatchProviders } from "@/lib/api";
import { WatchProvidersResponse, WatchProvider } from "@/types/index";

interface CompactWatchProvidersProps {
  id: number;
  mediaType: "movie" | "tv";
  country?: string;
  maxProviders?: number;
}

const CompactWatchProviders = ({
  id,
  mediaType,
  country = "US",
  maxProviders = 3
}: CompactWatchProvidersProps) => {
  const [providers, setProviders] = useState<WatchProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      setIsLoading(true);

      try {
        const data: WatchProvidersResponse = await getWatchProviders(id, mediaType);

        if (data && data.results) {
          const countryProviders = data.results[country] || data.results["US"];

          if (countryProviders) {
            // Prioritize streaming services (flatrate) first, then other options
            const allProviders = [
              ...(countryProviders.flatrate || []),
              ...(countryProviders.rent || []),
              ...(countryProviders.buy || []),
              ...(countryProviders.ads || []),
              ...(countryProviders.free || [])
            ];

            // Remove duplicates and take only the first few
            const uniqueProviders = allProviders
              .filter((provider, index, self) =>
                index === self.findIndex(p => p.provider_id === provider.provider_id)
              )
              .slice(0, maxProviders);

            setProviders(uniqueProviders);
          } else {
            setProviders([]);
          }
        } else {
          setProviders([]);
        }
      } catch (error) {
        console.error("Error fetching compact watch providers:", error);
        setProviders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, [id, mediaType, country, maxProviders]);

  if (isLoading) {
    return (
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (providers.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-1" title="Available on:">
      {providers.map((provider) => (
        <Image
          key={provider.provider_id}
          src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
          alt={provider.provider_name}
          width={24}
          height={24}
          className="rounded"
          title={provider.provider_name}
        />
      ))}
      {providers.length === maxProviders && (
        <span className="text-xs text-gray-500 ml-1">+</span>
      )}
    </div>
  );
};

export default CompactWatchProviders;
