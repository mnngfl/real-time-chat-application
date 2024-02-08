import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import React, { useRef } from "react";

interface AlertOverlayActionProps {
  content: string;
  handler: () => void;
}

interface AlertOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  action: Partial<AlertOverlayActionProps>;
}

const AlertOverlay: React.FC<AlertOverlayProps> = ({
  isOpen,
  onClose,
  title,
  description,
  action,
}) => {
  const cancelRef = useRef(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={cancelRef}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize={"md"} fontWeight={"bold"}>
            {title}
          </AlertDialogHeader>
          <AlertDialogBody>{description}</AlertDialogBody>
          <AlertDialogFooter>
            <Button
              colorScheme="gray"
              onClick={onClose}
              ref={cancelRef.current}
            >
              Close
            </Button>
            {action?.content && typeof action?.handler === "function" && (
              <Button colorScheme="teal" ml={3} onClick={action.handler}>
                {action.content}
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AlertOverlay;
