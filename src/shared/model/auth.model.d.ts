import { IUser } from "../../module/core/users/model/postuser.model.js";

export type AuthPayload<T> = {
  User: IUser;
};
