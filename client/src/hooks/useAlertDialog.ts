import { useSetRecoilState } from "recoil";
import { AlertDialogStateAction, alertDialogState } from "@/state";
import { isAxiosError } from "axios";

const useAlertDialog = () => {
  const setAlertDialog = useSetRecoilState(alertDialogState);

  const openAlert = (title: string, desc: unknown, action?: Partial<AlertDialogStateAction>) => {
    setAlertDialog({
      isOpen: true,
      title,
      desc: isAxiosError(desc) ? desc.message : (desc as string),
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
