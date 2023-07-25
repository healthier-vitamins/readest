import { useForm, Controller } from "react-hook-form";
import { createBookModalData } from "../../utils/yupSchemas.ts/createBookModalSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import createBookModalSchema from "../../utils/yupSchemas.ts/createBookModalSchema";
import { Form, Spinner } from "react-bootstrap";
import Cookies from "universal-cookie";
import { useCallback, useEffect } from "react";
import { createBook } from "../../store/apis/book.api";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleCreateBookModal } from "../../store/slices/state.slice";
const cookies = new Cookies();

export default function CreateBookForm() {
  const dispatch = useAppDispatch();

  const { postBookIsLoading } = useAppSelector((store) => {
    return store.book;
  });
  const { createBookModalState } = useAppSelector((store) => {
    return store.state;
  });

  const {
    control,
    formState: { errors, isDirty, isSubmitted, isValid, isSubmitting },
    handleSubmit,
    register,
    getValues,
  } = useForm<createBookModalData>({
    resolver: yupResolver(createBookModalSchema),
    defaultValues: {
      bookName: "",
    },
  });

  const handleCreateBook = useCallback(
    (formData: createBookModalData) => {
      if (!postBookIsLoading && !isSubmitting) {
        const id = cookies.get("user-id");
        const payload = {
          bookName: formData.bookName,
          userId: id,
        };
        dispatch(createBook(payload));
      }
    },
    [postBookIsLoading, isSubmitting]
  );

  useEffect(() => {
    if (createBookModalState) {
      function handleEnter(e: KeyboardEvent) {
        if (e.key === "Enter") {
          // setisClicked(true);
          handleCreateBook(getValues());
        }
      }

      window.addEventListener("keyup", handleEnter);
      return () => {
        window.removeEventListener("keyup", handleEnter);
      };
    }
  }, [createBookModalState, handleCreateBook]);

  return (
    <Form onSubmit={handleSubmit(handleCreateBook)}>
      <Controller
        name="bookName"
        control={control}
        render={({ field }) => (
          <Form.Control
            type="text"
            placeholder="Enter book name"
            className="create-book-modal-form-control"
            id="form_control"
            // id="form-control"
            isInvalid={errors.bookName ? true : false}
            autoFocus={true}
            {...field}
            {...register("bookName")}
          />
        )}
      />
      {errors.bookName && (
        <div className="create-book-error-msg">{errors.bookName.message}</div>
      )}

      <div className="create-book-modal-btn-container">
        <button className="create-book-modal-cfm-btn">
          {postBookIsLoading && isSubmitted && isDirty && isValid && (
            <Spinner size="sm" className="spinner"></Spinner>
          )}
          Confirm
        </button>
        <button
          className="create-book-modal-cancel-btn"
          onClick={() => {
            dispatch(toggleCreateBookModal());
          }}
        >
          Cancel
        </button>
      </div>
    </Form>
  );
}
