import React from "react";
import dynamic from "next/dynamic";
import { Box } from "@chakra-ui/react";

const Auth = dynamic(() => import("./auth/Auth"), {
  ssr: false,
});
const VerifyEmail = dynamic(() => import("./auth/VerifyEmail"), {
  ssr: false,
});
// const PricingModal = dynamic(() => import("./pricing/PricingModal"), {
//   ssr: false,
// });

function GlobalModals() {
  return (
    <Box>
      <Auth />
      {/* <PricingModal /> */}
      <VerifyEmail />
      {/* <ModeModal/> */}
      {/* <SurveyModal/> */}
    </Box>
  );
}

export default GlobalModals;
