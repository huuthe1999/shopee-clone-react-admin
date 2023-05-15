import { Create, getValueFromEvent, useSelect } from "@refinedev/antd";

import {
    Avatar,
    ButtonProps,
    Drawer,
    DrawerProps,
    Form,
    FormProps,
    Grid,
    Input,
    InputNumber,
    Radio,
    Select,
    Space,
    Typography,
    Upload,
    message,
} from "antd";

import { RESOURCES } from "@constants";
import { useWatch } from "antd/es/form/Form";
import { uploadInstance } from "config";
import { ICategory, IProvince } from "interfaces";
import { useEffect, useState } from "react";

const { Text } = Typography;

type CreateProductProps = {
    drawerProps: DrawerProps;
    formProps: FormProps;
    saveButtonProps: ButtonProps;
};

export const CreateProduct: React.FC<CreateProductProps> = ({
    drawerProps,
    formProps,
    saveButtonProps,
}) => {
    const breakpoint = Grid.useBreakpoint();
    const [subCategoriesOptions, setSubCategoriesOptions] = useState<
        { label: string; value: string }[]
    >([]);

    const {
        selectProps: categorySelectProps,
        queryResult: categoryQueryResult,
    } = useSelect<ICategory>({
        resource: RESOURCES.categories,
        optionLabel: "name",
        optionValue: "_id",
        queryOptions: {
            enabled: drawerProps.open,
        },
    });
    const { selectProps: provincesSelectProps } = useSelect<IProvince>({
        resource: RESOURCES.provinces,
        optionLabel: "name",
        optionValue: "idProvince",
        queryOptions: {
            staleTime: Infinity,
            enabled: drawerProps.open,
        },
    });

    const category = useWatch("category", formProps.form);

    useEffect(() => {
        if (category) {
            categoryQueryResult.data?.data.forEach(({ subCategories, _id }) => {
                if (category === _id) {
                    setSubCategoriesOptions(
                        subCategories.map((subCate) => {
                            return {
                                label: subCate.name,
                                value: subCate._id,
                            };
                        })
                    );
                    return;
                }
            });
        }
    }, [category]);

    return (
        <Drawer
            {...drawerProps}
            width={breakpoint.sm ? "500px" : "100%"}
            zIndex={1001}
        >
            <Create
                resource={RESOURCES.products}
                saveButtonProps={saveButtonProps}
                title="Tạo sản phẩm"
                goBack={false}
                contentProps={{
                    style: {
                        boxShadow: "none",
                    },
                    bodyStyle: {
                        padding: 0,
                    },
                }}
            >
                <Form
                    {...formProps}
                    layout="vertical"
                    initialValues={{
                        isActive: true,
                        discount: 0,
                    }}
                >
                    <Form.Item label="Hình ảnh">
                        <Form.Item
                            name="images"
                            valuePropName="fileList"
                            getValueFromEvent={getValueFromEvent}
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
                                            await uploadInstance.post(
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
                    <Form.Item
                        label="Tên sản phẩm"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng điền tên sản phẩm",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea rows={6} />
                    </Form.Item>
                    <Form.Item
                        label="Giá"
                        name="price"
                        rules={[
                            {
                                required: true,
                                type: "number",
                                message: "Vui lòng nhập giá hợp lệ",
                            },
                        ]}
                    >
                        <InputNumber
                            formatter={(value) => `₫ ${value}`}
                            style={{ width: "150px" }}
                        />
                    </Form.Item>
                    <Form.Item label="Discount" name="discount">
                        <InputNumber
                            formatter={(value) => `% ${value}`}
                            style={{ width: "150px" }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Nơi bán"
                        name={["province"]}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn nơi bán",
                            },
                        ]}
                    >
                        <Select {...provincesSelectProps} showSearch={false} />
                    </Form.Item>
                    <Form.Item
                        label="Danh mục"
                        name={["category"]}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn danh mục",
                            },
                        ]}
                    >
                        <Select {...categorySelectProps} showSearch={false} />
                    </Form.Item>
                    <Form.Item
                        label="Danh mục con"
                        name={["subCategory"]}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn danh mục con",
                            },
                        ]}
                    >
                        <Select
                            options={subCategoriesOptions}
                            disabled={subCategoriesOptions.length === 0}
                            showSearch={false}
                        />
                    </Form.Item>
                    <Form.Item label="Trạng thái" name="isActive">
                        <Radio.Group>
                            <Radio value={true}>Hiện</Radio>
                            <Radio value={false}>Ẩn</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Create>
        </Drawer>
    );
};
