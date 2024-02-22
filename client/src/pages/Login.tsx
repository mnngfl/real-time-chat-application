import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { LoginUserReq, LoginUserRes } from "../types/users";
import { loginUser } from "../services/users";
import { useAlertDialog } from "../context/AlertDialogProvider";
import validator from "validator";
import { userState } from "../state";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [, setUser] = useRecoilState(userState);
  const { openAlert } = useAlertDialog();

  const [formData, setFormData] = useState<LoginUserReq>({
    userName: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginUserReq>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitLoading, setIsSubmitLoding] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (isSubmitted) {
      let newErrors = { ...errors };
      newErrors = validateField(newErrors, name, value);
      setErrors(newErrors);
    }
  };

  const handleKeyUp = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);

    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitLoding(true);
      const res: LoginUserRes = await loginUser(formData);
      localStorage.setItem("user", JSON.stringify(res));
      setUser({ _id: res._id, userName: res.userName });
      navigate("/");
    } catch (error) {
      openAlert("Login Failed", error as string);
    } finally {
      setIsSubmitLoding(false);
    }
  };

  const validateForm = () => {
    let newErrors = { ...errors };
    newErrors = validateField(newErrors, "userName", formData.userName);
    newErrors = validateField(newErrors, "password", formData.password);
    return newErrors;
  };

  const validateField = (
    prevErrors: Partial<LoginUserReq>,
    fieldName: string,
    value: string
  ) => {
    const newErrors = { ...prevErrors };
    switch (fieldName) {
      case "userName":
        if (!validator.matches(value, "([a-z0-9]){4,30}")) {
          newErrors.userName = "Enter 4 to 30 lowercase letters and numbers.";
        } else {
          delete newErrors.userName;
        }
        break;
      case "password":
        if (!validator.isStrongPassword(value, { minUppercase: 0 })) {
          newErrors.password =
            "At least 8 characters with 1 lowercase, 1 number, and 1 special character.";
        } else {
          delete newErrors.password;
        }
        break;
      default:
        break;
    }
    return newErrors;
  };

  return (
    <Container maxW={"container.sm"}>
      <Flex justifyContent={"center"} alignItems={"center"} h={"100%"}>
        <Box width={"32rem"} p={"4rem"} bg="gray.300" borderRadius={8}>
          <Text fontSize={"3xl"} fontWeight={500}>
            Login
          </Text>
          <FormControl my={4} isInvalid={!!errors?.userName}>
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="Enter your username"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
            />
            {errors?.userName && (
              <FormErrorMessage>{errors.userName}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors?.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onKeyUp={handleKeyUp}
            />
            {errors?.password && (
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            )}
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            size={"lg"}
            my={4}
            w={"100%"}
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
