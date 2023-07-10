/* eslint-disable @typescript-eslint/no-floating-promises */
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import "./YearTimer.scss";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { GLOBALVARS } from "../../utils/GLOBALVARS";
import { useConditionalEffect } from "../../utils/hooks/hooks";
import { getStoicQuote } from "../../store/slices/misc.slice";

function YearTimer() {
  const dispatch = useAppDispatch();
  const { stoicQuote } = useAppSelector((state) => state.misc);

  const [yearRemainingProgress, setYearRemainingProgress] = useState<
    number | null
  >(null);
  const [yearProgressPercentage, setYearProgressPercentage] = useState<
    number | null
  >(null);

  useEffect(() => {
    moment.tz.setDefault("Asia/Singapore");
    const today = moment();
    const endOfYear = moment().endOf("year");
    const startOfYear = moment().startOf("year");

    const daysRemaining = endOfYear.diff(today, "days");
    const totalDays = endOfYear.diff(startOfYear, "days");
    const remainingPercentage = (daysRemaining / totalDays) * 100;

    // console.log(Math.round((remainingPercentage / 100) * 15));
    // console.log(Math.round(((100 - remainingPercentage) / 100) * 15));
    // console.log(Math.round(100 - remainingPercentage));
    setYearProgressPercentage(Math.round(100 - remainingPercentage));
    setYearRemainingProgress(
      Math.round(
        (remainingPercentage / 100) * GLOBALVARS.YEAR_TIMER_NUMBER_OF_BLOCKS
      )
    );
  }, []);

  useConditionalEffect(() => {
    dispatch(getStoicQuote(null));
  }, [stoicQuote.author === null, stoicQuote.quote === null]);

  function renderRemaining(): React.ReactElement[] | React.ReactElement {
    if (yearRemainingProgress) {
      const array = Array(yearRemainingProgress).fill(1);
      return array.map((_ele, index) => (
        <span className="timer-progress-shade" key={index}>
          &#x2591;
        </span>
      ));
    }
    return <></>;
  }
  function renderProgress(): React.ReactElement[] | React.ReactElement {
    if (yearRemainingProgress) {
      const progress =
        GLOBALVARS.YEAR_TIMER_NUMBER_OF_BLOCKS - yearRemainingProgress;
      const array = Array(progress).fill(1);
      return array.map((_ele, index) => (
        <span className="timer-progress-shade" key={index}>
          &#x2593;
        </span>
      ));
    }
    return <></>;
  }

  function renderQuote(): React.ReactElement | null {
    if (!stoicQuote.isLoading && stoicQuote.author && stoicQuote.quote) {
      return (
        <div className="timer-quote-box">
          <span className={GLOBALVARS.DEFAULT_SPAN_CLASS}>
            {stoicQuote.quote}
          </span>
          <span className={GLOBALVARS.DEFAULT_SPAN_CLASS}>
            {stoicQuote.author}
          </span>
        </div>
      );
    }
    return null;
  }

  return (
    <React.Fragment>
      {yearRemainingProgress && (
        <div className="timer-container">
          <div className="timer-header">
            Year progress:&nbsp;{yearProgressPercentage}%
          </div>
          <div className="timer-progress-bar">
            {renderProgress()}
            {renderRemaining()}
          </div>
          <div className="timer-quote">{renderQuote()}</div>
        </div>
      )}
    </React.Fragment>
  );
}

export default YearTimer;
