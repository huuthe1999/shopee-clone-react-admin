import { IFile, IProvince } from "interfaces";

export interface IProduct {
    _id: string;
    name: string;
    isActive: boolean;
    images: IFile[];
    category: string;
    price: number;
    quantity: number;
    rating: number;
    discount: number;
    province: IProvince;
    sold: number;
    viewed: number;
    slug: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}
