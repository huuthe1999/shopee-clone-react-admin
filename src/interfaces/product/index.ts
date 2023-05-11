export interface IProduct {
    _id: string;
    name: string;
    isActive: boolean;
    images: string[];
    category: string;
    price: number;
    quantity: number;
    rating: number;
    discount: number;
    sold: number;
    viewed: number;
    slug: string;
    createdAt: string;
    updatedAt: string;
}
