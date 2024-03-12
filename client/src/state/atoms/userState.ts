import { atom } from "recoil";
import { BaseUser, OnlineUser } from "../../types/users";

export const userState = atom<BaseUser | null>({
  key: "userState",
  default: null,
  effects: [
    ({ setSelf }) => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setSelf(JSON.parse(storedUser));
      } else {
        setSelf(null);
      }
    },
  ],
});

export const onlineUserListState = atom<Array<OnlineUser> | []>({
  key: "onlineUserListState",
  default: [],
});
