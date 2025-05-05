import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortOption } from "@/lib/feedback";

interface FeedbackFiltersProps {
  onFilterChange: (category: string | undefined, minRating: number | undefined) => void;
  onSortChange: (sortOption: SortOption) => void;
}

const FeedbackFilters = ({
  onFilterChange,
  onSortChange
}: FeedbackFiltersProps) => {
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  // Apply filters when they change
  useEffect(() => {
    onFilterChange(category, minRating);
  }, [category, minRating, onFilterChange]);

  const handleCategoryChange = (value: string) => {
    setCategory(value === "all" ? undefined : value);
  };

  const handleRatingChange = (value: string) => {
    setMinRating(value === "any" ? undefined : parseInt(value, 10));
  };

  const handleSortChange = (value: string) => {
    const sortOption = value as SortOption;
    setSortBy(sortOption);
    onSortChange(sortOption);
  };

  return (
    <div className="mb-6 p-4 bg-neutral-light rounded-md">
      <h3 className="text-lg font-medium mb-3 text-neutral-dark">Filter Feedback</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category Filter */}
        <div className="space-y-2">
          <Label htmlFor="filter-category">Category</Label>
          <Select
            value={category || "all"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger id="filter-category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="service">Customer Service</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        {/* Rating Filter */}
        <div className="space-y-2">
          <Label htmlFor="filter-rating">Minimum Rating</Label>
          <Select
            value={minRating?.toString() || "any"}
            onValueChange={handleRatingChange}
          >
            <SelectTrigger id="filter-rating">
              <SelectValue placeholder="Any Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="any">Any Rating</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
                <SelectItem value="2">2+ Stars</SelectItem>
                <SelectItem value="1">1+ Star</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        {/* Sort By */}
        <div className="space-y-2">
          <Label htmlFor="sort-by">Sort By</Label>
          <Select
            value={sortBy}
            onValueChange={handleSortChange}
          >
            <SelectTrigger id="sort-by">
              <SelectValue placeholder="Newest First" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="rating-desc">Highest Rating</SelectItem>
                <SelectItem value="rating-asc">Lowest Rating</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FeedbackFilters;
