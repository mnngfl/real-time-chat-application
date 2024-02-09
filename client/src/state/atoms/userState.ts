import { atom } from "recoil";

export interface User {
  _id: string;
  userName: string;
}

export const userState = atom<User | null>({
  key: "userState",
  default: null,
});
