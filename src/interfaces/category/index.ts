import { IBaseDataPagination, IBaseResponse, IFile } from "interfaces";

export interface ICategoriesResponse extends IBaseResponse {
    data: IBaseDataPagination<ICategory>;
}

export interface ICategory {
    _id: string;
    name: string;
    isActive: boolean;
    images: IFile[];
    subCategories: {
        _id: string;
        name: string;
    }[];
    createdAt: string;
    updatedAt: string;
}
