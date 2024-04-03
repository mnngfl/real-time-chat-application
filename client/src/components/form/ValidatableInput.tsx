import {
  INVALID_NICKNAME,
  INVALID_PASSWORD,
  INVALID_USER_NAME,
  REGEX_NICKNAME,
  REGEX_USER_NAME,
} from "@/utils/validation";
import { Input } from "@chakra-ui/react";
import type { InputProps } from "@chakra-ui/react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import validator from "validator";

export type ValidatableInputProps = InputProps & {
  fieldname: string;
};

export type ValidatableInputMethods = {
  validate: () => [boolean, string];
  matchWith: (target: string) => [boolean, string];
};

const ValidatableInput = forwardRef<ValidatableInputMethods, ValidatableInputProps>(({ ...inputProps }, methodsRef) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(
    methodsRef,
    () => ({
      validate: (): [boolean, string] => {
        const value = inputRef.current?.value as string;

        if (!value || !value.length) {
          if (inputProps.isRequired) {
            return [false, `Please enter your ${inputProps.fieldname} field.`];
          } else {
            return [true, value];
          }
        }

        switch (inputProps.name) {
          case "userName": {
            const valid = validator.matches(value, REGEX_USER_NAME);
            return valid ? [true, value] : [false, INVALID_USER_NAME];
          }
          case "password": {
            const valid = validator.isStrongPassword(value, {
              minUppercase: 0,
            });
            return valid ? [true, value] : [false, INVALID_PASSWORD];
          }
          case "passwordConfirm": {
            const valid = true;
            return valid ? [true, value] : [false, ""];
          }
          case "nickname": {
            const valid = validator.matches(value, REGEX_NICKNAME);
            return valid ? [true, value] : [false, INVALID_NICKNAME];
          }
        }
        return [false, "Component type is invalid."];
      },
      matchWith: (target: string): [boolean, string] => {
        const value = inputRef.current?.value as string;
        if (inputProps.isRequired && (!value || !value.length))
          return [false, `Please enter your ${inputProps.fieldname} field.`];

        const valid = value === target;
        return valid ? [true, value] : [false, `${inputProps.fieldname} does not match.`];
      },
    }),
    [inputProps.fieldname, inputProps.isRequired, inputProps.name]
  );

  return <Input {...inputProps} ref={inputRef} />;
});

export default ValidatableInput;
