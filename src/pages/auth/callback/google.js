import React, { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { thirdPartySignInAndUp } from "supertokens-web-js/recipe/thirdpartyemailpassword";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { createUser } from "@/redux/reducer/user";
import { showLogin } from "@/redux/reducer/modals";
import useAccount from "@/hooks/useAccount";
// import { addUserToBrevo } from "@/services/apis";

function Google() {
  const dispatch = useDispatch();
  const googleRef = useRef(false);

  const router = useRouter();

  const { getUserDetails } = useAccount()
  async function handleGoogleCallback() {
    const originalUrl = sessionStorage.getItem("originalUrl") || "/";
    try {
      const response = await thirdPartySignInAndUp();
      let userData;
      if (response.status === "OK") {
        userData = response?.user?.emails[0];
        if (
          response.createdNewRecipeUser &&
          response.user.loginMethods.length === 1
        ) {
          toast.success("Signup Successful");
          console.log(userData, "userData");
          getUserDetails();
          // const userId = response?.user?.id;
          // dispatch(createUser({ userId, userData }));
        //   addUserToBrevo(userData);
          dispatch(showLogin(false));
        } else {
          toast.success("Signin Successful");
          getUserDetails();
          // const userId = response?.user?.id;
          // dispatch(createUser({ userId, userData }));
          dispatch(showLogin(false));
        }
        
        router.push(originalUrl);
      } else if (response.status === "SIGN_IN_UP_NOT_ALLOWED") {
        // this can happen due to automatic account linking. Please see our account linking docs
      } else {
        toast.error(
          "No email provided by social login. Please use another form of login"
        );
        const returnUrl = window.location.pathname + window.location.search;
        // window.location.assign(returnUrl);
        router.push(returnUrl);
        // window.location.assign("/auth");  redirect back to login page
      }
    } catch (err) {
      if (err.isSuperTokensGeneralError === true) {
        // this may be a custom error message sent from the API by you.
        toast.error(err.message);
        router.push(originalUrl);
      } else {
        console.log(err);
        toast.error("Oops! Something went wrong.");
      }
    }
  }
  useEffect(() => {
    if (!googleRef.current) {
      handleGoogleCallback();
      googleRef.current = true;
    }
  }, []);

  return (
    <div
      style={{
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "2rem",
        fontWeight: "bold",
        // color: "var(--btn-bg-primary)",
      }}
    ></div>
  );
}

export default Google;
