import { createContext, useContext, useState, ReactNode } from "react";
import AlertOverlay from "../components/common/AlertOverlay";

interface AlertDialogActionProps {
  content: string;
  handler: () => void;
}

interface AlertDialogContextProps {
  openAlert: (
    title: string,
    description: string,
    action?: AlertDialogActionProps
  ) => void;
  closeAlert: () => void;
}

interface AlertDialogProviderProps {
  children: ReactNode;
}

const AlertDialogContext = createContext<AlertDialogContextProps | undefined>(
  undefined
);

export const useAlertDialog = () => {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error(
      "useAlertDialog must be used within an AlertDialogProvider"
    );
  }
  return context;
};

export const AlertDialogProvider: React.FC<AlertDialogProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [action, setAction] = useState<Partial<AlertDialogActionProps>>({});

  const openAlert = (
    title: string,
    description: string,
    action?: AlertDialogActionProps
  ) => {
    setTitle(title);
    setDescription(description);
    setIsOpen(true);
    if (action?.content && typeof action?.handler === "function") {
      setAction(action);
    }
  };

  const closeAlert = () => {
    setIsOpen(false);
  };

  return (
    <AlertDialogContext.Provider value={{ openAlert, closeAlert }}>
      {children}
      <AlertOverlay
        isOpen={isOpen}
        onClose={closeAlert}
        title={title}
        description={description}
        action={action}
      />
    </AlertDialogContext.Provider>
  );
};
