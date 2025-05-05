import React from 'react';
import FilterButton from '../atoms/FilterButton';

const FilterBar = ({ activeFilter, onFilterChange, availableFilters }) => {
  const filters = [
    { id: 'all', label: 'Todos' },
    ...availableFilters.map(type => ({
      id: type.toLowerCase(),
      label: type.charAt(0).toUpperCase() + type.slice(1)
    }))
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {filters.map((filter) => (
        <FilterButton
          key={filter.id}
          active={activeFilter === filter.id}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </FilterButton>
      ))}
    </div>
  );
};

export default FilterBar; 