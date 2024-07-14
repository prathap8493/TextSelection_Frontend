import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Heading,
  Box,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
// import Lottie from "lottie-react";
// import mailsent from "../../assets/json/mailsent.json";
// import { sendEmail } from "@/services/home";
import { useDispatch, useSelector } from "react-redux";
// import { showVerifyMail } from "@/redux/reducers/modals";

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const { showVerifyMailModal } = useSelector((state) => state.modals);

  const onClose = () => {
    dispatch(showVerifyMail(false));
  };

  const sendVerifcationEmail = async (e) => {
    e.preventDefault();
    await sendEmail();
    dispatch(showVerifyMail(true));
  };
  return (
    <>
      <Modal isOpen={showVerifyMailModal} onClose={onClose} size={["sm", "md"]}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading as="h2" size="lg" textAlign={"center"} pt="40px">
              Verify Your Email
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody mb="25px" padding={"30px"}>
            <Box width="80%" marginRight="auto" marginLeft="auto">
              {/* <Lottie animationData={mailsent} loop={false} /> */}
            </Box>
            <Text textAlign={"center"}>
              A Verification email has been sent to.Please verify your email to
              proceed.
            </Text>
            <Text mt="7px" textAlign={"center"}>
              Haven’t received verification email? Check your spam folder or{" "}
              <Box as="span" onClick={sendVerifcationEmail} cursor={"pointer"}>
                <b style={{ color: "blue" }}>
                  <u>Resend</u>
                </b>
              </Box>{" "}
              email
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default VerifyEmail;
