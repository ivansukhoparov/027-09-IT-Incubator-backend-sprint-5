import { WithId } from 'mongodb';
import { UserOutputDto, UserOutputMeType, UserType } from './output';

export const userMapper = (user: any): UserOutputDto => {
  return {
    id: user.id,
    login: user.login,
    email: user.email,
    createdAt: new Date(user.createdAt).toISOString(),
  };
};

export const userMeMapper = (user: WithId<UserType>): UserOutputMeType => {
  return {
    login: user.login,
    email: user.email,
    userId: user._id.toString(),
  };
};
