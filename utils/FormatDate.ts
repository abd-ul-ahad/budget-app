export default function formattedDate(timestamp: {
  nanoseconds: number;
  seconds: number;
}) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);
  return date.toLocaleString("en-US", options);
}
