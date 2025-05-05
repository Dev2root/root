import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FeedbackItem } from "@/lib/feedback";
import { formatDate, getCategoryBadgeClass, generateStarRating } from "@/lib/utils";

interface FeedbackDetailsModalProps {
  feedback: FeedbackItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const FeedbackDetailsModal = ({
  feedback,
  isOpen,
  onClose,
  onDelete
}: FeedbackDetailsModalProps) => {
  if (!feedback) return null;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      onDelete(feedback.id);
      onClose();
    }
  };

  const categoryClass = getCategoryBadgeClass(feedback.category);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Feedback Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-neutral-dark">{feedback.name}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-neutral-dark">{feedback.email}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Category</p>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryClass} inline-block`}>
              {feedback.category.charAt(0).toUpperCase() + feedback.category.slice(1)}
            </span>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Rating</p>
            <div className="text-yellow-400 text-lg">
              {generateStarRating(feedback.rating)}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Comments</p>
            <p className="text-neutral-dark whitespace-pre-line">{feedback.comments}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Would Recommend</p>
            <p className="text-neutral-dark capitalize">{feedback.recommend || "Not specified"}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Submitted On</p>
            <p className="text-neutral-dark">{formatDate(feedback.date)}</p>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDetailsModal;
