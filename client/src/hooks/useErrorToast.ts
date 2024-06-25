import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";

const useErrorToast = (error: any) => {
  const toast = useToast();

  useEffect(() => {
    if (error) {
      let message = "An error occurred";
      if (typeof error === "string") {
        message = error;
      } else if (error.message) {
        message = error.message;
      }

      toast({
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);
};

export default useErrorToast;
