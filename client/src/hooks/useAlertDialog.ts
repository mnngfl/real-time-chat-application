import { useSetRecoilState } from "recoil";
import { AlertDialogStateAction, alertDialogState } from "../state";

const useAlertDialog = () => {
  const setAlertDialog = useSetRecoilState(alertDialogState);

  const openAlert = (
    title: string,
    desc: string,
    action?: Partial<AlertDialogStateAction>
  ) => {
    setAlertDialog({
      isOpen: true,
      title,
      desc,
      action:
        action?.label && typeof action.handler === "function" ? action : {},
    });
  };

  const closeAlert = () => {
    setAlertDialog((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  return { openAlert, closeAlert };
};

export default useAlertDialog;
