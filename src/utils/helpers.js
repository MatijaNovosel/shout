import { MIME_TYPES, MIME_TYPE_ICONS } from "./constants";

export function range(start, stop, step) {
  if (typeof stop === "undefined") {
    stop = start;
    start = 0;
  }

  if (typeof step === "undefined") {
    step = 1;
  }

  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
    return [];
  }

  const result = [];

  for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
    result.push(i);
  }

  return result;
}

export function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function downloadURI(uri, name) {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  link.click();
}

export function secondsToElapsedTime(secs) {
  secs = Math.round(secs);
  const hours = Math.floor(secs / (60 * 60));

  const divisorForMinutes = secs % (60 * 60);
  const minutes = Math.floor(divisorForMinutes / 60);

  const divisorForSeconds = divisorForMinutes % 60;
  const seconds = Math.ceil(divisorForSeconds);

  const obj = {
    h: hours,
    m: minutes,
    s: seconds
  };

  return obj;
}

export function getFileExtension(fileName) {
  const ext = /^.+\.([^.]+)$/.exec(fileName);
  return ext == null ? "" : ext[1];
}

export function getFileIcon(fileName) {
  return MIME_TYPE_ICONS[MIME_TYPES[getFileExtension(fileName)]];
}
