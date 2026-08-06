"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Phone, Search, ShieldAlert, User, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type UserSearchResult = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  phoneNumber?: string | null;
  whatsappNumber?: string | null;
  fullAddress?: string | null;
  role?: string;
  banned?: boolean | null;
};

interface UserSearchSelectProps {
  /** Async search function (Server Action or API call) */
  onSearch: (query: string) => Promise<UserSearchResult[]>;
  /** Callback fired when a user is selected */
  onSelect: (user: UserSearchResult) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function UserSearchSelect({
  onSearch,
  onSelect,
  placeholder = "Search user by name, email, or phone...",
  disabled = false,
}: UserSearchSelectProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle user input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (!val.trim()) {
      setResults([]);
      setIsLoading(false);
      setIsOpen(false);
    } else {
      setIsLoading(true);
      setIsOpen(true);
    }
  };

  // Clear input handler
  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsLoading(false);
    setIsOpen(false);
  };

  // Debounced search effect
  useEffect(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    const timer = setTimeout(async () => {
      try {
        const data = await onSearch(trimmedQuery);
        setResults(data);
      } catch (error) {
        console.error("Failed to search users:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleSelectUser = (user: UserSearchResult) => {
    onSelect(user);
    handleClear();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="h-10 pl-9 pr-8"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Floating Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md transition-all">
          {isLoading ? (
            <div className="space-y-2 p-2">
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No users found matching &quot;{query}&quot;
            </div>
          ) : (
            results.map((user) => (
              <div
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-sm p-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {/* Left: Avatar & Info */}
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="relative size-9 shrink-0 overflow-hidden rounded-full border bg-muted">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted-foreground">
                        <User className="size-4" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate font-medium text-foreground">
                        {user.name}
                      </span>
                      {user.banned && (
                        <Badge
                          variant="destructive"
                          className="px-1 py-0 text-[10px] gap-0.5"
                        >
                          <ShieldAlert className="size-2.5" />
                          Banned
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground truncate">
                      <span className="flex items-center gap-1 truncate">
                        <Mail className="size-3 shrink-0" />
                        {user.email}
                      </span>
                      {user.phoneNumber && (
                        <span className="flex items-center gap-1 shrink-0">
                          <Phone className="size-3 shrink-0" />
                          {user.phoneNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Role Badge */}
                {user.role && (
                  <div className="shrink-0">
                    <Badge
                      variant="outline"
                      className="px-1.5 py-0 text-[10px] uppercase font-mono"
                    >
                      {user.role}
                    </Badge>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
