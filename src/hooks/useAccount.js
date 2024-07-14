
import Session from "supertokens-web-js/recipe/session";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { EmailVerificationClaim } from "supertokens-web-js/recipe/emailverification";
import { createUser } from "@/redux/reducer/user";
import { getUserDetailsService } from "@/services/api";
  
  function useAccount() {
    const userData = useSelector((state) => state?.user);
    const dispatch = useDispatch();
  
    const getUserDetails = async () => {
      if (await Session.doesSessionExist()) {
        try {
          const userId = await Session.getUserId();
          const userData = await getUserDetailsService();
          let validationErrors = await Session.validateClaims();
          console.log({ "validationErrors.length": validationErrors.length });
          if (validationErrors.length === 0) {
            dispatch(
              createUser({
                userId,
                ...userData?.data,
                verified: true,
                loaded: true,
              })
            );
          } else {
            for (const err of validationErrors) {
              if (err.validatorId === EmailVerificationClaim.id) {
                dispatch(
                  createUser({
                    userId,
                    ...userData?.data,
                    verified: false,
                    loaded: true,
                  })
                );
              }
            }
          }
        } catch (error) {
          dispatch(createUser({ loaded: true }));
          console.log(error);
        }
      } else {
        console.log("ususususus");
        dispatch(createUser({ loaded: true }));
      }
    };
  
    // const getSubscriptionDetails = async () => {
    //   dispatch(setLoading(true));
    //   try {
    //     const response = await subscriptionDetails();
    //     if (response?.data?.status === "success") {
    //       dispatch(setSubscription(response.data?.data));
    //       dispatch(setLoading(false));
    //       dispatch(showPricing(false));
    //       return response.data?.data;
    //     } else {
    //       dispatch(setSubscription([]));
    //       dispatch(setLoading(false));
    //       return [];
    //     }
    //   } catch (error) {
    //     dispatch(setError(error));
    //     dispatch(setLoading(false));
    //     console.log("Error fetching subscription details:", error);
    //   }
    // };
  

  
    return {
      getUserDetails,
    };
  }
  
  export default useAccount;
  