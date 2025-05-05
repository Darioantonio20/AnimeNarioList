import React from 'react';
import AnimeHeader from '../organisms/AnimeHeader';
import SearchBar from '../molecules/SearchBar';
import FilterBar from '../molecules/FilterBar';
import AnimeGrid from '../organisms/AnimeGrid';

const AnimeLayout = ({
  animes,
  loading,
  onSearch,
  activeFilter,
  onFilterChange,
  error,
  availableFilters,
  onViewDetails
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <AnimeHeader />
        <div className="mx-auto max-w-3xl space-y-6">
          <SearchBar onSearch={onSearch} />
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={onFilterChange}
            availableFilters={availableFilters}
          />
        </div>
        {error && (
          <div className="mx-auto mt-6 max-w-3xl rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900 dark:text-red-100">
            {error}
          </div>
        )}
        <div className="mt-8">
          <AnimeGrid
            animes={animes}
            loading={loading}
            onViewDetails={onViewDetails}
          />
        </div>
      </div>
    </div>
  );
};

export default AnimeLayout; 