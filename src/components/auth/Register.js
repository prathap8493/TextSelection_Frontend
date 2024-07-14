import { useDispatch } from "react-redux";
import { Box, Input, Text } from "@chakra-ui/react";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
// import google from "../../assets/png/google.png";
import { emailPasswordSignUp } from "supertokens-web-js/recipe/thirdpartyemailpassword";
import { doesEmailExist } from "supertokens-web-js/recipe/thirdpartyemailpassword";
// import { toast } from "react-hot-toast";
import { ModalBody, Button } from "@chakra-ui/react";
import toast from "react-hot-toast";
import { showLogin, showVerifyMail } from "@/redux/reducer/modals";
import useAccount from "@/hooks/useAccount";
// import { sendEmail } from "@/services/home";
// import useAccount from "@/hooks/useAccount";
// import { showLogin, showVerifyMail } from "@/redux/reducers/modals";
// import { addUserToBrevo } from "@/services/apis";
// import { CheckEmailExist } from "@/services/apis_v3";

const Register = ({ toggleView, googleSignInClicked, googleLoading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
//   const {
//     fetchChats,
//     getUserDetails,
//     fetchFoldersDocs,
//     getSubscriptionDetails,
//   } = useAccount();
  const [registerLoding, setRegisterLoading] = useState(false);
  const dispatch = useDispatch();
  const { getUserDetails } = useAccount();

  async function signUpClicked(email, password) {
    try {
      let response = await emailPasswordSignUp({
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
            setRegisterLoading(false);
            toast.error(formField.error);
          } else if (formField.id === "password") {
            setRegisterLoading(false);
            toast.error(formField.error);
          }
        });
      } else if (response.status === "SIGN_UP_NOT_ALLOWED") {
        // this can happen during automatic account linking. Tell the user to use another
        // login method, or go through the password reset flow.
      } else {
        // await sendEmail();
        // addUserToBrevo(email);
        // getUserDetails();
        // fetchChats();
        // fetchFoldersDocs();
        // getSubscriptionDetails();
        getUserDetails();
        dispatch(showLogin(false));
        // dispatch(showVerifyMail(true));

        // const userData=response?.user?.emails[0];
        // const userId=response?.user?.id
        // dispatch(createUser({ userId, userData }));
      }
    } catch (err) {
      if (err.isSuperTokensGeneralError === true) {
        // this may be a custom error message sent from the API by you.
        window.alert(err.message);
      } else {
        toast.error("Oops! Something went wrong.");
      }
    }
  }

  async function checkEmail(email) {
    try {
      let response = await doesEmailExist({
        email,
      });

      if (response.doesExist) {
        toast.error("Email already exists. Please sign in instead");
        setRegisterLoading(false);
      } else {
        await signUpClicked(email, password);
      }
    } catch (err) {
      if (err.isSuperTokensGeneralError === true) {
        // this may be a custom error message sent from the API by you.
        toast.error(err.message);
      } else {
        toast.error("Oops! Something went wrong.");
        setRegisterLoading(false);
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    checkEmail(email);
  };

  return (
    <ModalBody>
      <Text marginTop={"-15px"} color={"#585858"} fontSize={"16px"}>
        Welcome to ChatWithPdf.AI 👋
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
          fontWeight="normal"
        >
          {googleLoading ? "Loading..." : "Sign Up With Google"}
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
            border: "rgb(255, 130, 72)",
          }}
          isLoading={registerLoding ? true : false}
          loadingText="Loading..."
          colorScheme="rgb(255, 130, 72)"
          variant="outline"
        >
          Register
        </Button>
      </Box>
      <Text
        style={{ textAlign: "center" }}
        marginTop={"10px"}
        color="#585858"
        fontSize={"16px"}
      >
        Have an existing account?{" "}
        <span
          style={{ color: "#eb661e", cursor: "pointer" }}
          onClick={toggleView}
        >
          Login
        </span>
      </Text>
      <Text
        textAlign={"center"}
        fontSize={"13px"}
        marginTop={"15px"}
        marginBottom={"30px"}
        color="#585858"
      >
        By signing in, you agree to our{" "}
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

export default Register;
