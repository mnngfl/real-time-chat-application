import { Box, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import debounce from "lodash/debounce";
import { useFetchChats } from "@/hooks";

const SearchChat = () => {
  const [inputVal, setInputVal] = useState("");
  const [debouncedInput, setDebouncedInput] = useState<string | null>(null);
  const { fetchChats } = useFetchChats();

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputVal(value);
  }, []);

  const handleInput = debounce(() => {
    setDebouncedInput(inputVal);
  }, 400);

  const handleSearch = useCallback(async () => {
    if (debouncedInput === null) return;
    await fetchChats(debouncedInput);
  }, [debouncedInput, fetchChats]);

  useEffect(() => {
    handleInput();

    return () => {
      handleInput.cancel();
    };
  }, [handleInput, inputVal]);

  useEffect(() => {
    handleSearch();
  }, [debouncedInput, handleSearch]);

  return (
    <Box p={4}>
      <InputGroup>
        <InputLeftElement>
          <SearchIcon color={"gray.500"} />
        </InputLeftElement>
        <Input
          bgColor={"white"}
          color={"gray.700"}
          placeholder="Search by nickname or username"
          value={inputVal}
          onChange={handleChange}
        />
      </InputGroup>
    </Box>
  );
};

export default SearchChat;
