import moment from "moment-timezone";
import { useEffect, useState } from "react";

function YearTimer() {
  // const [date, setDate] = useState()

  useEffect(() => {
    moment.tz.setDefault("Asia/Singapore");
    const today = moment();
    const endOfYear = moment().endOf("year");
    const startOfYear = moment().startOf("year");
  }, []);

  return <>{console.log(moment().toDate())}</>;
}

export default YearTimer;
