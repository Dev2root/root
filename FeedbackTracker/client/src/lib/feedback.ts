export interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  category: string;
  rating: number;
  comments: string;
  recommend: string;
  date: string;
}

export type SortOption = 'date-desc' | 'date-asc' | 'rating-desc' | 'rating-asc';

const STORAGE_KEY = 'feedbackItems';

export const getFeedbackItems = (): FeedbackItem[] => {
  try {
    const items = localStorage.getItem(STORAGE_KEY);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Error retrieving feedback items from localStorage:', error);
    return [];
  }
};

export const saveFeedbackItem = (feedback: Omit<FeedbackItem, 'id' | 'date'>): FeedbackItem => {
  try {
    // Get existing feedback
    const feedbackItems = getFeedbackItems();
    
    // Create new feedback item with ID and date
    const newFeedback: FeedbackItem = {
      ...feedback,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    
    // Save updated list
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...feedbackItems, newFeedback]));
    
    return newFeedback;
  } catch (error) {
    console.error('Error saving feedback item to localStorage:', error);
    throw new Error('Failed to save feedback');
  }
};

export const deleteFeedbackItem = (id: string): boolean => {
  try {
    const feedbackItems = getFeedbackItems();
    const updatedItems = feedbackItems.filter(item => item.id !== id);
    
    if (feedbackItems.length === updatedItems.length) {
      return false; // Item not found
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    return true;
  } catch (error) {
    console.error('Error deleting feedback item from localStorage:', error);
    return false;
  }
};

export const filterFeedbackItems = (
  items: FeedbackItem[],
  filters: { category?: string; minRating?: number },
  sortOption: SortOption
): FeedbackItem[] => {
  // Filter items
  let filteredItems = [...items];
  
  if (filters.category && filters.category !== '') {
    filteredItems = filteredItems.filter(item => item.category === filters.category);
  }
  
  if (filters.minRating && filters.minRating > 0) {
    filteredItems = filteredItems.filter(item => item.rating >= filters.minRating);
  }
  
  // Sort items
  return sortFeedbackItems(filteredItems, sortOption);
};

export const sortFeedbackItems = (items: FeedbackItem[], sortOption: SortOption): FeedbackItem[] => {
  const sortedItems = [...items];
  
  switch (sortOption) {
    case 'date-desc':
      return sortedItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    case 'date-asc':
      return sortedItems.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    case 'rating-desc':
      return sortedItems.sort((a, b) => b.rating - a.rating);
    case 'rating-asc':
      return sortedItems.sort((a, b) => a.rating - b.rating);
    default:
      return sortedItems;
  }
};
