import { useDispatch } from "react-redux";
import { Box, Input, Text, useDisclosure } from "@chakra-ui/react";
import Image from "next/image";
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import Link from "next/link";
import { emailPasswordSignIn } from "supertokens-web-js/recipe/thirdpartyemailpassword";
import { ModalBody, Button } from "@chakra-ui/react";
import { sendPasswordResetEmail } from "supertokens-web-js/recipe/emailpassword";
import toast from "react-hot-toast";
import useAccount from "@/hooks/useAccount";

const Login = ({ toggleView, googleSignInClicked, googleLoading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [resetLinkLoading, setResetLinkLoading] = useState(false);
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [resetemail, setResetEmail] = useState("");

  const { getUserDetails } = useAccount();
  async function signInClicked(email, password) {
    try {
      let response = await emailPasswordSignIn({
        formFields: [
          {
            id: "email",
            value: email,
          },
          {
            id: "password",
            value: password,
          },
        ],
      });

      if (response.status === "FIELD_ERROR") {
        response.formFields.forEach((formField) => {
          if (formField.id === "email") {
            toast.error(formField.error);
            setLoginLoading(false);
          }
        });
      } else if (response.status === "WRONG_CREDENTIALS_ERROR") {
        toast.error("Email password combination is incorrect.");
        setLoginLoading(false);
      } else if (response.status === "SIGN_IN_NOT_ALLOWED") {
      } else {
        getUserDetails();
        dispatch(showLogin(false));
      }
    } catch (err) {
      if (err.isSuperTokensGeneralError === true) {
        toast.error(err.message);
        setLoginLoading(false);
      } else {
        toast.error("Oops! Something went wrong.");
        setLoginLoading(false);
      }
    }
  }

  async function sendEmailClicked(resetemail) {
    setResetLinkLoading(true);
    try {
      let response = await sendPasswordResetEmail({
        formFields: [
          {
            id: "email",
            value: resetemail,
          },
        ],
      });

      if (response.status === "FIELD_ERROR") {
        response.formFields.forEach((formField) => {
          if (formField.id === "email") {
            setResetLinkLoading(false);
            toast.error(formField.error, { duration: "100" });
          }
        });
      } else if (response.status === "PASSWORD_RESET_NOT_ALLOWED") {
      } else {
        toast.success("Please check your email for the password reset link", {
          duration: "100",
        });
        setResetLinkLoading(false);
        onClose();
        dispatch(showLogin(false));
      }
    } catch (err) {
      if (err.isSuperTokensGeneralError === true) {
        setResetLinkLoading(false);
        toast.error(err.message);
      } else {
        setResetLinkLoading(false);
        toast.error("Oopns! Something went wrong.");
      }
    }
  }

  const handleSubmit = (e) => {
    console.log("Handling submit");  // Check if this logs when submit is attempted
    e.preventDefault();
    console.log("Prevented default"); // Check if default prevention is logged
    setLoginLoading(true);
    signInClicked(email, password);
  };
  

  const handleReset = (e) => {
    e.preventDefault();
    sendEmailClicked(resetemail);
  };
  return (
    <ModalBody>
      <Text marginTop={"-15px"} color={"#585858"} fontSize={"16px"}>
        Welcome Back. You were missed!
      </Text>
      <Button
        width={"100%"}
        textTransform={"lowercase"}
        fontSize={"15px"}
        borderRadius={"7px"}
        padding={"25px 10px"}
        color={"#000"}
        boxShadow={"1px 1px 10px #89898946!important"}
        marginTop={"20px"}
        backgroundColor={"#fff"}
        fontWeight="normal"
        onClick={googleSignInClicked}
      >
        {/* <Image
          src={google}
          alt={"google"}
          width={25}
          height={25}
          style={{ marginRight: "10px" }}
        /> */}
        <Text
          as="span"
          textTransform="capitalize"
          fontSize="15px"
          fontWeight="normal" // ensure the text is not bold
        >
          {googleLoading ? "Loading..." : "Login with Google"}
        </Text>
      </Button>
      <p
        style={{
          textAlign: "center",
          color: "grey",
          margin: "10px 0px 0px 5px",
          fontSize: "16px",
        }}
      >
        or
      </p>
      <Box as="form" onSubmit={handleSubmit}>
        <Input
          placeholder="Email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          w="100%"
          borderRadius="7px"
          border="2px solid rgb(239,239,239)"
          mb="10px"
          mt="16px"
          h="50px"
          _hover={{
            border: "rgb(255, 130, 72) solid 2px",
          }}
          _focus={{
            borderColor: "black",
            boxShadow: "none",
          }}
        />
        <Input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          w="100%"
          borderRadius="7px"
          border="2px solid rgb(239,239,239)"
          mb="10px"
          mt="5px"
          h="50px"
          _hover={{
            border: "rgb(255, 130, 72) solid 2px",
          }}
          _focus={{
            borderColor: "black",
            boxShadow: "none",
          }}
        />
        <Button
          w="100%"
          type="submit"
          borderRadius="7px"
          color="#fff"
          border="2px solid rgb(239,239,239)"
          mb="10px"
          mt="16px"
          fontWeight={"normal"}
          lineHeight={"1.75"}
          fontSize={"16px"}
          h="50px"
          bgColor="rgb(255, 130, 72)"
          _hover={{
            border: "rgb(255, 130, 72) solid 2px",
          }}
          isLoading={loginLoading ? true : false}
          loadingText="Loading..."
          colorScheme="rgb(255, 130, 72)"
          variant="outline"
        >
          Login
        </Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Forgot Password?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Email"
              type="text"
              onChange={(e) => setResetEmail(e.target.value)}
              w="100%"
              borderRadius="7px"
              border="2px solid rgb(239,239,239)"
              mb="10px"
              mt="5px"
              h="50px"
              _hover={{
                border: "rgb(255, 130, 72) solid 2px",
              }}
              _focus={{
                borderColor: "black",
                boxShadow: "none",
              }}
            />
            <Button
              isLoading={resetLinkLoading ? true : false}
              onClick={handleReset}
              bgColor="rgb(255, 130, 72)"
              colorScheme="rgb(255, 130, 72)"
              loadingText="Loading..."
            >
              Password Reset Link
            </Button>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
      <Text cursor={"pointer"} onClick={onOpen} color={"blue"}>
        Forgot Password?
      </Text>
      <Text
        style={{ textAlign: "center" }}
        marginTop={"10px"}
        color="#585858"
        fontSize={"16px"}
      >
        Don't have an account?{" "}
        <span
          style={{ color: "#eb661e", cursor: "pointer" }}
          onClick={toggleView}
        >
          Register
        </span>
      </Text>
      <Text
        textAlign={"center"}
        fontSize={"13px"}
        marginTop={"15px"}
        marginBottom={"30px"}
        color="#585858"
      >
        By signing up, you agree to our{" "}
        <Link href={"/terms"} target="_blank">
          <b>Terms</b>
        </Link>{" "}
        and{" "}
        <Link href={"/privacy-policy"} target="_blank">
          <b>Privacy policy</b>
        </Link>
      </Text>
    </ModalBody>
  );
};
export default Login;
