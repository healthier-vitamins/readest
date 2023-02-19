import axios from "axios";
// import { to } from "../../utils/promiseUtil";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const initialState = {
  isSignUpLoading: true,
  isConfirmEmailLoading: true,
};

export const signUp = createAsyncThunk("signUp", async (payload, thunkApi) => {
  const resp = await axios.post("api/signUp", payload);
  return resp.data;
});

export const confirmEmail = createAsyncThunk(
  "confirmEmail",
  async (payload, thunkApi) => {
    try {
      const response = await axios.get("api/confirmEmail");
      console.log("res ??????????????? ", response);
      return response.data;
    } catch (err) {
      console.log("err ????????????????????? ", err);
      thunkApi.rejectWithValue(err);
    }

    // const resp = await axios.post("api/confirmEmail", payload);
    // console.log("res ??????????????? ", resp);
    // return resp.data;

    // const resp = await axios
    //   .post("api/confirmEmail", payload)
    //   .then((data) => {
    //     console.log(data);
    //   })
    //   .catch((error) => {
    //     if (error.response) {
    //       // The request was made and the server responded with a status code
    //       // that falls out of the range of 2xx
    //       console.log(error.response.data);
    //       console.log(error.response.status);
    //       console.log(error.response.headers);
    //     } else if (error.request) {
    //       // The request was made but no response was received
    //       // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    //       // http.ClientRequest in node.js
    //       console.log(error.request);
    //     } else {
    //       // Something happened in setting up the request that triggered an Error
    //       console.log("Error", error.message);
    //     }
    //     console.log(error.config);
    //   });
    // console.log("resp ??????????????????? ", resp);
    // console.log("wf is happening????????");

    // const response = await fetch("http://localhost:8888/api/confirmEmail", {
    //   method: "POST", // *GET, POST, PUT, DELETE, etc.
    //   mode: "cors", // no-cors, *cors, same-origin
    //   cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    //   credentials: "same-origin", // include, *same-origin, omit
    //   headers: {
    //     "Content-Type": "application/json",
    //     // 'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    //   redirect: "follow", // manual, *follow, error
    //   referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //   body: JSON.stringify(payload), // body data type must match "Content-Type" header
    // });

    // // if (err) {
    // //   console.log("err ????????????????????? ", err);
    // // }
    // console.log("res ??????????????? ", response);
    // return response.json(); // parses JSON response into native JavaScript objects
  }
);

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
      })
      .addCase(confirmEmail.fulfilled, (state) => {
        state.isConfirmEmailLoading = false;
      })
      .addCase(confirmEmail.pending, (state) => {
        state.isConfirmEmailLoading = true;
      })
      .addCase(confirmEmail.rejected, (state, action) => {
        state.isConfirmEmailLoading = true;
        console.log("rejected ??????????????? ", action);
      });
  },
});
export default user.reducer;
