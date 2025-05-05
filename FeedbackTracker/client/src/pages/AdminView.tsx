import { useState, useEffect, useCallback } from "react";
import { Inbox } from "lucide-react";
import FeedbackFilters from "@/components/FeedbackFilters";
import FeedbackTable from "@/components/FeedbackTable";
import FeedbackDetailsModal from "@/components/FeedbackDetailsModal";
import { FeedbackItem, getFeedbackItems, deleteFeedbackItem, filterFeedbackItems, SortOption } from "@/lib/feedback";
import { useToast } from "@/hooks/use-toast";
import { useMobile } from "@/hooks/use-mobile";

const AdminView = () => {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FeedbackItem[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | undefined>(undefined);
  const [filterMinRating, setFilterMinRating] = useState<number | undefined>(undefined);
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  
  const { toast } = useToast();
  const isMobile = useMobile();
  
  // Load feedback items from localStorage
  const loadFeedbackItems = useCallback(() => {
    const items = getFeedbackItems();
    setFeedbackItems(items);
    // Apply current filters and sorting
    setFilteredItems(filterFeedbackItems(items, {
      category: filterCategory,
      minRating: filterMinRating
    }, sortOption));
  }, [filterCategory, filterMinRating, sortOption]);
  
  useEffect(() => {
    loadFeedbackItems();
  }, [loadFeedbackItems]);
  
  // Handle filter changes
  const handleFilterChange = (category: string | undefined, minRating: number | undefined) => {
    setFilterCategory(category);
    setFilterMinRating(minRating);
    
    setFilteredItems(filterFeedbackItems(feedbackItems, {
      category,
      minRating
    }, sortOption));
  };
  
  // Handle sort changes
  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    
    setFilteredItems(filterFeedbackItems(feedbackItems, {
      category: filterCategory,
      minRating: filterMinRating
    }, option));
  };
  
  // View feedback details
  const handleViewFeedback = (item: FeedbackItem) => {
    setSelectedFeedback(item);
    setIsModalOpen(true);
  };
  
  // Delete feedback
  const handleDeleteFeedback = (id: string) => {
    const deleted = deleteFeedbackItem(id);
    
    if (deleted) {
      toast({
        title: "Success",
        description: "Feedback has been deleted.",
        variant: "default",
      });
      
      // Refresh the feedback list
      loadFeedbackItems();
    } else {
      toast({
        title: "Error",
        description: "Failed to delete feedback.",
        variant: "destructive",
      });
    }
  };
  
  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFeedback(null);
  };
  
  // Calculate pagination info
  const totalItems = filteredItems.length;
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-neutral-dark">Feedback Management</h2>
      
      <FeedbackFilters
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />
      
      {/* No Feedback Message */}
      {filteredItems.length === 0 && (
        <div className="text-center py-8">
          <Inbox className="h-12 w-12 text-gray-400 mb-3 mx-auto" />
          <p className="text-lg text-gray-500">
            {feedbackItems.length === 0
              ? "No feedback submissions yet."
              : "No feedback matches your filters."}
          </p>
        </div>
      )}
      
      {/* Feedback Table */}
      {filteredItems.length > 0 && (
        <>
          <FeedbackTable
            feedbackItems={filteredItems}
            onView={handleViewFeedback}
            onDelete={handleDeleteFeedback}
          />
          
          {/* Pagination Info */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{totalItems}</span> {totalItems === 1 ? 'result' : 'results'}
            </p>
          </div>
        </>
      )}
      
      {/* Feedback Details Modal */}
      <FeedbackDetailsModal
        feedback={selectedFeedback}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDelete={handleDeleteFeedback}
      />
    </div>
  );
};

export default AdminView;
