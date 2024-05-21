export const tokenServiceCommands: createTokenStatusesType = {
  empty: 'empty',
  create: 'create',
  set: 'set',
};

export type createTokenStatusesKeysType = 'empty' | 'create' | 'set';

type createTokenStatusesType = {
  [key: string]: createTokenStatusesKeysType;
};

export type tokenModel = {
  [key: string]: string;
};
