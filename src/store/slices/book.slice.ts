import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";
import { axiosTo } from "../../utils/promise";
import { addToastNotificationArr, toggleCreateBookModal } from "./state.slice";
const cookies = new Cookies();

type BookSelection = {
  bookObj: any;
  active: boolean;
};

const BookSelectionDefault: [BookSelection] = [
  {
    bookObj: "Definition",
    active: true,
  },
];

interface InitialState {
  bookRes: any;
  bookResArrCheckbox: any[];
  postBookIsLoading: boolean;
  getAllBookIsLoading: boolean;
  // will only contain 1 book at any time
  selectedTab: BookSelection;
  // lastSavedBook: any[];
  bookSelection: BookSelection[];
}

const initialState: InitialState = {
  bookRes: {},
  bookResArrCheckbox: [],
  postBookIsLoading: true,
  getAllBookIsLoading: true,
  // will only contain 1 book at any time
  selectedTab: {
    bookObj: "Definition",
    active: true,
  },
  // lastSavedBook: [],
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
  async (payload: any, thunkApi) => {
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
    const userId = cookies.get("user-id", { doNotParse: true });
    if (!userId) return [];
    const [err, res] = await axiosTo(
      axios.get(`/api/getAllBook`, { params: { userId: userId } })
    );
    if (err) {
      thunkApi.dispatch(addToastNotificationArr(err.data));
    }
    return res;
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
    resetBookSelection: (state) => {
      state.bookSelection = BookSelectionDefault;
    },
    changeActiveTab: (state, action) => {
      // TODO HERE
      state.bookSelection.forEach((book) => {
        book.active = false;
      });
      state.bookSelection[action.payload].active = true;
      state.selectedTab = state.bookSelection[action.payload];
    },
    handlebookResArrCheckboxChange: (state, action) => {
      state.bookResArrCheckbox.forEach((item: any, index) => {
        if (index === action.payload) {
          item.checked = !item.checked;
        }
      });
    },
    resetbookResArrCheckbox: (state) => {
      state.bookResArrCheckbox.forEach((item: any) => (item.checked = false));
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
  resetBookSelection,
} = book.actions;
export default book;
