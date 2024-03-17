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
      action: action && hasButtonAction(action) ? action : {},
    });
  };

  const closeAlert = () => {
    setAlertDialog((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const hasButtonAction = (action: Partial<AlertDialogStateAction>) => {
    return action?.label && typeof action?.handler === "function";
  };

  return { openAlert, closeAlert, hasButtonAction };
};

export default useAlertDialog;
