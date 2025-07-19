"use client"
import { useEffect, useMemo, useState } from "react"
import mediaData from "@/assets/moviesdb.json"
import { Movie, TVShow } from "@/types/index"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, TrendingUp, Star, Calendar, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const DashboardPage = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [tvShows, setTvShows] = useState<TVShow[]>([])
  const [tab, setTab] = useState<"movies" | "tv">("movies")


  useEffect(() => {
    setMovies((mediaData as { movies: Movie[] }).movies)
    setTvShows((mediaData as { tv_shows: TVShow[] }).tv_shows)
  }, [])

  const data = tab === "movies" ? movies : tvShows



  // Statistics calculations
  const stats = useMemo(() => {
    // Most popular movies/shows
    const mostPopular = [...data]
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 5)

    // Highest rated
    const highestRated = [...data]
      .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
      .slice(0, 5)

    // Most voted
    const mostVoted = [...data]
      .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
      .slice(0, 5)

    // Recent releases (last 2 years)
    const currentYear = new Date().getFullYear()
    const recentReleases = data.filter(item => {
      const releaseDate = "release_date" in item ? item.release_date : item.first_air_date
      if (!releaseDate) return false
      const releaseYear = new Date(releaseDate).getFullYear()
      return currentYear - releaseYear <= 2
    }).length

    // Average rating
    const avgRating = data.length > 0
      ? (data.reduce((sum, item) => sum + (item.vote_average || 0), 0) / data.length).toFixed(1)
      : "0.0"

    // Genre distribution
    const genreCount: { [key: string]: number } = {}
    data.forEach(item => {
      item.genre_names?.forEach(genre => {
        genreCount[genre] = (genreCount[genre] || 0) + 1
      })
    })

    const topGenres = Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)

    return {
      total: data.length,
      mostPopular,
      highestRated,
      mostVoted,
      recentReleases,
      avgRating,
      topGenres
    }
  }, [data])

  return (
    <div className="p-5 sm:px-20 pb-20">
      <div className="flex justify-between items-center mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and analyze your movie collection
          </p>
        </div>
        <Button className="flex gap-2">
          <Plus size={16} />
          Add {tab === "movies" ? "Movie" : "TV Show"}
        </Button>
      </div>

      {/* Quick Overview Cards */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Total Movies</p>
              <p className="text-2xl font-bold">{movies.length}</p>
            </div>
            <div className="text-indigo-200">🎬</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm">Total TV Shows</p>
              <p className="text-2xl font-bold">{tvShows.length}</p>
            </div>
            <div className="text-pink-200">📺</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Total Collection</p>
              <p className="text-2xl font-bold">{movies.length + tvShows.length}</p>
            </div>
            <div className="text-emerald-200">📚</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Avg Rating</p>
              <p className="text-2xl font-bold">
                {((movies.reduce((sum, m) => sum + (m.vote_average || 0), 0) +
                  tvShows.reduce((sum, t) => sum + (t.vote_average || 0), 0)) /
                  (movies.length + tvShows.length)).toFixed(1)}
              </p>
            </div>
            <div className="text-amber-200">⭐</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="movies" onValueChange={(val) => {
        setTab(val as "movies" | "tv")
      }}>
        <TabsList className="mb-4">
          <TabsTrigger value="movies">Movies</TabsTrigger>
          <TabsTrigger value="tv">TV Shows</TabsTrigger>
        </TabsList>

        {/* Statistics Section */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Count */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total {tab === "movies" ? "Movies" : "TV Shows"}</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <TrendingUp size={24} className="text-blue-200" />
            </div>
          </div>

          {/* Average Rating */}
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Average Rating</p>
                <p className="text-2xl font-bold">{stats.avgRating}</p>
              </div>
              <Star size={24} className="text-yellow-200" />
            </div>
          </div>

          {/* Recent Releases */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Recent (2 years)</p>
                <p className="text-2xl font-bold">{stats.recentReleases}</p>
              </div>
              <Calendar size={24} className="text-green-200" />
            </div>
          </div>

          {/* Most Voted */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Most Voted</p>
                <p className="text-2xl font-bold">{stats.mostVoted[0]?.vote_count || 0}</p>
              </div>
              <Eye size={24} className="text-purple-200" />
            </div>
          </div>
        </div>

        {/* Top Lists */}
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Most Popular */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" />
              Most Popular
            </h3>
            <div className="space-y-2">
              {stats.mostPopular.slice(0, 3).map((item, index) => (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {"title" in item ? item.title : item.name}
                    </p>
                    <p className="text-xs text-gray-500">{item.popularity?.toFixed(0)} popularity</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Highest Rated */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Star size={20} className="text-yellow-500" />
              Highest Rated
            </h3>
            <div className="space-y-2">
              {stats.highestRated.slice(0, 3).map((item, index) => (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500 text-white text-xs flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {"title" in item ? item.title : item.name}
                    </p>
                    <p className="text-xs text-gray-500">⭐ {item.vote_average?.toFixed(1)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Genres */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Calendar size={20} className="text-green-500" />
              Top Genres
            </h3>
            <div className="space-y-2">
              {stats.topGenres.slice(0, 3).map(([genre, count], index) => (
                <div key={genre} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{genre}</p>
                    <p className="text-xs text-gray-500">{count} items</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Analytics */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4">📊 Advanced Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Rating Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
              <h4 className="text-lg font-semibold mb-3">Rating Distribution</h4>
              <div className="space-y-2">
                {(() => {
                  const ratingRanges = [
                    { range: "9.0 - 10.0", min: 9.0, max: 10.0, color: "bg-green-500" },
                    { range: "8.0 - 8.9", min: 8.0, max: 8.9, color: "bg-blue-500" },
                    { range: "7.0 - 7.9", min: 7.0, max: 7.9, color: "bg-yellow-500" },
                    { range: "6.0 - 6.9", min: 6.0, max: 6.9, color: "bg-orange-500" },
                    { range: "< 6.0", min: 0, max: 5.9, color: "bg-red-500" }
                  ]

                  return ratingRanges.map(({ range, min, max, color }) => {
                    const count = data.filter(item => {
                      const rating = item.vote_average || 0
                      return rating >= min && rating <= max
                    }).length

                    const percentage = data.length > 0 ? (count / data.length * 100).toFixed(1) : "0"

                    return (
                      <div key={range} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{range}</span>
                            <span>{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`${color} h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                })()}
              </div>
            </div>

            {/* Release Years */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
              <h4 className="text-lg font-semibold mb-3">Release Years</h4>
              <div className="space-y-2">
                {(() => {
                  const currentYear = new Date().getFullYear()
                  const yearRanges = [
                    { range: `${currentYear - 1} - ${currentYear}`, years: [currentYear - 1, currentYear] },
                    { range: `${currentYear - 3} - ${currentYear - 2}`, years: [currentYear - 3, currentYear - 2] },
                    { range: `${currentYear - 5} - ${currentYear - 4}`, years: [currentYear - 5, currentYear - 4] },
                    { range: `${currentYear - 10} - ${currentYear - 6}`, years: Array.from({ length: 5 }, (_, i) => currentYear - 10 + i) },
                    { range: `Before ${currentYear - 10}`, years: [] }
                  ]

                  return yearRanges.map(({ range, years }) => {
                    const count = data.filter(item => {
                      const releaseDate = "release_date" in item ? item.release_date : item.first_air_date
                      if (!releaseDate) return false
                      const releaseYear = new Date(releaseDate).getFullYear()

                      if (years.length === 0) {
                        return releaseYear < currentYear - 10
                      }
                      return years.includes(releaseYear)
                    }).length

                    const percentage = data.length > 0 ? (count / data.length * 100).toFixed(1) : "0"

                    return (
                      <div key={range} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{range}</span>
                            <span>{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Simulation */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4">🔥 Recently Popular</h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...data]
                .filter(item => (item.vote_average || 0) >= 7.5)
                .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
                .slice(0, 6)
                .map((item, index) => (
                  <Link
                    key={item.id}
                    href={`/${tab === "movies" ? "movie" : "series"}/${item.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <div className="relative">
                      <Image
                        src={item.poster_url}
                        alt={"title" in item ? item.title : item.name}
                        width={60}
                        height={90}
                        className="rounded object-cover"
                      />
                      <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {"title" in item ? item.title : item.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-yellow-600">⭐ {(item.vote_average || 0).toFixed(1)}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{(item.popularity || 0).toFixed(0)} popularity</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.genre_names?.slice(0, 2).join(", ")}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  )
}

export default DashboardPage
