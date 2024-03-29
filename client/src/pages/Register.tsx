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
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import validator from "validator";
import { RegisterUserReq, RegisterUserRes } from "../types/users";
import { registerUser } from "../services/users";
import { useNavigate } from "react-router-dom";
import useAlertDialog from "../hooks/useAlertDialog";
import { trim } from "lodash";

const Register = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { openAlert } = useAlertDialog();

  const [formData, setFormData] = useState<RegisterUserReq>({
    userName: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
  });
  const [errors, setErrors] = useState<Partial<RegisterUserReq>>({});
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
    if (!formData.userName || !formData.password || !formData.passwordConfirm) {
      return;
    }

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
      const nicknameTrim = trim(formData.nickname);
      const res: RegisterUserRes = await registerUser({
        ...formData,
        nickname: nicknameTrim.length > 0 ? nicknameTrim : undefined,
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

  const validateForm = () => {
    let newErrors = { ...errors };
    newErrors = validateField(newErrors, "userName", formData.userName);
    newErrors = validateField(newErrors, "password", formData.password);
    newErrors = validateField(
      newErrors,
      "passwordConfirm",
      formData.passwordConfirm
    );
    if (formData.nickname && formData.nickname.length > 0) {
      setFormData((prev) => ({
        ...prev,
        nickname: trim(prev.nickname),
      }));
      newErrors = validateField(newErrors, "nickname", trim(formData.nickname));
    }
    return newErrors;
  };

  const validateField = (
    prevErrors: Partial<RegisterUserReq>,
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
      case "passwordConfirm":
        if (value.length === 0) {
          newErrors.passwordConfirm = "Enter a password confirm.";
        } else if (!validator.equals(formData.password, value)) {
          newErrors.passwordConfirm = "Passwords do not match.";
        } else {
          delete newErrors.passwordConfirm;
        }
        break;
      case "nickname": {
        if (
          !validator.matches(
            value,
            "^(?!\\s)[a-zA-Z0-9ㄱ-힣\\s]{0,29}[a-zA-Z0-9ㄱ-힣]$"
          )
        ) {
          newErrors.nickname = "Enter up to 30 letters and numbers.";
        } else {
          delete newErrors.nickname;
        }
        break;
      }
      default:
        break;
    }
    return newErrors;
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
            <Input
              placeholder="Enter 4 to 30 lowercase letters and numbers"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              onKeyUp={handleKeyUp}
            />
            {errors?.userName && (
              <FormErrorMessage>{errors.userName}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors?.password} isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Please enter a secure password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onKeyUp={handleKeyUp}
            />
            {errors?.password && (
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors?.passwordConfirm} isRequired>
            <FormLabel>Password Confirm</FormLabel>
            <Input
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              onKeyUp={handleKeyUp}
            />
            {errors?.passwordConfirm && (
              <FormErrorMessage>{errors.passwordConfirm}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors?.nickname}>
            <FormLabel>Nickname</FormLabel>
            <Input
              type="text"
              placeholder="Please enter a nickname (optional)"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              onKeyUp={handleKeyUp}
            />
            {errors?.nickname && (
              <FormErrorMessage>{errors.nickname}</FormErrorMessage>
            )}
          </FormControl>

          <Button
            colorScheme="teal"
            size={"lg"}
            my={4}
            w={"100%"}
            isLoading={isSubmitLoading}
            onClick={() => handleSubmit()}
          >
            Sign Up
          </Button>

          <Text color={"gray.600"}>
            Already have an account?{" "}
            <Link color="teal.500" href="/login" fontWeight={500}>
              Sign In
            </Link>
          </Text>
        </Box>
      </Flex>
    </Container>
  );
};

export default Register;
