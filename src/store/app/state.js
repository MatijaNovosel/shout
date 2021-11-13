import StorageService from "src/services/storage";

const state = () => ({
  loading: JSON.parse(StorageService.getSavedState("loading"))
});

export default state;
