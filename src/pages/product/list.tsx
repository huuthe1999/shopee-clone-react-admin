import {
    CrudFilters,
    HttpError,
    IResourceComponentsProps,
    getDefaultFilter,
} from "@refinedev/core";

import { CreateButton, useDrawerForm, useSimpleList } from "@refinedev/antd";

import { SearchOutlined } from "@ant-design/icons";
import {
    List as AntdList,
    Col,
    Form,
    Grid,
    Input,
    Row,
    Typography,
} from "antd";

import {
    CreateProduct,
    EditProduct,
    ProductCategoryFilter,
    ProductItem,
} from "components/product";

import { RESOURCES } from "@constants";
import { IProduct } from "interfaces";
import { debounce } from "lodash";
import { useEffect, useRef } from "react";

const { Text } = Typography;

export const ProductList: React.FC<IResourceComponentsProps> = () => {
    const { listProps, searchFormProps, filters, pageCount } = useSimpleList<
        IProduct,
        HttpError,
        { name: string; categories: string[] }
    >({
        syncWithLocation: true,
        pagination: { pageSize: 12, current: 1 },
        onSearch: ({ name, categories }) => {
            const productFilters: CrudFilters = [];

            productFilters.push({
                field: "category",
                operator: "in",
                value: categories?.length > 0 ? categories : undefined,
            });

            productFilters.push({
                field: "name",
                operator: "containss",
                value: name ? name : undefined,
            });

            return productFilters;
        },
    });

    const breakpoint = Grid.useBreakpoint();

    const {
        drawerProps: createDrawerProps,
        formProps: createFormProps,
        saveButtonProps: createSaveButtonProps,
        show: createShow,
    } = useDrawerForm<IProduct>({
        action: "create",
        resource: RESOURCES.products,
        redirect: false,
    });

    const {
        drawerProps: editDrawerProps,
        formProps: editFormProps,
        saveButtonProps: editSaveButtonProps,
        show: editShow,
        id: editId,
    } = useDrawerForm<IProduct>({
        action: "edit",
        resource: RESOURCES.products,
        redirect: false,
    });

    const handleSearch = useRef(
        debounce(() => {
            searchFormProps.form?.submit();
        }, 500)
    ).current;

    useEffect(() => {
        return () => {
            handleSearch.cancel();
        };
    }, [handleSearch]);

    return (
        <div>
            <Form
                {...searchFormProps}
                onValuesChange={() => {
                    handleSearch();
                }}
                initialValues={{
                    name: getDefaultFilter("name", filters, "contains"),
                    categories: getDefaultFilter("category", filters, "in"),
                }}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={18}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                                gap: "8px 24px",
                                marginBottom: "16px",
                            }}
                        >
                            <Text
                                style={{ fontSize: "24px" }}
                                strong
                                hidden={!breakpoint.sm}
                            >
                                Sản phẩm
                            </Text>
                            <Form.Item name="name" noStyle>
                                <Input
                                    style={{
                                        width: !breakpoint.sm ? "80%" : "60%",
                                    }}
                                    placeholder="Tìm sản phẩm"
                                    suffix={<SearchOutlined />}
                                />
                            </Form.Item>
                            <CreateButton
                                onClick={() => createShow()}
                                hideText={!breakpoint.sm}
                            >
                                Thêm sản phẩm
                            </CreateButton>
                        </div>
                        <AntdList
                            grid={{
                                gutter: 8,
                                xs: 1,
                                sm: 1,
                                md: 2,
                                lg: 3,
                                xl: 4,
                                xxl: 4,
                            }}
                            style={{
                                height: "100%",
                                overflow: "auto",
                                paddingRight: "4px",
                            }}
                            {...listProps}
                            pagination={
                                pageCount === 0 ? false : listProps.pagination
                            }
                            renderItem={(item) => (
                                <ProductItem item={item} editShow={editShow} />
                            )}
                        />
                    </Col>
                    <Col xs={0} sm={6}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                height: "40px",
                                marginBottom: "16px",
                            }}
                        >
                            <Text style={{ fontWeight: 500 }}>
                                Lọc theo danh mục
                            </Text>
                        </div>
                        <Form.Item name="categories">
                            <ProductCategoryFilter />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <CreateProduct
                drawerProps={createDrawerProps}
                formProps={createFormProps}
                saveButtonProps={createSaveButtonProps}
            />
            <EditProduct
                drawerProps={editDrawerProps}
                formProps={editFormProps}
                saveButtonProps={editSaveButtonProps}
                editId={editId}
            />
        </div>
    );
};
