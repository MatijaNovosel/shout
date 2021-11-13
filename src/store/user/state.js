import StorageService from "src/services/storage";

export default () => {
  return {
    user: JSON.parse(StorageService.getSavedState("user"))
  };
};
