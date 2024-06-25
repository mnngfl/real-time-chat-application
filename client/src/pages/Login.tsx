import { Link as ReactRouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Link as ChakraLink,
  Text,
} from "@chakra-ui/react";
import { type ChangeEvent, useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { loginUser } from "@/services/users";
import { userState } from "@/state";
import { useAlertDialog } from "@/hooks";
import ValidatableInput, { ValidatableInputMethods } from "@/components/form/ValidatableInput";

type LoginFormType = Record<"userName" | "password", string>;
const initialState = { userName: "", password: "" };

const Login = () => {
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userState);
  const { openAlert } = useAlertDialog();

  const [{ userName, password }, setForm] = useState<LoginFormType>(initialState);
  const [validFields, setValidFields] = useState({
    userName: false,
    password: false,
  });
  const [errors, setErrors] = useState<Partial<LoginFormType>>({});
  const [isSubmitLoading, setIsSubmitLoding] = useState(false);
  const userNameMethodsRef = useRef<ValidatableInputMethods>(null);
  const passwordMethodsRef = useRef<ValidatableInputMethods>(null);
  const hasError = useMemo(() => Object.values(errors).length > 0, [errors]);
  const isValid = useMemo(() => Object.values(validFields).every((v) => v), [validFields]);

  const handleKeyUp = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!userName || !password) return;

    if (e.key === "Enter") {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitLoding(true);
      const { data: res } = await loginUser({
        userName,
        password,
      });
      setUser(res);
      navigate("/");
    } catch (error) {
      openAlert("Login Failed", error as string);
    } finally {
      setIsSubmitLoding(false);
    }
  };

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
          } else {
            newErrors.userName = valueOrErrorMessage;
            setValidFields((prev) => ({ ...prev, userName: false }));
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
      }

      setErrors(newErrors);
    },
    [errors]
  );

  const changed = useCallback(
    (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm((prevState) => ({ ...prevState, [key]: e.target.value }));
      validateFields(e.target.name);
    },
    [validateFields]
  );

  return (
    <Container maxW={"container.sm"}>
      <Flex justifyContent={"center"} alignItems={"center"} h={"100%"}>
        <Box width={"32rem"} p={"4rem"} bg="gray.100" borderRadius={8}>
          <Text fontSize={"3xl"} fontWeight={500}>
            Login
          </Text>
          <FormControl my={4} isInvalid={!!errors?.userName}>
            <FormLabel>User name</FormLabel>
            <ValidatableInput
              placeholder="Enter your username"
              name="userName"
              value={userName}
              onChange={changed("userName")}
              onKeyUp={handleKeyUp}
              fieldname="User name"
              ref={userNameMethodsRef}
            />
            {errors?.userName && <FormErrorMessage>{errors.userName}</FormErrorMessage>}
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors?.password}>
            <FormLabel>Password</FormLabel>
            <ValidatableInput
              type="password"
              placeholder="Enter your password"
              name="password"
              value={password}
              onChange={changed("password")}
              onKeyUp={handleKeyUp}
              fieldname="Password"
              ref={passwordMethodsRef}
            />
            {errors?.password && <FormErrorMessage>{errors.password}</FormErrorMessage>}
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            size={"lg"}
            my={4}
            w={"100%"}
            isDisabled={!isValid || hasError}
            isLoading={isSubmitLoading}
            onClick={() => handleSubmit()}
          >
            Sign In
          </Button>

          <Text color={"gray.600"}>
            Not a member yet?{" "}
            <ChakraLink as={ReactRouterLink} color="teal.500" to="/register" fontWeight={500}>
              Register
            </ChakraLink>
          </Text>
        </Box>
      </Flex>
    </Container>
  );
};

export default Login;
