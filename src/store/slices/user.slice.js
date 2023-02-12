import axios from "axios";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const initialState = {
  isSignUpLoading: true,
};

export const signUp = createAsyncThunk("signUp", async (payload, thunkApi) => {
  const resp = await axios.post("api/signUp", payload);
  return resp.data;
});

const user = createSlice({
  name: "user",
  initialState,

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUp.fulfilled, (state, action) => {
        state.isSignUpLoading = false;
      })
      .addCase(signUp.pending, (state) => {
        state.isSignUpLoading = true;
      })
      .addCase(signUp.rejected, (state) => {
        state.isSignUpLoading = true;
      });
  },
});
export default user.reducer;
