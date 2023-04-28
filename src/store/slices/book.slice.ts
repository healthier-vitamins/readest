import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";
import { axiosTo } from "../../utils/promise";
import { addToastNotificationArr, toggleCreateBookModal } from "./state.slice";
import { GLOBALVARS } from "utils/GLOBALVARS";
// import { checkAndHandleTimeoutError } from "../../utils/apis/timeoutHandler";
const cookies = new Cookies();
const url = window.location.origin;

export interface BookRes {
  bookName: string;
  id: string;
}

interface BookSelection {
  bookObj: BookRes;
  active: boolean;
}

const BookSelectionDefault: BookSelection[] = [
  {
    bookObj: { bookName: "Definition", id: "0" },
    active: true,
  },
];

interface InitialState {
  bookRes: BookRes[];
  bookResArrCheckbox: any[];
  postBookIsLoading: boolean;
  getAllBookIsLoading: boolean;
  // will only contain 1 book at any time
  selectedTab: BookSelection;
  bookSelection: BookSelection[];
}

const initialState: InitialState = {
  bookRes: [],
  bookResArrCheckbox: [],
  postBookIsLoading: true,
  getAllBookIsLoading: true,
  // will only contain 1 book at any time
  selectedTab: {
    bookObj: { bookName: "Definition", id: "0" },
    active: true,
  },
  bookSelection: [
    {
      bookObj: { bookName: "Definition", id: "0" },
      active: true,
    },
  ],
};

// create book
export const postBook = createAsyncThunk(
  "postBook",
  async (payload: any, thunkApi) => {
    const [err, res] = await axiosTo(
      axios.post(`${url}/api/postBook`, payload)
    );
    if (err) {
      if (err.status === 500) {
        thunkApi.dispatch(addToastNotificationArr(GLOBALVARS.ERROR_TIMEOUT));
        return;
      }
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
    const userId = cookies.get("user-id", { doNotParse: true });
    if (!userId) return [];

    const [err, res] = await axiosTo(
      axios.get(`${url}/api/getAllBook`, { params: { userId: userId } })
    );
    if (err) {
      if (err.status === 500) {
        thunkApi.dispatch(addToastNotificationArr(GLOBALVARS.ERROR_TIMEOUT));
        return [];
      }
      thunkApi.dispatch(addToastNotificationArr(err.data));
      return [];
    }
    return res;
  }
);

const book = createSlice({
  name: "book",
  initialState,
  reducers: {
    addBookSelection: (state: InitialState, action) => {
      state.bookSelection.forEach((book) => {
        book.active = false;
      });

      if (
        state.bookSelection.some((book) => {
          return (
            // JSON.stringify(book.bookObj) === JSON.stringify(action.payload)
            book.bookObj.id === action.payload.id
          );
        })
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
    resetBookSelection: (state: InitialState) => {
      state.bookSelection = BookSelectionDefault;
    },
    changeActiveTab: (state: InitialState, action) => {
      state.bookSelection.forEach((book) => {
        book.active = false;
      });
      state.bookSelection[action.payload].active = true;
      state.selectedTab = state.bookSelection[action.payload];
    },
    handlebookResArrCheckboxChange: (state: InitialState, action) => {
      state.bookResArrCheckbox.forEach((item: any, index) => {
        if (index === action.payload) {
          item.checked = !item.checked;
        }
      });
    },
    resetbookResArrCheckbox: (state: InitialState) => {
      state.bookResArrCheckbox.forEach((item: any) => (item.checked = false));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postBook.fulfilled, (state: InitialState, action) => {
        state.postBookIsLoading = false;
      })
      .addCase(postBook.pending, (state: InitialState) => {
        state.postBookIsLoading = true;
      })
      .addCase(postBook.rejected, (state: InitialState) => {
        state.postBookIsLoading = true;
      })
      .addCase(getAllBook.fulfilled, (state: InitialState, action) => {
        state.getAllBookIsLoading = false;
        state.bookRes = action.payload;
        let tempObj;
        let tempArr: any[] = [];

        if (action.payload?.length > 0) {
          action.payload.forEach((result: any) => {
            tempObj = {
              result: result,
              checked: false,
            };
            tempArr.push(tempObj);
          });
        }
        // console.log("temp arr, ", tempArr);
        state.bookResArrCheckbox = tempArr;
      })
      .addCase(getAllBook.pending, (state: InitialState) => {
        state.getAllBookIsLoading = true;
      })
      .addCase(getAllBook.rejected, (state: InitialState) => {
        state.getAllBookIsLoading = true;
      });
  },
});

export const {
  addBookSelection,
  changeActiveTab,
  handlebookResArrCheckboxChange,
  resetbookResArrCheckbox,
  resetBookSelection,
} = book.actions;
export default book;
