import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { RESOURCES } from "@constants";
import { Edit, getValueFromEvent } from "@refinedev/antd";
import { BaseKey } from "@refinedev/core";
import {
    Avatar,
    Button,
    ButtonProps,
    Drawer,
    DrawerProps,
    Form,
    FormProps,
    Grid,
    Input,
    Radio,
    Space,
    Typography,
    Upload,
    message,
} from "antd";
import { uploadInstance } from "config";
import { ICategory, IUploadImage } from "interfaces";
import React from "react";

const { Text } = Typography;
type EditCategoryProps = {
    drawerProps: DrawerProps;
    formProps: FormProps;
    saveButtonProps: ButtonProps;
    editId?: BaseKey;
};

export const CategoryEdit: React.FC<EditCategoryProps> = ({
    editId,
    drawerProps,
    formProps,
    saveButtonProps,
}) => {
    const breakpoint = Grid.useBreakpoint();

    const handleOnFinish = (values: ICategory) => {
        formProps.onFinish?.({
            ...values,
            images: values.images.map(({ response, name, uid, ...rest }) => {
                if (response) {
                    return {
                        name,
                        url: response?.secure_url,
                        uid,
                    };
                }
                return {
                    ...rest,
                    name,
                    uid,
                };
            }),
        });
    };

    return (
        <Drawer
            {...drawerProps}
            width={breakpoint.sm ? "500px" : "100%"}
            zIndex={1001}
        >
            <Edit
                resource={RESOURCES.categories}
                saveButtonProps={saveButtonProps}
                canDelete={false}
                title="Sửa danh mục"
                goBack={false}
                recordItemId={editId}
            >
                <Form
                    {...formProps}
                    onFinish={handleOnFinish}
                    layout="vertical"
                >
                    <Form.Item
                        label="Tên danh mục"
                        name={["name"]}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng điền tên danh mục",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Hình ảnh">
                        <Form.Item
                            name="images"
                            valuePropName="fileList"
                            getValueFromEvent={getValueFromEvent}
                            noStyle
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
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
                                    const formData = new FormData();

                                    if (data) {
                                        Object.keys(data).forEach((key) => {
                                            formData.append(
                                                key,
                                                data[key] as any
                                            );
                                        });
                                    }
                                    formData.append(filename as string, file);

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

                                        onSuccess?.(data, file as any);

                                        if (data) {
                                            message.success(
                                                "Upload successfully."
                                            );
                                        }
                                    } catch (error) {
                                        onError?.(error as any);
                                        message.error("Upload failed.");
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
                                listType="picture"
                                className="upload-list-inline"
                                accept="image/png, image/jpeg"
                            >
                                <Space direction="vertical" size={2}>
                                    <Avatar
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            maxWidth: "256px",
                                        }}
                                        src="/images/product-default-img.png"
                                        alt="Store Location"
                                    />
                                    <Text
                                        style={{
                                            fontWeight: 800,
                                            fontSize: "16px",
                                            marginTop: "8px",
                                        }}
                                    >
                                        Tải hình ảnh
                                    </Text>
                                </Space>
                            </Upload.Dragger>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="Danh mục con">
                        <Form.List name="subCategories">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(
                                        ({ key, name, ...restField }) => (
                                            <Space
                                                key={key}
                                                style={{
                                                    display: "flex",
                                                    marginBottom: 8,
                                                }}
                                                align="baseline"
                                            >
                                                <Form.Item
                                                    {...restField}
                                                    style={{}}
                                                    name={[name, "name"]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng điền tên",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="Tên danh mục con" />
                                                </Form.Item>
                                                <MinusCircleOutlined
                                                    onClick={() => remove(name)}
                                                />
                                            </Space>
                                        )
                                    )}
                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            block
                                            icon={<PlusOutlined />}
                                        >
                                            Add field
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Form.Item>

                    {/* <Form.Item
                        label="Category"
                        name={["category", "id"]}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select {...categorySelectProps} />
                    </Form.Item> */}
                    <Form.Item label="Trạng thái" name="isActive">
                        <Radio.Group>
                            <Radio value={true}>Hiện</Radio>
                            <Radio value={false}>Ẩn</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Edit>
        </Drawer>
    );
};
