import { Link as ReactRouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  InputRightElement,
  Link as ChakraLink,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { type ChangeEvent, type KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { checkUserNameDuplicate, registerUser } from "@/services/users";
import { useNavigate } from "react-router-dom";
import { useAlertDialog } from "@/hooks";
import ValidatableInput, { ValidatableInputMethods } from "@/components/form/ValidatableInput";
import debounce from "lodash/debounce";
import { DUPLICATED_USER_NAME } from "@/utils/validation";
import { CheckIcon } from "@chakra-ui/icons";

type RegisterFormType = Record<"userName" | "password" | "passwordConfirm" | "nickname", string>;
const initialState = { userName: "", password: "", passwordConfirm: "", nickname: "" };

const Register = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { openAlert } = useAlertDialog();

  const [debouncedUserName, setDebouncedUserName] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [{ userName, password, passwordConfirm, nickname }, setForm] = useState<RegisterFormType>(initialState);
  const [validFields, setValidFields] = useState({
    userName: false,
    password: false,
    passwordConfirm: false,
    nickname: true,
  });
  const [errors, setErrors] = useState<Partial<RegisterFormType>>({});
  const [isSubmitLoading, setIsSubmitLoding] = useState(false);
  const userNameMethodsRef = useRef<ValidatableInputMethods>(null);
  const passwordMethodsRef = useRef<ValidatableInputMethods>(null);
  const passwordConfirmMethodsRef = useRef<ValidatableInputMethods>(null);
  const nicknameMethodsRef = useRef<ValidatableInputMethods>(null);
  const hasError = useMemo(() => Object.values(errors).length > 0, [errors]);
  const isValid = useMemo(() => Object.values(validFields).every((v) => v), [validFields]);

  const handleDebouncedInput = debounce(() => {
    setDebouncedUserName(userName);
  }, 400);

  useEffect(() => {
    if (userName && !errors?.userName) {
      handleDebouncedInput();
    }

    return () => {
      handleDebouncedInput.cancel();
    };
  }, [errors?.userName, userName, handleDebouncedInput]);

  const checkDuplicated = useCallback(async () => {
    try {
      const isDuplicated = await checkUserNameDuplicate(debouncedUserName);
      if (isDuplicated) {
        setErrors((prev) => ({ ...prev, userName: DUPLICATED_USER_NAME }));
      } else {
        setErrors((prev) => {
          delete prev.userName;
          return prev;
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsValidating(false);
    }
  }, [debouncedUserName]);

  useEffect(() => {
    if (debouncedUserName) {
      checkDuplicated();
    }
  }, [checkDuplicated, debouncedUserName]);

  const validateFields = useCallback(
    (fieldName: string) => {
      const newErrors = { ...errors };

      switch (fieldName) {
        case "userName": {
          if (!userNameMethodsRef.current) return;
          const [valid, valueOrErrorMessage] = userNameMethodsRef.current.validate();
          if (valid) {
            delete newErrors.userName;
            setValidFields((prev) => ({ ...prev, userName: true }));
            setIsValidating(true);
          } else {
            newErrors.userName = valueOrErrorMessage;
            setValidFields((prev) => ({ ...prev, userName: false }));
            setIsValidating(false);
          }
          break;
        }
        case "password": {
          if (!passwordMethodsRef.current) return;
          const [valid, valueOrErrorMessage] = passwordMethodsRef.current.validate();
          if (valid) {
            delete newErrors.password;
            setValidFields((prev) => ({ ...prev, password: true }));
          } else {
            newErrors.password = valueOrErrorMessage;
            setValidFields((prev) => ({ ...prev, password: false }));
          }
          break;
        }
        case "passwordConfirm": {
          if (!passwordConfirmMethodsRef.current) return;
          const [valid, valueOrErrorMessage] = passwordConfirmMethodsRef.current.matchWith(password);
          if (valid) {
            delete newErrors.passwordConfirm;
            setValidFields((prev) => ({ ...prev, passwordConfirm: true }));
          } else {
            newErrors.passwordConfirm = valueOrErrorMessage;
            setValidFields((prev) => ({ ...prev, passwordConfirm: false }));
          }
          break;
        }
        case "nickname": {
          if (!nicknameMethodsRef.current) return;
          const [valid, valueOrErrorMessage] = nicknameMethodsRef.current.validate();
          if (valid) {
            delete newErrors.nickname;
            setValidFields((prev) => ({ ...prev, nickname: true }));
          } else {
            newErrors.nickname = valueOrErrorMessage;
            setValidFields((prev) => ({ ...prev, nickname: false }));
          }
          break;
        }
      }

      setErrors(newErrors);
    },
    [errors, password]
  );

  const changed = useCallback(
    (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm((prevState) => ({ ...prevState, [key]: e.target.value }));
      validateFields(e.target.name);
    },
    [validateFields]
  );

  const handleKeyUp = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (!userName || !password || !passwordConfirm) {
      return;
    }

    if (e.key === "Enter") {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitLoding(true);
      const res = await registerUser({
        userName,
        password,
        passwordConfirm,
        nickname,
      });
      toast({
        title: "Register Succeed",
        description: `Hello, ${res.userName}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/login");
    } catch (error) {
      openAlert("Register Failed", error as string);
    } finally {
      setIsSubmitLoding(false);
    }
  };

  return (
    <Container maxW={"container.sm"}>
      <Flex justifyContent={"center"} alignItems={"center"} h={"100%"}>
        <Box width={"32rem"} p={"4rem"} bg="gray.100" borderRadius={8}>
          <Text fontSize={"3xl"} fontWeight={500}>
            Register
          </Text>
          <FormControl my={4} isInvalid={!!errors?.userName} isRequired>
            <FormLabel>User name</FormLabel>
            <InputGroup>
              <ValidatableInput
                placeholder="Enter 4 to 30 lowercase letters and numbers"
                name="userName"
                value={userName}
                onChange={changed("userName")}
                onKeyUp={handleKeyUp}
                ref={userNameMethodsRef}
                fieldname="User name"
              />
              <InputRightElement>
                {userName.length > 0 && isValidating && <Spinner size={"sm"} />}
                {validFields.userName && !isValidating && !errors?.userName && <CheckIcon color={"green.600"} />}
              </InputRightElement>
            </InputGroup>
            {errors?.userName && <FormErrorMessage>{errors.userName}</FormErrorMessage>}
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors?.password} isRequired>
            <FormLabel>Password</FormLabel>
            <ValidatableInput
              type="password"
              placeholder="Please enter a secure password"
              name="password"
              value={password}
              onChange={changed("password")}
              onKeyUp={handleKeyUp}
              ref={passwordMethodsRef}
              fieldname="Password"
            />
            {errors?.password && <FormErrorMessage>{errors.password}</FormErrorMessage>}
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors?.passwordConfirm} isRequired>
            <FormLabel>Password Confirm</FormLabel>
            <ValidatableInput
              type="password"
              name="passwordConfirm"
              value={passwordConfirm}
              onChange={changed("passwordConfirm")}
              onKeyUp={handleKeyUp}
              ref={passwordConfirmMethodsRef}
              fieldname="Password Confirm"
            />
            {errors?.passwordConfirm && <FormErrorMessage>{errors.passwordConfirm}</FormErrorMessage>}
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors?.nickname}>
            <FormLabel>Nickname</FormLabel>
            <ValidatableInput
              type="text"
              placeholder="Please enter a nickname (optional)"
              name="nickname"
              value={nickname}
              onChange={changed("nickname")}
              onKeyUp={handleKeyUp}
              ref={nicknameMethodsRef}
              fieldname="Nickname"
            />
            {errors?.nickname && <FormErrorMessage>{errors.nickname}</FormErrorMessage>}
          </FormControl>

          <Button
            colorScheme="teal"
            size={"lg"}
            my={4}
            w={"100%"}
            isDisabled={!isValid || hasError || isValidating}
            isLoading={isSubmitLoading}
            onClick={() => handleSubmit()}
          >
            Sign Up
          </Button>

          <Text color={"gray.600"}>
            Already have an account?{" "}
            <ChakraLink as={ReactRouterLink} color="teal.500" to="/login" fontWeight={500}>
              Sign In
            </ChakraLink>
          </Text>
        </Box>
      </Flex>
    </Container>
  );
};

export default Register;
