const { createSlice } = require("@reduxjs/toolkit");

const initialState = { loaded: false };
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    createUser: (state, { payload }) => {
      return payload;
    },
    addDetails: (state, { payload }) => ({ ...state, ...payload }),
  },
});

export const { createUser, addDetails } = userSlice.actions;
export default userSlice.reducer;
