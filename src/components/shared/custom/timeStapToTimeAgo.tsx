export function timeAgo(timestamp: Date): string {
  const date = new Date(timestamp);
  const now = new Date();
  const timeDifference = Math.abs(now.getTime() - date.getTime());

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${years}y ago`;
  } else if (months > 0) {
    return `${months}m ago`;
  } else if (weeks > 0) {
    return `${weeks}w ago`;
  } else if (days > 0) {
    return `${days}d ago`;
  } else if (hours > 0) {
    return `${hours}h ago`;
  } else if (minutes > 0) {
    return `${minutes}m ago`;
  } else {
    return `${seconds}s ago`;
  }
}
