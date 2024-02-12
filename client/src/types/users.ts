export interface BaseUser {
  _id: string;
  userName: string;
}

export interface UserToken {
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface LoginUserReq {
  userName: string;
  password: string;
}

export type LoginUserRes = BaseUser & UserToken;

export type RegisterUserReq = LoginUserReq & {
  passwordConfirm: string;
};

export type RegisterUserRes = BaseUser;

export type FindUserRes = BaseUser;
