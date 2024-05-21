export class TestViewModel {
  constructor(
    public pagesCount: number = 0,
    public page: number = 1,
    public pageSize: number = 10,
    public totalCount: number = 0,
    public items: Array<any> = [],
  ) {}
}
