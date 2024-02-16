import { atom } from "recoil";
import { BaseUser, OnlineUser } from "../../types/users";

export const userState = atom<BaseUser | null>({
  key: "userState",
  default: null,
});

export const onlineUserListState = atom<Array<OnlineUser> | []>({
  key: "onlineUserListState",
  default: [],
});
