export interface IBaseResponse {
    isSuccess: boolean;
    message: string;
}

export interface IBaseErrorResponse extends IBaseResponse {
    errors?: Array<{ [key: string]: string }>;
}

export interface IBaseDataPagination<T> {
    items: Array<T>;
    totalItems: number;
    offset: number;
    perPage: number;
    totalPages: number;
    currentPage: number;
    prevPage: number | null;
    nextPage: number | null;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    pagingCounter: number;
}
