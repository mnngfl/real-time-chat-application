import { useRecoilState } from "recoil";
import { AlertDialogStateAction, alertDialogState } from "../state";

const useAlertDialog = () => {
  const [alertDialog, setAlertDialog] = useRecoilState(alertDialogState);

  const openAlert = (
    title: string,
    desc: string,
    action?: Partial<AlertDialogStateAction>
  ) => {
    setAlertDialog({
      isOpen: true,
      title,
      desc,
      action: action && hasButtonAction() ? action : {},
    });
  };

  const closeAlert = () => {
    setAlertDialog((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const hasButtonAction = () => {
    return (
      alertDialog.action?.label &&
      typeof alertDialog.action?.handler === "function"
    );
  };

  return { openAlert, closeAlert, hasButtonAction };
};

export default useAlertDialog;
