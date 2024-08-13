// src/components/Header.jsx
import React from "react";
import { Input } from "../ui/Input";
import { SearchIcon } from "../ui/icons.jsx";
import { Link } from "react-router-dom";

function Header({ searchTerm, setSearchTerm }) {
  return (
    <header className="bg-background py-4 shadow-md fixed top-0 left-0 w-full z-10">
      <div className="container flex items-center justify-between mx-auto px-4">
        <Link to="/" className="text-2xl font-bold no-underline text-inherit">
          Sprinterly
        </Link>
        {searchTerm !== undefined && setSearchTerm && (
          <div className="relative w-full max-w-md">
            <Input
              type="search"
              placeholder="Search teams..."
              className="pr-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
