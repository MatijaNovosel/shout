import { GENERALIZED_FILE_TYPES, MIME_TYPES, MIME_TYPE_ICONS } from "./constants";
import { firebase } from "src/boot/firebase";
import axios from "axios";

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

export const bytesToSize = (bytes) => {
  const sizes = ["b", "kB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
};

export const downloadFile = (file) => {
  const link = document.createElement("a");
  link.setAttribute("target", "_blank");
  link.setAttribute("href", URL.createObjectURL(file));
  link.setAttribute("download", file.name);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateGuid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const getFileFromUrl = async (url, name, defaultType = "image/jpeg") => {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], name, {
    type: response.headers.get("content-type") || defaultType
  });
};

export const blobToFile = (blob, fileName) => {
  return new File([blob], fileName, { type: blob.type });
};

export const sample = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const readDocuments = async (collection, options = {}) => {
  const { where, orderBy, limit } = options;
  let query = firebase.firestore().collection(collection);

  if (where) {
    if (where[0] instanceof Array) {
      // It's an array of array
      for (const w of where) {
        query = query.where(...w);
      }
    } else {
      query = query.where(...where);
    }
  }

  if (orderBy) {
    query = query.orderBy(...orderBy);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const res = await query.get();

  return res;
};

export const checkUsernamePattern = (username) => {
  return /^[A-Za-z]+#[0-9]{6}$/.test(username);
};

export const copyToClipboard = (text) => {
  const clipboardData =
    event.clipboardData ||
    window.clipboardData ||
    event.originalEvent?.clipboardData ||
    navigator.clipboard;
  clipboardData.writeText(text);
};

export const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const uploadTaskPromise = async (fileGuid, file) => {
  return new Promise(function (resolve, reject) {
    const storageRef = firebase.storage().ref(fileGuid);
    const uploadTask = storageRef.put(file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (err) => reject(err),
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          resolve(downloadURL);
        });
      }
    );
  });
};

export const stripHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

export const getYoutubeUrlMetadata = async (url) => {
  const metadataUrl = `https://www.youtube.com/oembed?url=${url}&format=json`;
  const { data } = await axios.get(metadataUrl);
  return data;
};

export const imageSize = (url) => {
  const img = document.createElement("img");
  const promise = new Promise((resolve, reject) => {
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      resolve({ width, height });
    };
    img.onerror = reject;
  });
  img.src = url;
  return promise;
};

export const videoSize = (url) => {
  const video = document.createElement("video");
  const promise = new Promise((resolve, reject) => {
    video.onloadedmetadata = () => {
      const width = video.videoWidth;
      const height = video.videoHeight;
      resolve({ width, height });
    };
    video.onerror = reject;
  });
  video.src = url;
  return promise;
};

export const fileIsType = (fileName, types) => {
  let isType = false;

  types.forEach((type) => {
    if (type === GENERALIZED_FILE_TYPES.IMAGE) {
      isType = isType || ["jpg", "png", "gif", "jpeg"].includes(getFileExtension(fileName));
    } else if (type === GENERALIZED_FILE_TYPES.AUDIO) {
      isType = isType || ["mp3", "wav"].includes(getFileExtension(fileName));
    } else if (type === GENERALIZED_FILE_TYPES.VIDEO) {
      isType = isType || ["mp4", "webm"].includes(getFileExtension(fileName));
    }
  });

  return isType;
};
