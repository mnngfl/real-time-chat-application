import { selector } from "recoil";
import { User, userState } from "../atoms/userState";

export const userNameSelector = selector({
  key: "userNameSelector",
  get: ({ get }) => {
    const user: User | null = get(userState);
    return user ? user.userName : "Guest";
  },
});

export const isLoggedInSelector = selector({
  key: "isLoggedInSelector",
  get: ({ get }) => {
    const user: User | null = get(userState);
    return !!user;
  },
});
