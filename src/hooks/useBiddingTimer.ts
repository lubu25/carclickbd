import { useState, useEffect } from "react";
import moment from "moment";

const useBiddingTimer = (endBid: any) => {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isCritical, setIsCritical] = useState(false);
  const [daysLeft, setDaysLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const end = moment(endBid);
      const now = moment();
      const diff = end.diff(now);

      if (diff > 24 * 60 * 60 * 1000) {
        // More than 24 hours
        const days = Math.ceil(diff / (24 * 60 * 60 * 1000));
        setDaysLeft(`${days} day${days > 1 ? "s" : ""} left`);
        setIsCritical(false);
        setTimeRemaining(""); // No countdown timer yet
      } else if (diff > 0) {
        // Less than 24 hours, start countdown
        const duration = moment.duration(diff);
        setTimeRemaining(
          `${duration.hours().toString().padStart(2, "0")}:${duration
            .minutes()
            .toString()
            .padStart(2, "0")}:${duration
            .seconds()
            .toString()
            .padStart(2, "0")}`,
        );
        setIsCritical(true);
        setDaysLeft(""); // Clear days left
      } else {
        // Time has expired
        setTimeRemaining("Bid ended");
        setIsCritical(true);
        setDaysLeft("");
      }
    };

    // Run initially and start an interval for updates
    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [endBid]);

  return { timeRemaining, isCritical, daysLeft };
};

export default useBiddingTimer;
