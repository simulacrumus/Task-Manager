import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { DEBOUNCE_DELAY, DEFAULT_SEARCH_LABEL } from "./SearchBar.constants";

interface SearchBarProps {
  label?: string;
  onDebouncedChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  label,
  onDebouncedChange,
}) => {
  const [input, setInput] = useState<string>("");
  const [debouncedInput, setDebouncedInput] = useState<string>(input);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(input);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [input]);

  useEffect(() => {
    onDebouncedChange(debouncedInput);
  }, [debouncedInput, onDebouncedChange]);

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setInput(event.target.value);
  };

  return (
    <TextField
      label={label ?? DEFAULT_SEARCH_LABEL}
      size="small"
      margin="normal"
      name="query"
      value={input}
      variant="outlined"
      onChange={onSearchChange}
    />
  );
};

export default SearchBar;
