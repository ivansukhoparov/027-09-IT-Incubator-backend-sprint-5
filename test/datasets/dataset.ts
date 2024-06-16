import { Any } from 'typeorm';

export class TestsDataset {
  errorsResponse(fields: string[]) {
    const response: {
      errorsMessages: Array<{ message: string; field: string }>;
    } = { errorsMessages: [] };
    fields.forEach((f) => {
      response.errorsMessages.push({ message: 'Invalid value', field: f });
    });
    return response;
  }

  createOverLength(number: number) {
    let string = '';
    for (let i = 0; i < number; i++) {
      string += 'o';
    }
    return string;
  }
}

export class ErrorsResponse {
  getBody(fields: string[]) {
    const response: {
      errorsMessages: Array<{ message: string; field: string }>;
    } = { errorsMessages: [] };
    fields.forEach((f) => {
      response.errorsMessages.push({ message: expect.any(String), field: f });
    });
    return response;
  }
}

export const createLengthString = (length: number) => {
  let string = '';
  for (let i = 0; i < length; i++) {
    string += 'o';
  }
  return string;
};
