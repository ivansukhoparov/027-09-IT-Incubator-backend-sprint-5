export type credentialsType = {
  user: string;
  password: string;
};

export const testsEndPoints: { [key: string]: string } = {
  usersAdmin: '/sa/users',
  blogsAdmin: '/sa/blogs',
};

export const validAdminCredentials: credentialsType = {
  user: 'admin',
  password: 'qwerty',
};
