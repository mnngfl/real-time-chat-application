import { atom } from "recoil";

export interface AlertDialogStateAction {
  label: string;
  handler: () => void;
}

export interface AlertDialogStateProps {
  isOpen: boolean;
  title: string;
  desc: string;
  action: Partial<AlertDialogStateAction>;
}

export const alertDialogState = atom<AlertDialogStateProps>({
  key: "alertDialogState",
  default: {
    isOpen: false,
    title: "",
    desc: "",
    action: {},
  },
});
