export class TestsDataset {
  errorsResponse(fields: string[]) {
    const response: { errorsMessages: Object[] } = { errorsMessages: [] };
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
