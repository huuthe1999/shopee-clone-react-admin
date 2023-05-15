import { BaseKey } from "@refinedev/core";

import { NumberField } from "@refinedev/antd";

import { FormOutlined, MoreOutlined } from "@ant-design/icons";
import { Avatar, Card, Divider, Dropdown, Menu, Typography } from "antd";

import { IProduct } from "interfaces";

const { Text, Paragraph } = Typography;

type ProductItemProps = {
    item: IProduct;
    editShow: (id?: BaseKey) => void;
};

export const ProductItem: React.FC<ProductItemProps> = ({ item, editShow }) => {
    return (
        <Card
            style={{
                margin: "8px",
                opacity: item.quantity <= 0 ? 0.5 : 1,
            }}
            bodyStyle={{ height: "500px" }}
        >
            <div style={{ position: "absolute", top: "10px", right: "5px" }}>
                <Dropdown
                    overlay={
                        <Menu mode="vertical">
                            <Menu.Item
                                key="2"
                                style={{
                                    fontWeight: 500,
                                }}
                                icon={
                                    <FormOutlined
                                        style={{
                                            color: "green",
                                        }}
                                    />
                                }
                                onClick={() => editShow(item._id)}
                            >
                                Chỉnh sửa
                            </Menu.Item>
                        </Menu>
                    }
                    trigger={["click"]}
                >
                    <MoreOutlined
                        style={{
                            fontSize: 24,
                        }}
                    />
                </Dropdown>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <Avatar
                        size={128}
                        src={item.images[0].url || "/product-default-img.png"}
                        alt={item.name}
                    />
                </div>
                <Divider />
                <Paragraph
                    ellipsis={{ rows: 2, tooltip: true }}
                    style={{
                        fontSize: "18px",
                        fontWeight: 800,
                        marginBottom: "8px",
                    }}
                >
                    {item.name}
                </Paragraph>
                <Paragraph
                    ellipsis={{ rows: 3, tooltip: true }}
                    style={{ marginBottom: "8px" }}
                >
                    {item.description}
                </Paragraph>
                <Text
                    className="item-id"
                    style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "#999999",
                    }}
                >
                    #{item._id}
                </Text>
                <NumberField
                    style={{
                        fontSize: "24px",
                        fontWeight: 500,
                        marginBottom: "8px",
                    }}
                    options={{
                        currency: "VND",
                        style: "currency",
                    }}
                    value={item.price}
                />
            </div>
        </Card>
    );
};
