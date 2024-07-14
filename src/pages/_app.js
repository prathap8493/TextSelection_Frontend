import { ChakraProvider } from '@chakra-ui/react';
import { theme } from "../themes/theme";
import "../styles/globals.css";
import SuperTokens from 'supertokens-web-js';
import Session from 'supertokens-web-js/recipe/session';
import ThirdPartyEmailPassword from "supertokens-web-js/recipe/thirdpartyemailpassword";
import EmailPassword from 'supertokens-web-js/recipe/emailpassword'
import { appInfo } from "@/config/appInfo";
import { sessionTokenFrontendDomain } from "@/config/config";
import { Provider, useDispatch, useSelector } from "react-redux";
import store, { persistedStore } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import EmailVerification from "supertokens-web-js/recipe/emailverification";
import GlobalModals from '@/components/GlobalModal';

if (typeof window !== "undefined") {
  SuperTokens.init({
    appInfo,
    recipeList: [
      EmailVerification.init(),
      EmailPassword.init(),
      Session.init({
        tokenTransferMethod: "header",
      }),
      ThirdPartyEmailPassword.init()
    ],
  });
}

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
        <PersistGate load={null} persistor={persistedStore}>
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
            <GlobalModals />
          </ChakraProvider>
        </PersistGate>
      </Provider>
  );
}

export default App;
