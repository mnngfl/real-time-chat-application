import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { nicknameSelector } from "../../state";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { checkDuplicateUserName, updateUserName } from "../../services/users";

const EditProfileModal = ({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const nickname = useRecoilValue(nicknameSelector);

  const [inputValue, setInputValue] = useState(nickname || "");
  const [debouncedInput, setDebouncedInput] = useState(nickname || "");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChanged, setIsChanged] = useState(false);
  const [message, setMessage] = useState(
    "Enter 4 to 30 lowercase letters and numbers."
  );

  const hasError = useMemo(
    () => isChanged && isAvailable === false,
    [isAvailable, isChanged]
  );

  const checkDuplicated = useCallback(
    async (value: string) => {
      if (value.match(/^\s+|\s+$/g)) {
        setMessage("Nickname can't have leading or trailing spaces.");
        setIsAvailable(false);
        return;
      }

      if (!value) {
        setMessage("Please enter your username.");
        setIsAvailable(false);
        return;
      }

      if (value === nickname) {
        setIsAvailable(null);
        setMessage("There are no changes.");
        return;
      }

      try {
        const isDuplicated = await checkDuplicateUserName(value);
        setIsAvailable(!isDuplicated);
        setMessage("Available username.");
      } catch (error) {
        console.log(error);
        setIsAvailable(false);
        setMessage(error as string);
      }
    },
    [nickname]
  );

  const handleDebouncedInput = debounce(() => {
    if (!isChanged) return;
    setDebouncedInput(inputValue);
  }, 400);

  useEffect(() => {
    handleDebouncedInput();

    return () => {
      handleDebouncedInput.cancel();
    };
  }, [inputValue, handleDebouncedInput]);

  useEffect(() => {
    checkDuplicated(debouncedInput);
  }, [debouncedInput, checkDuplicated]);

  useEffect(() => {
    if (!isOpen) {
      setIsChanged(false);
      setInputValue(nickname || "");
      setMessage("Enter 4 to 30 lowercase letters and numbers.");
      setIsAvailable(null);
    }
  }, [isOpen, nickname]);

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setIsChanged(true);
    setInputValue(value);
  };

  const handleSave = async () => {
    if (!inputValue) return;
    await updateUserName(inputValue);
    onSuccess();
    onClose();
  };

  const handleReset = () => {
    setIsChanged(false);
    setInputValue(nickname || "");
    handleDebouncedInput.cancel();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={"sm"}
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit user info</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <FormControl isInvalid={hasError}>
              <FormLabel>New Nickname</FormLabel>
              <InputGroup alignItems={"center"}>
                <Input
                  type="text"
                  value={inputValue}
                  onChange={handleValue}
                  maxLength={30}
                />
                <Tooltip label="Undo">
                  <Icon
                    viewBox="0 0 24 24"
                    boxSize={6}
                    ml={3}
                    onClick={() => handleReset()}
                    _hover={{ cursor: "pointer" }}
                  >
                    {/* <?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --> */}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 7H15C16.8692 7 17.8039 7 18.5 7.40193C18.9561 7.66523 19.3348 8.04394 19.5981 8.49999C20 9.19615 20 10.1308 20 12C20 13.8692 20 14.8038 19.5981 15.5C19.3348 15.9561 18.9561 16.3348 18.5 16.5981C17.8039 17 16.8692 17 15 17H8.00001M4 7L7 4M4 7L7 10"
                        stroke="#1C274C"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Icon>
                </Tooltip>
              </InputGroup>
              {hasError ? (
                <FormErrorMessage>{message}</FormErrorMessage>
              ) : (
                <FormHelperText>{message}</FormHelperText>
              )}
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="teal"
            isDisabled={!isAvailable}
            onClick={() => handleSave()}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProfileModal;
