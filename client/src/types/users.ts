export interface BaseUser {
  _id: string;
  userName: string;
  nickname?: string;
}

export interface OnlineUser {
  userId: string;
  socketId: string;
}

export interface UserToken {
  accessToken?: string;
  refreshToken?: string;
}

export interface LoginUserReq {
  userName: string;
  password: string;
}

export type LoginUserRes = BaseUser & UserToken;

export type RegisterUserReq = LoginUserReq & {
  passwordConfirm: string;
  nickname?: string;
};

export type RegisterUserRes = BaseUser;

export type FindUserRes = BaseUser;

export type GetUsersRes = BaseUser;
