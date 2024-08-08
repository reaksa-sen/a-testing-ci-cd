import { IUser } from "../database/models/user.model";

export interface UserCreationRepoParams {
  email: string;
  name: string;
  gender: string;
  age: number;
  image?: string;
}

export interface UserCreationRequestParams {
  email: string;
  name: string;
  gender: string;
  age: number;
  image: string;
}

export interface UserUpdateRequestParams {
  username?: string;
  gender?: string;
  age?: number;
}

export interface UserProfileResponse {
  message: string;
  data: IUser;
}

export interface SignupRequest {
  email: string;
  username: string;
  password: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}
