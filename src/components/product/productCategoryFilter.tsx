import { HttpError, useList } from "@refinedev/core";
import { Button, Pagination, Skeleton, Space } from "antd";
import { useEffect, useState } from "react";

import { RESOURCES } from "@constants";
import { ICategory } from "interfaces";

type ProductItemProps = {
    value?: string[];
    onChange?: (value: string[]) => void;
};

export const ProductCategoryFilter: React.FC<ProductItemProps> = ({
    onChange,
    value,
}) => {
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [filterCategories, setFilterCategories] = useState<string[]>(
        value ?? []
    );

    useEffect(() => {
        if (filterCategories.length > 0) {
            onChange?.(filterCategories);
        }
    }, [filterCategories]);

    const { data: categoryData, isLoading: categoryIsLoading } = useList<
        ICategory,
        HttpError
    >({
        resource: RESOURCES.categories,
        pagination: {
            current,
            pageSize,
        },
        sorters: [
            {
                field: "createdAt",
                order: "asc",
            },
        ],
        queryOptions: {
            staleTime: 60 * 1000,
        },
    });

    const toggleFilterCategory = (clickedCategory: string) => {
        const target = filterCategories.findIndex(
            (category) => category === clickedCategory
        );

        if (target < 0) {
            setFilterCategories((prevCategories) => {
                return [...prevCategories, clickedCategory];
            });
        } else {
            const copyFilterCategories = [...filterCategories];

            copyFilterCategories.splice(target, 1);

            setFilterCategories(copyFilterCategories);
        }

        onChange?.(filterCategories);
    };

    const handleChangePage = (page: number, pageSize: number) => {
        setCurrent(page);
        setPageSize(pageSize);
    };

    if (categoryIsLoading) {
        return <Skeleton active paragraph={{ rows: 6 }} />;
    }

    return (
        <Space direction="vertical" size={8}>
            <Pagination
                onChange={handleChangePage}
                simple
                current={current}
                pageSize={pageSize}
                total={categoryData?.total}
            />
            <Space wrap>
                <Button
                    shape="round"
                    type={filterCategories.length === 0 ? "primary" : "default"}
                    onClick={() => {
                        setFilterCategories([]);
                        onChange?.([]);
                        setCurrent(1);
                        setPageSize(10);
                    }}
                >
                    Tất cả
                </Button>
                {categoryData?.data.map((category) => (
                    <Button
                        key={category._id}
                        shape="round"
                        type={
                            filterCategories.includes(category._id.toString())
                                ? "primary"
                                : "default"
                        }
                        onClick={() =>
                            toggleFilterCategory(category._id.toString())
                        }
                    >
                        {category.name}
                    </Button>
                ))}
            </Space>
        </Space>
    );
};
