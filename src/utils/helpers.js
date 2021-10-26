import { MIME_TYPES, MIME_TYPE_ICONS } from "./constants";

export const range = (start, stop, step) => {
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
};

export const randInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const downloadURI = (uri, name) => {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  link.click();
};

export const secondsToElapsedTime = (secs) => {
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
};

export const getFileExtension = (fileName) => {
  const ext = /^.+\.([^.]+)$/.exec(fileName);
  return ext == null ? "" : ext[1];
};

export const getFileIcon = (fileName) => {
  return MIME_TYPE_ICONS[MIME_TYPES[getFileExtension(fileName)]];
};

export const parseMessageForSearch = (msg) => {
  const test =
    ":from User1 :contains IMG :in Channel1 :from 2020-11-25-12-30 :to 2020-11-27-16-50 Message content goes here";
};

export const readUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
};
