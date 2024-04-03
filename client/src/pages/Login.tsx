import { Box, Button, Container, Flex, FormControl, FormErrorMessage, FormLabel, Link, Text } from "@chakra-ui/react";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import type { LoginUserReq, LoginUserRes } from "@/types/users";
import { loginUser } from "@/services/users";
import { userState } from "@/state";
import { useAlertDialog } from "@/hooks";
import ValidatableInput, { ValidatableInputMethods } from "@/components/form/ValidatableInput";

const Login = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  // const from = location.state?.from?.pathname || "/";
  const setUser = useSetRecoilState(userState);
  const { openAlert } = useAlertDialog();

  const [formData, setFormData] = useState<LoginUserReq>({
    userName: "",
    password: "",
  });
  const [validFields, setValidFields] = useState({
    userName: false,
    password: false,
  });
  const [errors, setErrors] = useState<Partial<LoginUserReq>>({});
  const [isSubmitLoading, setIsSubmitLoding] = useState(false);
  const userNameMethodsRef = useRef<ValidatableInputMethods>(null);
  const passwordMethodsRef = useRef<ValidatableInputMethods>(null);
  const hasError = useMemo(() => Object.values(errors).length > 0, [errors]);
  const isValid = useMemo(() => Object.values(validFields).every((v) => v), [validFields]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    validateFields(name);
  };

  const handleKeyUp = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!formData.userName || !formData.password) return;

    if (e.key === "Enter") {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitLoding(true);
      const res: LoginUserRes = await loginUser(formData);
      setUser(res);
      navigate("/");
    } catch (error) {
      openAlert("Login Failed", error as string);
    } finally {
      setIsSubmitLoding(false);
    }
  };

  const validateFields = (fieldName: string) => {
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
  };

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
              value={formData.userName}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
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
            <Link color="teal.500" href="/register" fontWeight={500}>
              Register
            </Link>
          </Text>
        </Box>
      </Flex>
    </Container>
  );
};

export default Login;
