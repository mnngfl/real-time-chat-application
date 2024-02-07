import { createContext, useContext, useState, ReactNode } from "react";
import AlertOverlay from "../components/common/AlertOverlay";

interface AlertDialogContextProps {
  openAlert: (title: string, description: string) => void;
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

  const openAlert = (title: string, description: string) => {
    setTitle(title);
    setDescription(description);
    setIsOpen(true);
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
      />
    </AlertDialogContext.Provider>
  );
};
