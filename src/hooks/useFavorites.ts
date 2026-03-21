import { useState, useEffect } from "react";
import { logger } from "@/lib/logger";

const FAVORITES_KEY = "aws-camp-favorites";

function loadFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);

  // Persist on change
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (id: string) => favorites.includes(id);

  const toggleFavorite = (id: string, name?: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      logger.logUserAction(prev.includes(id) ? "Removed Favorite" : "Added Favorite", {
        businessId: id,
        businessName: name,
      });
      return next;
    });
  };

  return { favorites, isFavorite, toggleFavorite };
}
