export interface IFile {
    name: string;
    percent?: number;
    size?: number;
    status?: "error" | "success" | "done" | "uploading" | "removed";
    type?: string;
    uid: string;
    url: string;
    response: IUploadImage;
}

export interface IUploadImage {
    original_filename: string;
    secure_url: string;
    version_id: string;
}
