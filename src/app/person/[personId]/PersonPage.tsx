"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Person,
  PersonCredits,
  PersonMovieCredit,
  PersonTVCredit,
  PersonImages,
  PersonExternalIds
} from "@/types/index";
import {
  getPersonDetails,
  getPersonMovieCredits,
  getPersonTVCredits,
  getPersonImages,
  getPersonExternalIds
} from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Star, Film, Tv, Camera } from "lucide-react";
import SocialMediaLinks from "@/components/common/SocialMediaLinks/SocialMediaLinks";

interface PersonPageProps {
  personId: number;
}

export default function PersonPage({ personId }: PersonPageProps) {
  const [person, setPerson] = useState<Person | null>(null);
  const [movieCredits, setMovieCredits] = useState<PersonCredits | null>(null);
  const [tvCredits, setTvCredits] = useState<PersonCredits | null>(null);
  const [images, setImages] = useState<PersonImages | null>(null);
  const [externalIds, setExternalIds] = useState<PersonExternalIds | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullBio, setShowFullBio] = useState(false);

  useEffect(() => {
    const fetchPersonData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [personData, movieCreditsData, tvCreditsData, imagesData, externalIdsData] = await Promise.all([
          getPersonDetails(personId),
          getPersonMovieCredits(personId),
          getPersonTVCredits(personId),
          getPersonImages(personId),
          getPersonExternalIds(personId)
        ]);

        if (personData) {
          setPerson(personData);
          setMovieCredits(movieCreditsData);
          setTvCredits(tvCreditsData);
          setImages(imagesData);
          setExternalIds(externalIdsData);
        } else {
          setError('Person not found');
        }
      } catch (error) {
        console.error('Error fetching person data:', error);
        setError('Failed to load person information');
      } finally {
        setLoading(false);
      }
    };

    if (personId) {
      fetchPersonData();
    }
  }, [personId]);

  const placeholderAvatar = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PC9kZWZzPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiByeD0iMTYiIGZpbGw9IiM0QjU1NjMiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxNjAiIHI9IjUwIiBmaWxsPSIjOUNBM0FGIi8+PHBhdGggZD0iTTE1MCAyNDBDMTEwIDI0MCA3NSAyNzUgNzUgMzE1VjM3MEgyMjVWMzE1QzIyNSAyNzUgMTkwIDI0MCAxNTAgMjQwWiIgZmlsbD0iIzlDQTNBRiIvPjwvc3ZnPg==";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthday: string, deathday?: string | null) => {
    const birthDate = new Date(birthday);
    const endDate = deathday ? new Date(deathday) : new Date();
    const age = endDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = endDate.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const getGenderText = (gender: number) => {
    switch (gender) {
      case 1: return 'Female';
      case 2: return 'Male';
      default: return 'Not specified';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Image Skeleton */}
            <div className="lg:col-span-1">
              <Skeleton className="w-full aspect-[2/3] rounded-2xl" />
            </div>

            {/* Details Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Person Not Found</h1>
          <p className="text-gray-300 mb-6">{error || 'The person you are looking for does not exist.'}</p>
          <Link href="/main-movies">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Back to Movies
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const allMovieCredits = [
    ...(movieCredits?.cast || []),
    ...(movieCredits?.crew || [])
  ].sort((a, b) => {
    const dateA = new Date((a as PersonMovieCredit).release_date || '0').getTime();
    const dateB = new Date((b as PersonMovieCredit).release_date || '0').getTime();
    return dateB - dateA;
  });

  const allTVCredits = [
    ...(tvCredits?.cast || []),
    ...(tvCredits?.crew || [])
  ].sort((a, b) => {
    const dateA = new Date((a as PersonTVCredit).first_air_date || '0').getTime();
    const dateB = new Date((b as PersonTVCredit).first_air_date || '0').getTime();
    return dateB - dateA;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent z-10"></div>

        <div className="relative z-20 max-w-7xl mx-auto p-6 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Image */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="relative">
                  <Image
                    src={
                      person.profile_path
                        ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                        : placeholderAvatar
                    }
                    alt={person.name}
                    width={500}
                    height={750}
                    className="w-full rounded-2xl shadow-2xl object-cover aspect-[2/3] border border-white/20"
                    priority
                  />

                  {/* Popularity Badge */}
                  <div className="absolute top-4 right-4 bg-yellow-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-white" />
                      <span className="text-white text-sm font-bold">
                        {person.popularity.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h3 className="text-white font-bold text-lg mb-4">Quick Info</h3>
                  <div className="space-y-3">
                    {person.birthday && (
                      <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-purple-400" />
                        <div>
                          <p className="text-white text-sm">
                            {formatDate(person.birthday)}
                          </p>
                          <p className="text-gray-300 text-xs">
                            Age: {calculateAge(person.birthday, person.deathday)}
                            {person.deathday ? ` (died ${formatDate(person.deathday)})` : ''}
                          </p>
                        </div>
                      </div>
                    )}

                    {person.place_of_birth && (
                      <div className="flex items-center gap-3">
                        <MapPin size={16} className="text-purple-400" />
                        <p className="text-white text-sm">{person.place_of_birth}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <span className="text-purple-400 text-sm">Gender:</span>
                      <p className="text-white text-sm">{getGenderText(person.gender)}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-purple-400 text-sm">Known for:</span>
                      <p className="text-white text-sm">{person.known_for_department}</p>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <SocialMediaLinks
                  externalIds={externalIds}
                  personName={person.name}
                  className="mt-6"
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {/* Name and Biography */}
                <div>
                  <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
                    {person.name}
                  </h1>

                  {person.also_known_as && person.also_known_as.length > 0 && (
                    <div className="mb-6">
                      <p className="text-gray-300 text-sm mb-2">Also known as:</p>
                      <div className="flex flex-wrap gap-2">
                        {person.also_known_as.slice(0, 3).map((name, index) => (
                          <span
                            key={index}
                            className="bg-white/10 px-3 py-1 rounded-full text-white text-sm"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {person.biography && (
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                      <h2 className="text-2xl font-bold text-white mb-4">Biography</h2>
                      <div className="text-gray-300 leading-relaxed">
                        {showFullBio || person.biography.length <= 500 ? (
                          <p>{person.biography}</p>
                        ) : (
                          <>
                            <p>{person.biography.substring(0, 500)}...</p>
                            <Button
                              variant="ghost"
                              onClick={() => setShowFullBio(true)}
                              className="text-purple-400 hover:text-purple-300 p-0 h-auto mt-2"
                            >
                              Read more
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Filmography Tabs */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
                  <Tabs defaultValue="movies" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-white/10">
                      <TabsTrigger value="movies" className="data-[state=active]:bg-purple-600">
                        <Film size={16} className="mr-2" />
                        Movies ({movieCredits?.cast?.length || 0})
                      </TabsTrigger>
                      <TabsTrigger value="tv" className="data-[state=active]:bg-purple-600">
                        <Tv size={16} className="mr-2" />
                        TV Shows ({tvCredits?.cast?.length || 0})
                      </TabsTrigger>
                      <TabsTrigger value="photos" className="data-[state=active]:bg-purple-600">
                        <Camera size={16} className="mr-2" />
                        Photos ({images?.profiles?.length || 0})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="movies" className="p-6">
                      <FilmographyGrid credits={allMovieCredits} mediaType="movie" />
                    </TabsContent>

                    <TabsContent value="tv" className="p-6">
                      <FilmographyGrid credits={allTVCredits} mediaType="tv" />
                    </TabsContent>

                    <TabsContent value="photos" className="p-6">
                      <PhotosGrid images={images?.profiles || []} />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Filmography Grid Component
function FilmographyGrid({
  credits,
  mediaType
}: {
  credits: (PersonMovieCredit | PersonTVCredit)[],
  mediaType: 'movie' | 'tv'
}) {
  const [showAll, setShowAll] = useState(false);
  const displayedCredits = showAll ? credits : credits.slice(0, 12);

  if (!credits || credits.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No {mediaType === 'movie' ? 'movies' : 'TV shows'} found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {displayedCredits.map((credit) => (
          <div key={credit.credit_id} className="group">
            <Link href={`/${mediaType === 'movie' ? 'movie' : 'series'}/${credit.id}`}>
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                <Image
                  src={
                    credit.poster_path
                      ? `https://image.tmdb.org/t/p/w300${credit.poster_path}`
                      : '/placeholder-avatar.svg'
                  }
                  alt={mediaType === 'movie' ? (credit as PersonMovieCredit).title : (credit as PersonTVCredit).name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
              </div>
              <div className="mt-2">
                <h3 className="text-white text-sm font-medium line-clamp-2">
                  {mediaType === 'movie' ? (credit as PersonMovieCredit).title : (credit as PersonTVCredit).name}
                </h3>
                <p className="text-gray-400 text-xs">
                  {credit.character || credit.job}
                </p>
                <p className="text-gray-500 text-xs">
                  {mediaType === 'movie'
                    ? (credit as PersonMovieCredit).release_date?.substring(0, 4)
                    : (credit as PersonTVCredit).first_air_date?.substring(0, 4)
                  }
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {credits.length > 12 && (
        <div className="text-center mt-6">
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            {showAll ? 'Show Less' : `Show All (${credits.length})`}
          </Button>
        </div>
      )}
    </div>
  );
}

import { PersonImage } from "@/types/index";

// Photos Grid Component
function PhotosGrid({ images }: { images: PersonImage[] }) {
  const [showAll, setShowAll] = useState(false);
  const displayedImages = showAll ? images : images.slice(0, 12);

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No photos available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {displayedImages.map((image, index) => (
          <div key={index} className="group">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
              <Image
                src={`https://image.tmdb.org/t/p/w300${image.file_path}`}
                alt={`Photo ${index + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          </div>
        ))}
      </div>

      {images.length > 12 && (
        <div className="text-center mt-6">
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            {showAll ? 'Show Less' : `Show All (${images.length})`}
          </Button>
        </div>
      )}
    </div>
  );
}
