import { FormOutlined, MoreOutlined, UploadOutlined } from "@ant-design/icons";
import { RESOURCES } from "@constants";
import {
    BooleanField,
    DateField,
    List,
    NumberField,
    SaveButton,
    TextField,
    getValueFromEvent,
    useDrawerForm,
    useEditableTable,
    useTable,
} from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import {
    Avatar,
    Button,
    Checkbox,
    Dropdown,
    Form,
    Grid,
    Input,
    Menu,
    Space,
    Table,
    Upload,
    message,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { CategoryCreate } from "components/category";
import { EditProduct } from "components/product";
import { uploadInstance } from "config";
import { ICategory, IProduct, IUploadImage } from "interfaces";
import React, { useState } from "react";

export const CategoryList: React.FC<IResourceComponentsProps> = () => {
    const {
        tableProps,
        formProps,
        isEditing,
        saveButtonProps,
        cancelButtonProps,
        setId: setEditId,
    } = useEditableTable<ICategory>({
        syncWithLocation: true,
        queryOptions: {
            staleTime: 60 * 1000,
        },
    });

    const breakpoint = Grid.useBreakpoint();

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const moreMenu = (record: ICategory) => (
        <Menu
            mode="vertical"
            onClick={({ domEvent }) => domEvent.stopPropagation()}
        >
            <Menu.Item
                key="accept"
                style={{
                    fontSize: 15,
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 500,
                }}
                icon={
                    <FormOutlined
                        style={{
                            color: "#52c41a",
                            fontSize: 17,
                            fontWeight: 500,
                        }}
                    />
                }
                onClick={() => {
                    setEditId?.(record._id);
                }}
            >
                Chỉnh sửa
            </Menu.Item>
        </Menu>
    );
    const {
        drawerProps: createDrawerProps,
        formProps: createFormProps,
        saveButtonProps: createSaveButtonProps,
        show: createShow,
        formLoading: createFormLoading,
    } = useDrawerForm<ICategory>({
        action: "create",
        resource: RESOURCES.categories,
        redirect: false,
    });

    return (
        <>
            <List
                canCreate
                createButtonProps={{ onClick: createShow }}
                title="Danh mục"
            >
                <Form {...formProps}>
                    <Table
                        {...tableProps}
                        expandable={{
                            expandedRowRender: !breakpoint.xs
                                ? expandedRowRender
                                : undefined,
                        }}
                        rowKey="id"
                        onRow={(record) => ({
                            // eslint-disable-next-line
                            onClick: (event: any) => {
                                if (event.target.nodeName === "TD") {
                                    setEditId && setEditId(record._id);
                                }
                            },
                        })}
                    >
                        <Table.Column<ICategory>
                            dataIndex="images"
                            align="center"
                            render={(value, data) => {
                                if (isEditing(data._id)) {
                                    setFileList(value);
                                    return (
                                        <Form.Item noStyle>
                                            <Form.Item
                                                name="images"
                                                valuePropName="fileList"
                                                getValueFromEvent={
                                                    getValueFromEvent
                                                }
                                                noStyle
                                            >
                                                <Upload
                                                    name="file"
                                                    onRemove={(file) => {
                                                        const index =
                                                            fileList.indexOf(
                                                                file
                                                            );
                                                        const newFileList =
                                                            fileList.slice();
                                                        newFileList.splice(
                                                            index,
                                                            1
                                                        );
                                                        setFileList(
                                                            newFileList
                                                        );
                                                    }}
                                                    customRequest={async ({
                                                        data,
                                                        filename,
                                                        file,
                                                        onSuccess,
                                                        onError,
                                                    }) => {
                                                        const formData =
                                                            new FormData();

                                                        if (data) {
                                                            Object.keys(
                                                                data
                                                            ).forEach((key) => {
                                                                formData.append(
                                                                    key,
                                                                    data[
                                                                        key
                                                                    ] as any
                                                                );
                                                            });
                                                        }
                                                        formData.append(
                                                            filename as string,
                                                            file
                                                        );

                                                        formData.append(
                                                            "upload_preset",
                                                            process.env
                                                                .REACT_APP_UPLOAD_ASSETS_NAME as string
                                                        );

                                                        try {
                                                            const { data } =
                                                                await uploadInstance.post<IUploadImage>(
                                                                    "",
                                                                    formData
                                                                );
                                                            onSuccess?.(
                                                                data,
                                                                file as any
                                                            );

                                                            if (data) {
                                                                setFileList(
                                                                    () => [
                                                                        {
                                                                            name: data?.original_filename,
                                                                            uid: data?.version_id,
                                                                            url: data?.secure_url,
                                                                        },
                                                                    ]
                                                                );

                                                                message.success(
                                                                    "Upload successfully."
                                                                );
                                                            }
                                                        } catch (error) {
                                                            onError?.(
                                                                error as any
                                                            );
                                                            message.error(
                                                                "Upload failed."
                                                            );
                                                        }

                                                        return {
                                                            abort() {
                                                                console.log(
                                                                    "upload progress is aborted."
                                                                );
                                                            },
                                                        };
                                                    }}
                                                    defaultFileList={value}
                                                    listType="picture"
                                                    className="upload-list-inline"
                                                    accept="image/png, image/jpeg"
                                                >
                                                    <Button
                                                        icon={
                                                            <UploadOutlined />
                                                        }
                                                    >
                                                        Select File (Max: 1)
                                                    </Button>
                                                </Upload>
                                            </Form.Item>
                                        </Form.Item>
                                    );
                                }

                                return (
                                    <Avatar
                                        size={74}
                                        src={
                                            value[0]?.url ||
                                            "/images/product-default-img.png"
                                        }
                                    />
                                );
                            }}
                            width="15%"
                        />

                        <Table.Column<ICategory>
                            dataIndex="name"
                            title="Tên danh mục"
                            render={(value, data) => {
                                if (isEditing(data._id)) {
                                    return (
                                        <Form.Item
                                            name="name"
                                            style={{ margin: 0 }}
                                        >
                                            <Input />
                                        </Form.Item>
                                    );
                                }
                                return <TextField value={value} />;
                            }}
                        />
                        <Table.Column<ICategory>
                            key="isActive"
                            dataIndex="isActive"
                            title="Trạng thái"
                            render={(value, data) => {
                                if (isEditing(data._id)) {
                                    return (
                                        <Form.Item
                                            name="isActive"
                                            style={{ margin: 0 }}
                                            valuePropName="checked"
                                        >
                                            <Checkbox />
                                        </Form.Item>
                                    );
                                }
                                return <BooleanField value={value} />;
                            }}
                        />

                        <Table.Column<ICategory>
                            title="Chỉnh sửa"
                            align="center"
                            render={(_text, record) => {
                                if (isEditing(record._id)) {
                                    return (
                                        <Space>
                                            <SaveButton
                                                {...saveButtonProps}
                                                size="small"
                                            />
                                            <Button
                                                {...cancelButtonProps}
                                                size="small"
                                            >
                                                Thoát
                                            </Button>
                                        </Space>
                                    );
                                }
                                return (
                                    <Dropdown
                                        overlay={moreMenu(record)}
                                        trigger={["click"]}
                                    >
                                        <MoreOutlined
                                            onClick={(e) => e.stopPropagation()}
                                            style={{
                                                fontSize: 24,
                                            }}
                                        />
                                    </Dropdown>
                                );
                            }}
                        />
                    </Table>
                </Form>
            </List>
            <CategoryCreate
                formLoading={createFormLoading}
                drawerProps={createDrawerProps}
                formProps={createFormProps}
                saveButtonProps={createSaveButtonProps}
            />
        </>
    );
};

const CategoryProductsTable: React.FC<{ record: ICategory }> = ({ record }) => {
    const { tableProps: postTableProps } = useTable<IProduct>({
        resource: RESOURCES.products,
        permanentFilter: [
            {
                field: "categoryId",
                operator: "eq",
                value: record._id,
            },
        ],
        syncWithLocation: false,
    });

    const {
        drawerProps: createDrawerProps,
        formProps: createFormProps,
        saveButtonProps: createSaveButtonProps,
        show: createShow,
    } = useDrawerForm<IProduct>({
        action: "create",
        resource: RESOURCES.categories,
        redirect: false,
    });

    const {
        drawerProps: editDrawerProps,
        formProps: editFormProps,
        saveButtonProps: editSaveButtonProps,
        show: editShow,
    } = useDrawerForm<IProduct>({
        action: "edit",
        resource: RESOURCES.products,
        redirect: false,
    });

    const moreMenu = (record: IProduct) => (
        <Menu
            mode="vertical"
            onClick={({ domEvent }) => domEvent.stopPropagation()}
        >
            <Menu.Item
                key="edit"
                style={{
                    fontSize: 15,
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 500,
                }}
                icon={
                    <FormOutlined
                        style={{
                            color: "#52c41a",
                            fontSize: 17,
                            fontWeight: 500,
                        }}
                    />
                }
                onClick={() => editShow(record._id)}
            >
                Chỉnh sửa
            </Menu.Item>
        </Menu>
    );

    return (
        <List title="Products" createButtonProps={undefined}>
            <Table {...postTableProps} rowKey="id">
                <Table.Column
                    dataIndex="images"
                    render={(value) => <Avatar size={74} src={value[0].url} />}
                    width={105}
                />
                <Table.Column key="name" dataIndex="name" title="Tên" />
                <Table.Column
                    align="right"
                    key="price"
                    dataIndex="price"
                    title="Giá"
                    render={(value) => {
                        return (
                            <NumberField
                                options={{
                                    currency: "VND",
                                    style: "currency",
                                    notation: "compact",
                                }}
                                value={value}
                            />
                        );
                    }}
                    sorter
                />
                <Table.Column
                    key="isActive"
                    dataIndex="isActive"
                    title="Trạng thái"
                    render={(value) => <BooleanField value={value} />}
                />
                <Table.Column
                    key="createdAt"
                    dataIndex="createdAt"
                    title="Thời gian tạo"
                    render={(value) => <DateField value={value} format="LLL" />}
                    sorter
                />
                <Table.Column<IProduct>
                    dataIndex="products_actions"
                    title="Thao tác"
                    render={(_, record) => (
                        <Dropdown
                            overlay={moreMenu(record)}
                            trigger={["click"]}
                        >
                            <MoreOutlined
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    fontSize: 24,
                                }}
                            />
                        </Dropdown>
                    )}
                />
            </Table>
            <EditProduct
                drawerProps={editDrawerProps}
                formProps={editFormProps}
                saveButtonProps={editSaveButtonProps}
            />
        </List>
    );
};

const expandedRowRender = (record: ICategory) => {
    return <CategoryProductsTable record={record} />;
};
