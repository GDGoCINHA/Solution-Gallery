import React from "react";

interface SearchBarProps {
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

export default function SearchBar({ placeholder = "프로젝트명, 팀명으로 검색...", onChange, value }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md container mx-auto flex items-end bg-zinc-700 rounded-lg shadow-md focus-within:shadow-lg focus-within:bg-zinc-800">
      <input
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        className="pl-10 pr-4 py-2 w-full rounded-lg bg-zinc-800 text-white placeholder-zinc-400 focus:ring-2 focus:ring-primary outline-none"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
    </div>
  );
} 