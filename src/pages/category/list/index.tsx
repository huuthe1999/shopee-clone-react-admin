import { FormOutlined, MoreOutlined, UploadOutlined } from "@ant-design/icons";
import { RESOURCES } from "@constants";
import {
    BooleanField,
    DateField,
    List,
    NumberField,
    SaveButton,
    TextField,
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
    UploadProps,
    message,
} from "antd";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
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
    const [uploading, setUploading] = useState(false);
    const [disableUpload, setDisableUpload] = useState(true);

    const handleUpload = async () => {
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append("file", file as RcFile);
            formData.append(
                "upload_preset",
                process.env.REACT_APP_UPLOAD_ASSETS_NAME as string
            );
        });

        try {
            setUploading(true);
            const {
                data: { original_filename, version_id, secure_url },
            } = await uploadInstance.post<IUploadImage>("", formData);
            setFileList(() => [
                {
                    name: original_filename,
                    uid: version_id,
                    url: secure_url,
                },
            ]);
            setDisableUpload(true);
            message.success("Upload successfully.");
        } catch (error) {
            message.error("Upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const normFile = (e: any) => {
        console.log("Upload event:", e);
        if (Array.isArray(e)) {
            return e;
        }
        return fileList;
        // return e?.fileList;
    };

    const props: UploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setDisableUpload(true);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList(() => [file]);
            setDisableUpload(false);
            return false;
        },
        name: "file",
        fileList,
        listType: "picture",
        className: "upload-list-inline",
        accept: "image/png, image/jpeg",
    };

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

    return (
        <List>
            <Form {...formProps}>
                <Table
                    {...tableProps}
                    expandable={{
                        expandedRowRender: !breakpoint.xs
                            ? expandedRowRender
                            : undefined,
                    }}
                    rowKey={(record) => record._id}
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
                                return (
                                    <Form.Item noStyle>
                                        <Form.Item
                                            name="images"
                                            valuePropName="fileList"
                                            getValueFromEvent={normFile}
                                            noStyle
                                        >
                                            <Space
                                                direction="horizontal"
                                                size={8}
                                            >
                                                <Avatar
                                                    size={74}
                                                    src={
                                                        fileList[0]?.url ||
                                                        "/images/product-default-img.png"
                                                    }
                                                    alt="Image Category"
                                                />
                                                <Space direction="vertical">
                                                    <Upload {...props}>
                                                        <Button
                                                            icon={
                                                                <UploadOutlined />
                                                            }
                                                        >
                                                            Select File (Max: 1)
                                                        </Button>
                                                    </Upload>
                                                    <Button
                                                        type="primary"
                                                        onClick={handleUpload}
                                                        disabled={disableUpload}
                                                        loading={uploading}
                                                        style={{
                                                            marginTop: 12,
                                                        }}
                                                    >
                                                        {uploading
                                                            ? "Uploading"
                                                            : "Start Upload"}
                                                    </Button>
                                                </Space>
                                            </Space>
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
