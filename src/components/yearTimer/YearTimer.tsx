import moment from "moment-timezone";
import React, { JSXElementConstructor, useEffect, useState } from "react";
import "./YearTimer.scss";

function YearTimer() {
  const [yearRemainingPercentage, setYearRemainingPercentage] = useState<
    number | null
  >(null);
  // const [yearProgressPercentage, setYearProgressPercentage] = useState<
  //   string | null
  // >(null);

  useEffect(() => {
    moment.tz.setDefault("Asia/Singapore");
    const today = moment();
    const endOfYear = moment().endOf("year");
    const startOfYear = moment().startOf("year");

    const daysRemaining = endOfYear.diff(today, "days");
    const totalDays = endOfYear.diff(startOfYear, "days");
    // console.log(daysRemaining);
    // console.log(totalDays);
    const remainingPercentage = (daysRemaining / totalDays) * 100;
    // const progressPercentage = startOfYear.diff(today)
    console.log(Math.round(remainingPercentage / 10));

    setYearRemainingPercentage(Math.round(remainingPercentage / 10));
  }, []);

  function renderRemaining(): React.ReactElement[] | React.ReactElement {
    if (yearRemainingPercentage) {
      // for (let i = 0; i < yearRemainingPercentage; i++) {
      //   console.log(yearRemainingPercentage);
      //   <span className="timer-progress-shade">&#x2591;</span>;
      // }
      const array = Array(yearRemainingPercentage).fill(1);
      console.log(array);
      return array.map((ele) => (
        <span className="timer-progress-shade">&#x2591;</span>
      ));
    }
    return <></>;
  }
  function renderProgress(): React.ReactElement[] | React.ReactElement {
    if (yearRemainingPercentage) {
      // for (let i = 0; i < yearRemainingPercentage; i++) {
      //   console.log(yearRemainingPercentage);
      //   <span className="timer-progress-shade">&#x2591;</span>;
      // }
      const progress = 10 - yearRemainingPercentage;
      const array = Array(progress).fill(1);
      console.log(array);
      return array.map((ele) => (
        <span className="timer-progress-shade">&#x2593;</span>
      ));
    }
    return <></>;
  }

  return (
    <React.Fragment>
      {yearRemainingPercentage && (
        <div className="timer-container">
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
