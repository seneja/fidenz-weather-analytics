import React, { useState, useMemo } from 'react';
import { useWeatherData, WeatherCityResult } from '../hooks/useWeatherData';
import { Search, RefreshCw, Thermometer, Info } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { data, loading, error, refetch } = useWeatherData();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rank' | 'temp' | 'score' | 'name'>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const processedData = useMemo(() => {
    let result = [...data];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(c => c.cityName.toLowerCase().includes(term));
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'rank') {
        comparison = a.rank - b.rank;
      } else if (sortBy === 'temp') {
        comparison = a.tempCelsius - b.tempCelsius;
      } else if (sortBy === 'score') {
        comparison = a.comfortScore - b.comfortScore;
      } else if (sortBy === 'name') {
        comparison = a.cityName.localeCompare(b.cityName);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [data, searchTerm, sortBy, sortOrder]);

  const handleSort = (field: 'rank' | 'temp' | 'score' | 'name') => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder(field === 'rank' || field === 'name' ? 'asc' : 'desc');
    }
  };

  const getComfortColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-emerald-50 dark:bg-emerald-950/20', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-900/40' };
    if (score >= 50) return { bg: 'bg-amber-50 dark:bg-amber-950/20', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-900/40' };
    return { bg: 'bg-rose-50 dark:bg-rose-950/20', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-900/40' };
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            Global Comfort Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Compare and sort weather comfort indices across international cities.
          </p>
        </div>
        <button
          onClick={refetch}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      <div className="mb-6 flex gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-blue-800 dark:border-blue-955/20 dark:bg-blue-950/10 dark:text-blue-300">
        <Info className="h-5 w-5 shrink-0 text-blue-500" />
        <div className="text-sm">
          <p className="font-semibold">Comfort Index Score Calculation</p>
          <p className="mt-1 text-gray-600 dark:text-gray-350">
            Calculated server-side based on temperature (40%), relative humidity (30%), wind speed (15%), and cloudiness (15%). Ideal values are 22°C, 45% humidity, 2 m/s wind, and 20% clouds. Score ranges from 0 (very uncomfortable) to 100 (most comfortable).
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="block w-full rounded-xl border border-gray-300 bg-white p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Search city by name..."
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSort('rank')}
            className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors ${
              sortBy === 'rank'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-350 dark:hover:bg-gray-700'
            }`}
          >
            Sort by Rank {sortBy === 'rank' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('score')}
            className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors ${
              sortBy === 'score'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-350 dark:hover:bg-gray-700'
            }`}
          >
            Sort by Score {sortBy === 'score' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('temp')}
            className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors ${
              sortBy === 'temp'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-350 dark:hover:bg-gray-700'
            }`}
          >
            Sort by Temp {sortBy === 'temp' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('name')}
            className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors ${
              sortBy === 'name'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-350 dark:hover:bg-gray-700'
            }`}
          >
            Sort by Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
            <p className="text-gray-500 dark:text-gray-400">Loading cities weather profiles...</p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-800 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
          <p className="font-bold">Error Loading Weather Data</p>
          <p className="mt-2 text-sm">{error}</p>
          <button
            onClick={refetch}
            className="mt-4 rounded-xl bg-red-650 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {processedData.length === 0 ? (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              No cities match search query "{searchTerm}"
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {processedData.map((city: WeatherCityResult) => {
                const color = getComfortColor(city.comfortScore);
                const isError = city.description.startsWith('Error:');

                return (
                  <div
                    key={city.cityId}
                    className={`relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300 dark:bg-gray-800 dark:hover:border-gray-600 ${
                      isError
                        ? 'border-red-100 bg-red-50/10 dark:border-red-950/30'
                        : 'border-gray-150 dark:border-gray-700'
                    }`}
                  >
                    {!isError && (
                      <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                        #{city.rank}
                      </span>
                    )}

                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{city.cityName}</h2>
                    <p className="mt-1 text-sm text-gray-500 capitalize dark:text-gray-400">
                      {city.description}
                    </p>

                    {isError ? (
                      <div className="mt-6 text-sm text-red-650 dark:text-red-400">
                        Please check server settings or OpenWeatherMap API limit.
                      </div>
                    ) : (
                      <>
                        <div className="mt-6 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Thermometer className="h-6 w-6 text-gray-400" />
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                              {city.tempCelsius}°C
                            </span>
                          </div>

                          <div
                            className={`rounded-xl border px-3 py-1 text-center ${color.bg} ${color.text} ${color.border}`}
                          >
                            <span className="block text-[9px] uppercase font-bold leading-none tracking-wider opacity-80">
                              Comfort
                            </span>
                            <span className="text-lg font-black leading-tight">{city.comfortScore}</span>
                          </div>
                        </div>

                        <div className="mt-4 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                          <div
                            style={{ width: `${city.comfortScore}%` }}
                            className={`h-full rounded-full transition-all duration-500 ${
                              city.comfortScore >= 80
                                ? 'bg-emerald-500'
                                : city.comfortScore >= 50
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                            }`}
                          />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
