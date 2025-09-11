"use client";
import React from "react";
import { ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";

function ReusableTable({
  data = [],
  columns = [],
  loading = false,
  pagination = null,
  onPageChange = () => {},
  onSearch = () => {},
  onFilter = () => {},
  searchPlaceholder = "Search...",
  filters = [],
  actions = [],
  className = "",
}) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeFilters, setActiveFilters] = React.useState({});

  const handleSearch = React.useCallback(
    (value) => {
      setSearchTerm(value);
      onSearch(value);
    },
    [onSearch]
  );

  const handleFilterChange = React.useCallback(
    (filterKey, value) => {
      const newFilters = { ...activeFilters, [filterKey]: value };
      if (!value) delete newFilters[filterKey];
      setActiveFilters(newFilters);
      onFilter(newFilters);
    },
    [activeFilters, onFilter]
  );

  const renderCell = (item, column) => {
    if (column?.render) {
      const value = column.render(item);
      return value;
    }
    const value = column.key.split(".").reduce((obj, key) => obj?.[key], item);
    return value || "-";
  };

  if (loading) {
    const skeletonRows = 8; // Number of skeleton rows
    const totalColumns = columns.length + (actions.length > 0 ? 1 : 0);

    return (
      <div className={`w-full bg-white rounded-lg shadow-sm ${className}`}>
        {/* Header Skeleton */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="animate-pulse">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
              {/* Search Skeleton */}
              <div className="relative flex-1 max-w-md">
                <div className="h-12 bg-gray-200 rounded-lg"></div>
              </div>
              {/* Filter Skeleton */}
              {filters.length > 0 && (
                <div className="flex gap-3">
                  {filters.map((_, index) => (
                    <div
                      key={index}
                      className="w-44 h-12 bg-gray-200 rounded-lg"
                    ></div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((_, index) => (
                  <th
                    key={`skeleton-header-${index}`}
                    className="px-4 py-4 text-left"
                  >
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-300 rounded w-20"></div>
                    </div>
                  </th>
                ))}
                {actions.length > 0 && (
                  <th className="px-4 py-4 text-left w-32">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-300 rounded w-16"></div>
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(skeletonRows)].map((_, rowIndex) => (
                <tr key={`skeleton-row-${rowIndex}`} className="animate-pulse">
                  {columns.map((_, colIndex) => (
                    <td
                      key={`skeleton-cell-${rowIndex}-${colIndex}`}
                      className="px-4 py-3 text-sm"
                    >
                      <div className="h-5 bg-gray-200 rounded w-full max-w-32"></div>
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        {actions.map((_, actionIndex) => (
                          <div
                            key={`skeleton-action-${rowIndex}-${actionIndex}`}
                            className="h-7 w-12 bg-gray-200 rounded"
                          ></div>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Skeleton */}
        <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
          <div className="animate-pulse flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="h-5 bg-gray-200 rounded w-48"></div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full bg-white rounded-lg shadow-sm ${className}`}>
      {/* Header with Search and Filters */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              name="search-field-disable-autofill"
              data-form-type="other"
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D] transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters */}
          {filters.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <div key={filter.key} className="min-w-[180px]">
                  <select
                    value={activeFilters[filter.key] || ""}
                    onChange={(e) =>
                      handleFilterChange(filter.key, e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D] bg-white text-sm transition-all appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 12px center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "16px",
                    }}
                  >
                    <option value="">All {filter.label}</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              {/* Active Filters Display */}
              {Object.keys(activeFilters).length > 0 && (
                <button
                  onClick={() => {
                    setActiveFilters({});
                    onFilter({});
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>Clear filters</span>
                  <span className="bg-[#446E6D]/10 text-[#446E6D] px-2 py-1 rounded-full text-xs">
                    {Object.keys(activeFilters).length}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Active Filter Tags */}
        {Object.entries(activeFilters).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([key, value]) => {
              const filter = filters.find((f) => f.key === key);
              const option = filter?.options.find((o) => o.value === value);
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#446E6D]/10 text-[#446E6D] text-sm rounded-full"
                >
                  <span className="font-medium">{filter?.label}:</span>
                  <span>{option?.label || value}</span>
                  <button
                    onClick={() => handleFilterChange(key, "")}
                    className="ml-1 hover:text-[#446E6D]/80"
                  >
                    ✕
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={`column-${index}`}
                  className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  No data found
                </td>
              </tr>
            ) : (
              data?.map((item, index) => (
                <tr
                  key={item._id || `row-${index}`}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-4 text-sm text-gray-900"
                    >
                      {renderCell(item, column)}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <div className="flex gap-2">
                        {actions.map((action, actionIndex) => (
                          <button
                            key={`${item._id}-${action.label}-${actionIndex}`}
                            onClick={() => action.onClick(item)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                              action.className ||
                              "bg-[#446E6D]/10 text-[#446E6D] hover:bg-[#446E6D]/20"
                            }`}
                            disabled={action.disabled && action.disabled(item)}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.total !== undefined && (
        <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-700">
              {(pagination?.total || 0) > 0 ? (
                <>
                  Showing{" "}
                  {((pagination?.currentPage || 1) - 1) *
                    (pagination?.limit || 10) +
                    1}{" "}
                  to{" "}
                  {Math.min(
                    (pagination?.currentPage || 1) * (pagination?.limit || 10),
                    pagination?.total || 0
                  )}{" "}
                  of {pagination?.total || 0} results
                </>
              ) : (
                "No results found"
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange((pagination?.currentPage || 1) - 1)}
                disabled={(pagination?.currentPage || 1) <= 1}
                className="p-2 border border-gray-300 rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 text-sm text-gray-700 bg-white rounded-md border">
                Page {pagination?.currentPage || 1} of{" "}
                {pagination?.totalPages || 1}
              </span>
              <button
                onClick={() => onPageChange((pagination?.currentPage || 1) + 1)}
                disabled={
                  (pagination?.currentPage || 1) >=
                  (pagination?.totalPages || 1)
                }
                className="p-2 border border-gray-300 rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Export with React.memo
export default React.memo(ReusableTable);
