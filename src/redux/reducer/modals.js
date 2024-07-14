const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  showLoginModal: true,
  showVerifyMailModal: false,
  showCookiePopUp: false,
  shouldOpenUpgradeModal: false,
  showModePopUp:false,
  showUserProfilePopUp:false
};

const modalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    showLogin: (state, { payload }) => ({ ...state, showLoginModal: payload }),
    showPricing: (state, { payload }) => ({
      ...state,
      showPricingModal: payload,
    }),
    showVerifyMail: (state, { payload }) => ({
      ...state,
      showVerifyMailModal: payload,
    }),
    showCookies: (state, { payload }) => ({
      ...state,
      showCookiePopUp: payload,
    }),
    showMode: (state, { payload }) => ({
      ...state,
      showModePopUp: payload,
    }),
    showUserProfile: (state, { payload }) => ({
      ...state,
      showUserProfilePopUp: payload,
    }),
  },
});

export const { showLogin, showPricing, showVerifyMail, showCookies,showMode,showUserProfile } =
  modalsSlice.actions;
export default modalsSlice.reducer;
