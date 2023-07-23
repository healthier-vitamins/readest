import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosTo } from "../../utils/promise";
import { addToastNotificationArr } from "./state.slice";
import { createBook } from "../apis/book.api";
import httpClient from "../../utils/httpclient/HTTPClient";
import { checkAndHandleTimeoutError } from "../apis/timeoutHandler";
import Cookies from "universal-cookie";
const cookies = new Cookies();

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
  postBookIsLoading: false,
  getAllBookIsLoading: false,
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

// get books
export const getAllBook = createAsyncThunk(
  "getAllBook",
  async (_payload, thunkApi) => {
    const userId = cookies.get("user-id");
    if (!userId) return [];

    const [err, res] = await axiosTo(
      httpClient.Get(`getAllBook`, { userId: userId })
    );
    if (err) {
      if (checkAndHandleTimeoutError(err, null)) {
        thunkApi.dispatch(addToastNotificationArr(err.data));
        return;
      }
      console.log("🚀 ~ file: book.slice.ts:63 ~ res:", res);
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
    // setPostBookIsLoading: (
    //   state: InitialState,
    //   action: PayloadAction<boolean>
    // ) => {
    //   state.postBookIsLoading = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBook.fulfilled, (state: InitialState) => {
        state.postBookIsLoading = false;
      })
      .addCase(createBook.pending, (state: InitialState) => {
        state.postBookIsLoading = true;
      })
      .addCase(createBook.rejected, (state: InitialState) => {
        state.postBookIsLoading = false;
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
        state.getAllBookIsLoading = false;
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
