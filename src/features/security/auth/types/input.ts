export type UserRegistrationDto = {
  login: string;
  password: string;
  email: string;
};

export type UserConfirmationCodeDto = {
  code: string;
};

export type UserLoginDto = {
  loginOrEmail: string;
  password: string;
};
