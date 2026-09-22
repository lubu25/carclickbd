import dayjs from "dayjs";

const useFormatTime = () => {
  const formatTime = (createdAt: string) => {
    const now = dayjs();
    const notificationTime = dayjs(createdAt);

    const diffInSeconds = now.diff(notificationTime, "second");
    const diffInMinutes = now.diff(notificationTime, "minute");
    const diffInHours = now.diff(notificationTime, "hour");
    const diffInDays = now.diff(notificationTime, "day");

    if (diffInSeconds < 60) {
      return `${diffInSeconds} ${diffInSeconds === 1 ? "second" : "seconds"} ago`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    } else {
      return notificationTime.format("MMM D, YYYY");
    }
  };

  return { formatTime };
};

export default useFormatTime;
