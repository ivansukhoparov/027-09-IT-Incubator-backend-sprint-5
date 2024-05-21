import { Schema } from '@nestjs/mongoose';

export class UserOutputDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}

@Schema()
export class UserType {
  login: string;
  email: string;
  hash: string;
  createdAt: string;
  isConfirmed: boolean;
}

export class CreateUserDto {
  login: string;
  email: string;
  hash: string;
  isConfirmed: boolean;
}

export type UserOutputAuthType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
  hash: string;
  emailConfirmation: {
    confirmationCode: string;
    isConfirmed: boolean;
  };
};

export type UserOutputMeType = {
  email: string;
  login: string;
  userId: string;
};
