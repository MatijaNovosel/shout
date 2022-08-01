import { checkUsernamePattern, generateGuid } from "src/utils/helpers";
import { supabase } from "src/supabase";

class UserService {
  async getDetails(uid) {
    const { data, error } = await supabase
      .from("profiles")
      .select("shorthand_id, avatar_url, username, status")
      .eq("id", uid)
      .single();

    // TODO: Collect invites

    if (error) {
      throw error;
    }

    return data;
  }

  async updateUserProfile(uid, username, shorthandId) {
    const { error } = await supabase
      .from("profiles")
      .update({ username, shorthand_id: shorthandId })
      .eq("id", uid);
    if (error) {
      throw error;
    }
  }

  async searchByUsername(searchQuery) {
    if (checkUsernamePattern(searchQuery)) {
      const username = searchQuery.split("#")[0];
      const shorthandId = searchQuery.split("#")[1];

      const { data, error } = await supabase
        .from("profiles")
        .select("id, shorthand_id, username, avatar_url, status")
        .eq("username", username)
        .eq("shorthand_id", shorthandId);

      if (error) {
        throw error;
      }

      return data;
    }
    return [];
  }

  async uploadProfilePicture(file, userId) {
    const guid = generateGuid();
    // const retVal = await firebase.storage().ref(guid).put(file);
    const retVal = {};
    const url = await retVal.ref.getDownloadURL();
    await this.userCollection.doc(userId).update({
      avatarUrl: url
    });
    return url;
  }

  async updatePrivileges(newPrivileges, userId, chatId) {
    // const chat = await firebase.firestore().collection("/chats").doc(chatId).get();
    const chat = {};
    const users = chat.data().users;
    /*
    await firebase
      .firestore()
      .collection("/chats")
      .doc(chatId)
      .update({
        users: users.map((user) => {
          if (user.id === userId) {
            user.privileges = newPrivileges;
          }
          return user;
        })
      });
    */
  }

  async updateLanguage(lang, userId) {
    const { error } = await supabase.from("profiles").update({ lang }).eq("id", userId);
    if (error) {
      throw error;
    }
  }
}

export default new UserService();
