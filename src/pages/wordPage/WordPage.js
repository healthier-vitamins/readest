import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWordForBook } from "../../store/slices/word.slice";

function WordPage() {
  const { selectedTab } = useSelector((state) => state.book);
  const { allBookWord, isGetWordLoading } = useSelector((state) => state.word);
  const dispatch = useDispatch();

  useEffect(() => {
    const payloadObj = {
      bookId: selectedTab.bookObj.id,
    };
    dispatch(getWordForBook(payloadObj));
    // eslint-disable-next-line
  }, [selectedTab.bookObj]);

  return (
    <div>
      {!isGetWordLoading &&
        console.log("HERE BABY |||||||||||||||||||||||| ", allBookWord)}
    </div>
  );
}

export default WordPage;
