import React, { useState, useMemo } from 'react';
import { useWeatherData, WeatherCityResult } from '../hooks/useWeatherData';
import { Search, RefreshCw, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

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

  const getComfortStatus = (score: number) => {
    if (score >= 80) return { label: 'Excellent', colorClass: 'text-success' };
    if (score >= 50) return { label: 'Moderate', colorClass: 'text-warning' };
    return { label: 'Poor', colorClass: 'text-error' };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Global Comfort Index</h1>
          <p className="text-secondary-foreground mt-1">Analyze and compare weather patterns across major cities.</p>
        </div>
        <Button onClick={refetch} disabled={loading} variant="outline" className="shrink-0 gap-2">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Syncing...' : 'Sync Data'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-surface"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {(['rank', 'score', 'temp', 'name'] as const).map((field) => (
              <Button
                key={field}
                variant={sortBy === field ? 'secondary' : 'ghost'}
                onClick={() => handleSort(field)}
                className="capitalize text-sm h-10 px-4 whitespace-nowrap"
              >
                {field} {sortBy === field && (sortOrder === 'asc' ? '↑' : '↓')}
              </Button>
            ))}
          </div>
        </div>

        <Card className="bg-info/5 border-info/20 hidden md:block">
          <CardContent className="p-4 flex gap-3 items-start">
            <Info className="w-5 h-5 text-info shrink-0 mt-0.5" />
            <div className="text-sm text-secondary-foreground">
              <span className="font-semibold text-primary block mb-1">Comfort Algorithm</span>
              Evaluates temp (40%), humidity (30%), wind (15%), & clouds (15%).
            </div>
          </CardContent>
        </Card>
      </div>

      {loading && processedData.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-muted-foreground gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-accent" />
          <p>Compiling global weather metrics...</p>
        </div>
      ) : error ? (
        <Card className="border-error/50 bg-error/5">
          <CardContent className="p-8 text-center flex flex-col items-center">
            <p className="text-error font-semibold mb-2">Data Synchronization Failed</p>
            <p className="text-sm text-secondary-foreground mb-6 max-w-md">{error}</p>
            <Button variant="outline" onClick={() => refetch()}>Retry Connection</Button>
          </CardContent>
        </Card>
      ) : processedData.length === 0 ? (
        <div className="py-24 text-center text-muted-foreground bg-surface border border-dashed border-border rounded-xl">
          No locations matched "{searchTerm}"
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {processedData.map((city: WeatherCityResult) => {
            const status = getComfortStatus(city.comfortScore);
            const isError = city.description.startsWith('Error:');

            return (
              <Card key={city.cityId} className="group hover:border-accent/50 transition-colors duration-300">
                <CardHeader className="pb-4 relative">
                  {!isError && (
                    <div className="absolute top-6 right-6 text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors">
                      #{city.rank}
                    </div>
                  )}
                  <CardTitle className="text-xl pr-8 truncate">{city.cityName}</CardTitle>
                  <CardDescription className="capitalize truncate h-5">
                    {isError ? 'Service Unavailable' : city.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {isError ? (
                    <div className="text-sm text-error/80 py-4">Data fetch failed for this region.</div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-end justify-between">
                        <div className="flex items-start gap-1 text-primary">
                          <span className="text-4xl font-light tracking-tighter">{city.tempCelsius}</span>
                          <span className="text-lg font-medium mt-1">°C</span>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${status.colorClass}`}>
                            {city.comfortScore}
                          </div>
                          <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
                            Score
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-secondary-foreground">
                          <span>Comfort Level</span>
                          <span className={status.colorClass}>{status.label}</span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ease-out ${
                              city.comfortScore >= 80 ? 'bg-success' : city.comfortScore >= 50 ? 'bg-warning' : 'bg-error'
                            }`}
                            style={{ width: `${city.comfortScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
