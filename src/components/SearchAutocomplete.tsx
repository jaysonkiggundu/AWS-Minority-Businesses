import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { mockBusinesses } from "@/data/mockBusinesses";
import { logger } from "@/lib/logger";
import { toast } from "sonner";

// Build suggestion pool from mock data
const SUGGESTIONS = [
  ...new Set([
    ...mockBusinesses.map((b) => b.name),
    ...mockBusinesses.map((b) => b.category),
    ...mockBusinesses.map((b) => b.location.city),
    ...mockBusinesses.flatMap((b) => b.diversity),
    ...mockBusinesses.flatMap((b) => b.tags ?? []),
  ]),
].sort();

export function SearchAutocomplete() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter suggestions on query change
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    const q = query.toLowerCase();
    const matches = SUGGESTIONS.filter((s) => s.toLowerCase().includes(q)).slice(0, 6);
    setSuggestions(matches);
    setOpen(matches.length > 0);
    setActiveIndex(-1);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const submit = (value: string) => {
    const q = value.trim();
    if (!q) { toast.error("Please enter a search term"); return; }
    logger.logUserAction("Homepage Search", { query: q });
    toast.success(`Searching for "${q}"...`);
    setOpen(false);
    navigate(`/browse?search=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (e.key === "Enter") submit(query);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        setQuery(suggestions[activeIndex]);
        submit(suggestions[activeIndex]);
      } else {
        submit(query);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative max-w-2xl mx-auto">
      <form onSubmit={(e) => { e.preventDefault(); submit(query); }}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder="Search by business name, category, or location..."
            className="pl-12 h-14 text-lg border-2 focus:border-primary"
            autoComplete="off"
          />
          {query && (
            <Button type="submit" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2">
              Search
            </Button>
          )}
        </div>
      </form>

      {/* Autocomplete dropdown */}
      {open && (
        <ul className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg overflow-hidden">
          {suggestions.map((s, i) => (
            <li
              key={s}
              className={`flex items-center gap-3 px-4 py-3 text-sm cursor-pointer transition-colors ${
                i === activeIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
              }`}
              onMouseDown={() => { setQuery(s); submit(s); }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      )}

      <p className="text-sm text-muted-foreground mt-2 text-center">
        Try searching for "technology", "San Francisco", or "Minority-owned"
      </p>
    </div>
  );
}
