import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import "./YearTimer.scss";

function YearTimer() {
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
    setYearRemainingProgress(Math.round((remainingPercentage / 100) * 15));
  }, []);

  function renderRemaining(): React.ReactElement[] | React.ReactElement {
    if (yearRemainingProgress) {
      const array = Array(yearRemainingProgress).fill(1);
      return array.map((ele, index) => (
        <span className="timer-progress-shade" key={index}>
          &#x2591;
        </span>
      ));
    }
    return <></>;
  }
  function renderProgress(): React.ReactElement[] | React.ReactElement {
    if (yearRemainingProgress) {
      const progress = 15 - yearRemainingProgress;
      const array = Array(progress).fill(1);
      return array.map((ele, index) => (
        <span className="timer-progress-shade" key={index}>
          &#x2593;
        </span>
      ));
    }
    return <></>;
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
        </div>
      )}
    </React.Fragment>
  );
}

export default YearTimer;
