import { Injectable } from '@nestjs/common';

@Injectable()
export class ViewModel {
  public pagesCount: number;
  public page: number;
  public pageSize: number;
  public totalCount: number;
  public items: Array<any>;

  constructor(
    pagesCount: number = 0,
    page: number = 1,
    pageSize: number = 10,
    totalCount: number = 0,
    items: Array<any> = [],
  ) {
    this.pagesCount = pagesCount;
    this.page = page;
    this.pageSize = pageSize;
    this.totalCount = totalCount;
    this.items = items;
  }
}
