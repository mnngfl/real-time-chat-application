import { atom } from "recoil";
import { LoginUserRes, OnlineUser } from "../../types/users";

export const userState = atom<LoginUserRes | null>({
  key: "userState",
  default: null,
  effects: [
    ({ setSelf, onSet }) => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setSelf(JSON.parse(storedUser));
      }

      onSet((newValue, _, isReset) => {
        isReset
          ? localStorage.removeItem("user")
          : localStorage.setItem("user", JSON.stringify(newValue));
      });
    },
  ],
});

export const onlineUserListState = atom<Array<OnlineUser> | []>({
  key: "onlineUserListState",
  default: [],
});
