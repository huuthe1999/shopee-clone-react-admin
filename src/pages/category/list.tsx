import { FormOutlined, InboxOutlined, MoreOutlined } from "@ant-design/icons";
import { RESOURCES } from "@constants";
import {
    BooleanField,
    DateField,
    List,
    NumberField,
    SaveButton,
    TextField,
    getDefaultSortOrder,
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
    Typography,
    Upload,
    message,
} from "antd";
import { CategoryCreate, CategoryEdit } from "components/category";
import { EditProduct } from "components/product";
import { uploadInstance } from "config";
import { ICategory, IProduct, IUploadImage } from "interfaces";
import React from "react";
import { encodeId } from "utils";

const { Text } = Typography;

export const CategoryList: React.FC<IResourceComponentsProps> = () => {
    const {
        tableProps,
        formProps,
        sorters,
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

    const {
        drawerProps: editDrawerProps,
        formProps: editFormProps,
        saveButtonProps: editSaveButtonProps,
        show: editShow,
        id: editId,
    } = useDrawerForm<ICategory>({
        action: "edit",
        resource: RESOURCES.categories,
        redirect: false,
    });

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
                    editShow(record._id);
                }}
            >
                Chỉnh sửa chi tiết
            </Menu.Item>
        </Menu>
    );

    const handleOnFinish = (values: any) => {
        formProps.onFinish?.({
            ...values,
            images: values.images.map(({ response, name, uid }: any) => {
                return {
                    name,
                    url: response.secure_url,
                    uid,
                };
            }),
        });
    };

    return (
        <>
            <List
                canCreate
                createButtonProps={{ onClick: createShow }}
                title="Danh mục"
            >
                <Form {...formProps} onFinish={handleOnFinish}>
                    <Table
                        {...tableProps}
                        expandable={{
                            expandedRowRender: !breakpoint.xs
                                ? expandedRowRender
                                : undefined,
                        }}
                        rowKey="id"
                        bordered
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
                            dataIndex="_id"
                            title="ID"
                            render={(value, data) => {
                                return <TextField value={encodeId(value)} />;
                            }}
                            width="10%"
                            align="center"
                        />

                        <Table.Column<ICategory>
                            dataIndex="images"
                            align="center"
                            render={(value, data) => {
                                if (isEditing(data._id)) {
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
                                                <Upload.Dragger
                                                    name="file"
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
                                                    maxCount={1}
                                                    defaultFileList={value}
                                                    listType="picture"
                                                    className="upload-list-inline"
                                                    accept="image/png, image/jpeg"
                                                >
                                                    <Space
                                                        direction="vertical"
                                                        size={8}
                                                    >
                                                        <p className="ant-upload-drag-icon">
                                                            <InboxOutlined />
                                                        </p>
                                                        <Text
                                                            style={{
                                                                fontWeight: 800,
                                                                fontSize:
                                                                    "16px",
                                                                marginTop:
                                                                    "8px",
                                                                padding: 4,
                                                            }}
                                                        >
                                                            Tải ảnh hoặc kéo thả
                                                            (Max: 1)
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                fontSize:
                                                                    "12px",
                                                            }}
                                                        >
                                                            Hỗ trợ png, jpeg
                                                        </Text>
                                                    </Space>
                                                </Upload.Dragger>
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
                            defaultSortOrder={getDefaultSortOrder(
                                "name",
                                sorters
                            )}
                            sorter={{ multiple: 2 }}
                        />

                        <Table.Column<ICategory>
                            key="isActive"
                            dataIndex="isActive"
                            title="Trạng thái"
                            align="center"
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
                            dataIndex="createdAt"
                            title="Ngày tạo"
                            render={(value) => (
                                <DateField
                                    value={value}
                                    locales="vn"
                                    format="DD/MM/YYYY, HH:mm A"
                                />
                            )}
                            defaultSortOrder={getDefaultSortOrder(
                                "createdAt",
                                sorters
                            )}
                            sorter={{ multiple: 1 }}
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
            <CategoryEdit
                editId={editId}
                drawerProps={editDrawerProps}
                formProps={editFormProps}
                saveButtonProps={editSaveButtonProps}
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
