import { atom } from "recoil";
import { BaseUser } from "../../types/users";

export const userState = atom<BaseUser | null>({
  key: "userState",
  default: null,
});
