import React from "react";
import Input from "@mui/joy/Input";
import IconButton from "@mui/joy/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const SearchInput = ({ searchQuery, setSearchQuery, handleClearSearch }) => (
  <Input
    size="sm"
    placeholder="Search"
    startDecorator={<SearchIcon />}
    sx={{ flexGrow: 1 }}
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    endDecorator={
      searchQuery && (
        <IconButton onClick={handleClearSearch}>
          <ClearIcon />
        </IconButton>
      )
    }
  />
);

export default SearchInput;
