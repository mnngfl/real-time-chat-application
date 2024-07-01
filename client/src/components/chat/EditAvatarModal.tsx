import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Link,
  Text,
  Circle,
  HStack,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import { avatarSelector } from "@/state";
import { useEffect, useState } from "react";
import type { FC } from "react";
import { updateAvatar } from "@/services/users";
import { UserAvatar } from "@/components/common";
import useErrorToast from "@/hooks/useErrorToast";

const Avatars = ["", "bear.png", "chicken.png", "dog.png", "giraffe.png", "meerkat.png", "panda.png"];

export type AvatarItemProps = {
  avatar: string;
  isSelected: boolean;
  onSelect: (src: string) => void;
};

export type EditAvatarModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const AvatarItem: FC<AvatarItemProps> = ({ avatar, isSelected, onSelect }) => {
  return (
    <Circle
      _hover={{ cursor: "pointer", brightness: "100%" }}
      onClick={() => onSelect(avatar)}
      size={50}
      filter={"auto"}
      brightness={isSelected ? "100%" : "50%"}
    >
      <UserAvatar avatar={avatar} />
    </Circle>
  );
};

const EditAvatarModal: FC<EditAvatarModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const avatar = useRecoilValue(avatarSelector);
  const [errorMessage, setErrorMessage] = useState<any>(null);
  useErrorToast(errorMessage);

  const [selectedAvatar, setSelectedAvatar] = useState(avatar || "");

  const handleSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
  };

  const handleSave = async () => {
    if (avatar === selectedAvatar) {
      onClose();
      return;
    }

    await updateAvatar(selectedAvatar)
      .then(() => {
        onSuccess();
        onClose();
      })
      .catch((error) => setErrorMessage(error));
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedAvatar(avatar || "");
    }
  }, [isOpen, avatar]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} closeOnEsc={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select your avatar</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <HStack>
            {Avatars.map((avatar, index) => {
              return (
                <AvatarItem
                  key={index}
                  avatar={avatar}
                  isSelected={avatar === selectedAvatar}
                  onSelect={() => handleSelect(avatar)}
                />
              );
            })}
          </HStack>
          <Text mt={4} color={"outline"} fontSize={"0.8em"}>
            Animals icons created by Freepik - Flaticon
            <Link href={"https://www.flaticon.com/free-icons/animals"} isExternal>
              <ExternalLinkIcon mx="2px" />
            </Link>
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => handleSave()}>Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditAvatarModal;
