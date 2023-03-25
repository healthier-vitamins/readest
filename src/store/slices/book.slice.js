import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosTo } from "../../utils/promiseUtil";
import { addToastNotificationArr, toggleCreateBookModal } from "./state.slice";

const initialState = {
  bookRes: {},
  bookResArrCheckbox: [],
  postBookIsLoading: true,
  getAllBookIsLoading: true,
  // will only contain 1 book at any time
  selectedTab: {
    bookObj: "Definition",
    active: true,
  },
  lastSavedBook: [],
  bookSelection: [
    {
      bookObj: "Definition",
      active: true,
    },
  ],
};

// create book
export const postBook = createAsyncThunk(
  "postBook",
  async (payload, thunkApi) => {
    const [err, res] = await axiosTo(axios.post("/api/postBook", payload));
    if (err) {
      thunkApi.dispatch(addToastNotificationArr(err.data));
      return;
    }
    thunkApi.dispatch(toggleCreateBookModal());
    thunkApi.dispatch(getAllBook());
    return res;
  }
);

// get books
export const getAllBook = createAsyncThunk(
  "getAllBook",
  async (payload, thunkApi) => {
    const resp = await axios.get(`/api/getAllBook`);
    return resp.data;
  }
);

const book = createSlice({
  name: "book",
  initialState,
  reducers: {
    addBookSelection: (state, action) => {
      state.bookSelection.forEach((book) => {
        book.active = false;
      });

      if (
        state.bookSelection.some(
          (book) =>
            JSON.stringify(book.bookObj) === JSON.stringify(action.payload)
        )
      ) {
        const index = state.bookSelection.findIndex(
          (book) =>
            JSON.stringify(book.bookObj) === JSON.stringify(action.payload)
        );
        state.bookSelection[index].active = true;
        state.selectedTab = state.bookSelection[index];
      } else {
        const tempObj = {
          bookObj: action.payload,
          active: true,
        };
        state.bookSelection.push(tempObj);
        state.selectedTab = tempObj;
      }
    },
    changeActiveTab: (state, action) => {
      state.bookSelection.forEach((book) => {
        book.active = false;
      });
      state.bookSelection[action.payload].active = true;
      state.selectedTab = state.bookSelection[action.payload];
    },
    handlebookResArrCheckboxChange: (state, action) => {
      state.bookResArrCheckbox.forEach((item, index) => {
        if (index === action.payload) {
          item.checked = !item.checked;
        }
      });
    },
    resetbookResArrCheckbox: (state) => {
      state.bookResArrCheckbox.forEach((item) => (item.checked = false));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postBook.fulfilled, (state, action) => {
        state.postBookIsLoading = false;
      })
      .addCase(postBook.pending, (state) => {
        state.postBookIsLoading = true;
      })
      .addCase(postBook.rejected, (state) => {
        state.postBookIsLoading = true;
      })
      .addCase(getAllBook.fulfilled, (state, action) => {
        state.getAllBookIsLoading = false;
        state.bookRes = action.payload;
        let tempObj;
        let tempArr = [];

        action.payload.results.forEach((result) => {
          tempObj = {
            result: result,
            checked: false,
          };
          tempArr.push(tempObj);
        });
        // console.log("temp arr, ", tempArr);
        state.bookResArrCheckbox = tempArr;
      })
      .addCase(getAllBook.pending, (state) => {
        state.getAllBookIsLoading = true;
      })
      .addCase(getAllBook.rejected, (state) => {
        state.getAllBookIsLoading = true;
      });
  },
});

export const {
  addBookSelection,
  changeActiveTab,
  handlebookResArrCheckboxChange,
  resetbookResArrCheckbox,
} = book.actions;
export default book.reducer;
