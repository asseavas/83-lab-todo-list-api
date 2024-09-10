import { Mixed, Model } from 'mongoose';

export interface UserFields {
  username: string;
  password: string;
  token: string;
}

export interface UserMethods {
  checkPassword(password: string): Promise<boolean>;

  generateToken(): void;
}

export type UserModel = Model<UserFields, {}, UserMethods>;

export interface TaskFields {
  user: Mixed;
  title: string;
  description: string;
  status: string;
}

export type TaskMutation = {
  user: Mixed;
  title: string;
  description: string | null;
  status: string;
};
