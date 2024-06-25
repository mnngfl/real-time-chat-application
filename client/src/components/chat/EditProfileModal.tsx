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
import { nicknameSelector } from "@/state";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FC } from "react";
import debounce from "lodash/debounce";
import { checkValidateNickname, updateUserName } from "@/services/users";
import UndoIcon from "@/assets/ico_undo.svg?react";

export type EditProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const EditProfileModal: FC<EditProfileModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const nickname = useRecoilValue(nicknameSelector);

  const [inputValue, setInputValue] = useState(nickname || "");
  const [debouncedInput, setDebouncedInput] = useState(nickname || "");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChanged, setIsChanged] = useState(false);
  const [message, setMessage] = useState("Enter 4 to 30 lowercase letters and numbers.");

  const hasError = useMemo(() => isChanged && isAvailable === false, [isAvailable, isChanged]);

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
        const { data: isDuplicated } = await checkValidateNickname(value);
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

  const handleValue = (e: ChangeEvent<HTMLInputElement>) => {
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
    setInputValue(nickname || "");
    handleDebouncedInput.cancel();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"sm"} closeOnOverlayClick={false} closeOnEsc={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit user info</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <FormControl isInvalid={hasError}>
              <FormLabel>New Nickname</FormLabel>
              <InputGroup alignItems={"center"}>
                <Input type="text" value={inputValue} onChange={handleValue} maxLength={30} />
                <Tooltip hasArrow label="Undo" bg="gray.200" color="black">
                  <Icon
                    viewBox="0 0 24 24"
                    boxSize={6}
                    ml={3}
                    onClick={() => handleReset()}
                    _hover={{ cursor: "pointer" }}
                  >
                    <UndoIcon />
                  </Icon>
                </Tooltip>
              </InputGroup>
              {hasError ? <FormErrorMessage>{message}</FormErrorMessage> : <FormHelperText>{message}</FormHelperText>}
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="teal" isDisabled={!isAvailable} onClick={() => handleSave()}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProfileModal;
