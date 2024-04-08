import { Box, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import { debounce } from "lodash";
import { useFetchChats } from "@/hooks";

const SearchChat = () => {
  const [inputVal, setInputVal] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");
  const { fetchChats } = useFetchChats();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputVal(value);
  };

  const handleInput = debounce(() => {
    setDebouncedInput(inputVal);
  }, 400);

  const handleSearch = useCallback(async () => {
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
        <Input
          bgColor={"white"}
          color={"gray.700"}
          placeholder="Search by nickname or username"
          onChange={handleChange}
        />
        <InputLeftElement>
          <SearchIcon color={"gray.500"} />
        </InputLeftElement>
      </InputGroup>
    </Box>
  );
};

export default SearchChat;
