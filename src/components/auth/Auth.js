import {
    Box,
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
  } from "@chakra-ui/react";
  import React, { useState } from "react";
  import Login from "./Login";
  import Register from "./Register";
  import {
    getAuthorisationURLWithQueryParamsAndSetState,
    getStateAndOtherInfoFromStorage,
    thirdPartySignInAndUp,
  } from "supertokens-web-js/recipe/thirdpartyemailpassword";
  import { website_url } from "@/config/config";
  import { useDispatch, useSelector } from "react-redux";

  import { useRouter } from "next/router";
import { showLogin, showPricing } from "@/redux/reducer/modals";
//   import toast from "react-hot-toast";
//   import { createUser } from "@/redux/reducers/user";
//   import useAccount from "@/hooks/useAccount";
//   import { CheckEmailExist } from "@/services/apis_v3";
  
  function Auth() {
    const [isLoginView, setIsLoginView] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
  
    const userDetails = useSelector((state) => state.user);
  
    // functions to handles to get the folder docs and chats
  
    const { showLoginModal, showPricingModal } = useSelector(
      (state) => state.modals
    );
    const dispatch = useDispatch();
  
    const router = useRouter();
  
    const onClose = () => {
      dispatch(showLogin(false));
    };
  
    const toggleView = () => {
      setIsLoginView(!isLoginView);
    };
  
    async function googleSignInClicked() {
      setGoogleLoading(true);
      const originalUrl = window.location.href;
      sessionStorage.setItem("originalUrl", originalUrl);
      try {
        const authUrl = await getAuthorisationURLWithQueryParamsAndSetState({
          thirdPartyId: "google",
          // This is where Google should redirect the user back after login or error.
          frontendRedirectURI: `${website_url}/auth/callback/google`,
        });
        dispatch(showLogin(false));
        dispatch(showPricing(false))
  
        window.location.assign(authUrl);
        setGoogleLoading(false);
      } catch (err) {
        setGoogleLoading(false);
        if (err.isSuperTokensGeneralError === true) {
          window.alert(err.message);
        } else {
          window.alert("Oops! Something went wrong.");
        }
      }
    }

  
    return (
      <>
        {/* {!userDetails?.userId ? (
          <>
            <Box
              id="google-onetap-container"
              pos={"fixed"}
              top={0}
              right={0}
            ></Box>
            <GoogleOneTapLogin
              onSuccess={doLogin}
              googleAccountConfigs={{
                client_id:
                  "610752118786-r4i3uvktg4857lf36rn1dsprfljuuebs.apps.googleusercontent.com",
                prompt_parent_id: "google-onetap-container",
                cancel_on_tap_outside: false,
              }}
            />
          </>
        ) : null} */}
  
        <Modal
          isOpen={showLoginModal}
          onClose={onClose}
          size={["xs", "sm"]}
          isCentered
          motionPreset="slideInUp"
          backgroundColor={"white"}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader marginTop={"20px"} fontSize="xl" fontWeight={"bold"}>
              {isLoginView ? "Login" : "Register"}
            </ModalHeader>
            <ModalCloseButton backgroundColor={"white"} borderRadius={"full"} />
            {isLoginView ? (
              <Login
                isLoginView={isLoginView}
                toggleView={toggleView}
                // getUserDetails={getUserDetails}
                googleSignInClicked={googleSignInClicked}
                googleLoading={googleLoading}
              />
            ) : (
              <Register
                isLoginView={isLoginView}
                toggleView={toggleView}
                googleSignInClicked={googleSignInClicked}
                googleLoading={googleLoading}
              />
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }
  
  export default Auth;
  