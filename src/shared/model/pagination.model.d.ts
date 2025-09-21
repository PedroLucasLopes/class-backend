import { IGetStudent } from "../../module/core/students/model/getstudent.model";

export interface Pagination {
  page?: number;
  limit?: number;
  order?: orderEnum;
}

export enum orderEnum {
  asc = "asc",
  desc = "desc",
}

type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};
