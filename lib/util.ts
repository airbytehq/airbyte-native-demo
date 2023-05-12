export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function bytesReadable(bytes) {
  if (bytes === 0) return "0 bytes";
  if (bytes === 1) return "1 byte";

  const sizes = ["bytes", "KB", "MB", "GB", "TB"];
  const decimals = 1;
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));
  return val + " " + sizes[i];
}

export function timeReadable(iso8601Date: string) {
  const date = new Date(iso8601Date);
  const time = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const formattedDate = date.toLocaleDateString(undefined, {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  return `${time.replace(" ", "")} ${formattedDate}`;
}
