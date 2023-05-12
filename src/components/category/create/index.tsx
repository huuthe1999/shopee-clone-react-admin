import { Create, useSelect } from "@refinedev/antd";
import {
    ButtonProps,
    DatePicker,
    Drawer,
    DrawerProps,
    Form,
    FormProps,
    Grid,
    Input,
    Select,
} from "antd";
import dayjs from "dayjs";
import React from "react";

type CreateCategoryProps = {
    formLoading: boolean;
    drawerProps: DrawerProps;
    formProps: FormProps;
    saveButtonProps: ButtonProps;
};

export const CategoryCreate: React.FC<CreateCategoryProps> = ({
    formLoading,
    drawerProps,
    formProps,
    saveButtonProps,
}) => {
    const breakpoint = Grid.useBreakpoint();

    const { selectProps: categorySelectProps } = useSelect({
        resource: "categories",
    });

    return (
        <Drawer
            {...drawerProps}
            width={breakpoint.sm ? "500px" : "100%"}
            zIndex={1001}
        >
            <Create
                saveButtonProps={{
                    ...saveButtonProps,
                    loading: formLoading,
                    disabled: formLoading,
                }}
                goBack={false}
            >
                <Form {...formProps} layout="vertical">
                    <Form.Item
                        label="Title"
                        name={["title"]}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Content"
                        name="content"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input.TextArea rows={5} />
                    </Form.Item>
                    <Form.Item
                        label="Category"
                        name={["category", "id"]}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select {...categorySelectProps} />
                    </Form.Item>
                    <Form.Item
                        label="Status"
                        name={["status"]}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Created At"
                        name={["createdAt"]}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        getValueProps={(value) => ({
                            value: value ? dayjs(value) : undefined,
                        })}
                    >
                        <DatePicker />
                    </Form.Item>
                </Form>
            </Create>
        </Drawer>
    );
};
