import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useRecoilValue } from "recoil";
import { alertDialogState } from "../../state";
import useAlertDialog from "../../hooks/useAlertDialog";

const AlertOverlay = () => {
  const alertDialog = useRecoilValue(alertDialogState);
  const { closeAlert, hasButtonAction } = useAlertDialog();
  const cancelRef = useRef(null);

  return (
    <AlertDialog
      isOpen={alertDialog.isOpen}
      onClose={closeAlert}
      leastDestructiveRef={cancelRef}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize={"md"} fontWeight={"bold"}>
            {alertDialog.title}
          </AlertDialogHeader>
          <AlertDialogBody>{alertDialog.desc}</AlertDialogBody>
          <AlertDialogFooter>
            <Button
              colorScheme="gray"
              onClick={closeAlert}
              ref={cancelRef.current}
            >
              Close
            </Button>
            {hasButtonAction(alertDialog.action) && (
              <Button
                colorScheme="teal"
                ml={3}
                onClick={alertDialog.action.handler}
              >
                {alertDialog.action.label}
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AlertOverlay;
