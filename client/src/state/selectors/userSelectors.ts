import { selector } from "recoil";
import { userState } from "../atoms/userState";
import { BaseUser } from "../../types/users";

export const userIdSelector = selector({
  key: "userIdSelector",
  get: ({ get }) => {
    const user: BaseUser | null = get(userState);
    return user ? user._id : "";
  },
});

export const userNameSelector = selector({
  key: "userNameSelector",
  get: ({ get }) => {
    const user: BaseUser | null = get(userState);
    return user ? user.userName : "Anonymous";
  },
});

export const nicknameSelector = selector({
  key: "nicknameSelector",
  get: ({ get }) => {
    const user: BaseUser | null = get(userState);
    return user ? user.nickname : "Anonymous";
  },
});

export const isLoggedInSelector = selector({
  key: "isLoggedInSelector",
  get: ({ get }) => {
    const user: BaseUser | null = get(userState);
    return !!user?._id;
  },
});
