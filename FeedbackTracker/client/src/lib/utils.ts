import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  if (!date) return "";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toISOString().split("T")[0];
}

export function getCategoryBadgeClass(category: string): string {
  switch (category.toLowerCase()) {
    case "product":
      return "bg-category-product";
    case "service":
      return "bg-category-service";
    case "website":
      return "bg-category-website";
    case "other":
    default:
      return "bg-category-other";
  }
}

// Simple text-based star rating
export function generateStarRating(rating: number): string {
  const fullStar = "★";
  const emptyStar = "☆";
  
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  
  return fullStar.repeat(fullStars) + emptyStar.repeat(emptyStars);
}