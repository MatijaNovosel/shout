import StorageService from "src/services/storage";

const state = () => ({
  chats: JSON.parse(StorageService.getSavedState("chats"))
});

export default state;
