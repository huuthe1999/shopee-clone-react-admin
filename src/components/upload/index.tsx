import { UploadOutlined } from "@ant-design/icons";
import { Avatar, Button, message, Space, Upload } from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { uploadInstance } from "config";
import { IFile, IUploadImage } from "interfaces";
import React, { useState } from "react";

export const UploadImage: React.FC<{ images: IFile[] }> = ({ images }) => {
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
            setFileList([
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
        defaultFileList: [...images],
        fileList,
        listType: "picture",
        className: "upload-list-inline",
        accept: "image/png, image/jpeg",
    };

    return (
        <Space direction="horizontal" size={8}>
            <Avatar
                size={74}
                src={fileList[0]?.url || "/images/product-default-img.png"}
                alt="Image Category"
            />
            <Space direction="vertical">
                <Upload {...props}>
                    <Button icon={<UploadOutlined />}>
                        Select File (Max: 1)
                    </Button>
                </Upload>
                <Button
                    type="primary"
                    onClick={handleUpload}
                    disabled={disableUpload}
                    loading={uploading}
                    style={{ marginTop: 12 }}
                >
                    {uploading ? "Uploading" : "Start Upload"}
                </Button>
            </Space>
        </Space>
    );
};
