import { Editor } from "@tinymce/tinymce-react";
import axios, { AxiosResponse } from "axios";
import { getImageDimension } from "./libs/image";
import React from "react";
import { FilesApi, GetFilesUploadResDto } from "@/api";

enum PostFilesUploadReqDtoKindEnum {
  "Users" = "users",
  "Stores" = "stores",
  "Posts" = "posts",
  "Products" = "products",
  "Etc" = "etc",
}

interface HtmlEditorProps {
  kind?: PostFilesUploadReqDtoKindEnum;
  height?: number;
  disabled?: boolean;
  onChange?: Function;
  menubar?: boolean;
  toolbar?: boolean;
  value?: string;
}

// const filesApi = new FilesApi();

interface BlobInfo {
  id: () => string;
  name: () => string;
  filename: () => string;
  blob: () => Blob;
  base64: () => string;
  blobUri: () => string;
  uri: () => string | undefined;
}
type ProgressFn = (percent: number) => void;

type fields = Record<any, string>;

export default function HtmlEditor(props: HtmlEditorProps) {
  const {
    height = 500,
    disabled = false,
    kind = "etc",
    menubar = true,
    toolbar = true,
    onChange,
    value,
  } = props;

  async function imageUpload(blobInfo: BlobInfo, progress: ProgressFn) {
    try {
      const file = new File([blobInfo.blob()], "image editor");
      const imageDimension = await getImageDimension(file as File);
      const res: AxiosResponse<GetFilesUploadResDto> =
        await filesApi.filesControllerGetUpload({
          type: "image",
          mimeType: file.type,
          width: imageDimension.width,
          height: imageDimension.height,
        });

      const fields: fields = res.data.fields as unknown as fields;

      const formData = new FormData();
      for (const key in fields) {
        formData.append(key, fields[key]);
      }
      formData.append("file", file as File);
      await axios.post(res.data.url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress(progressEvent) {
          const percentCompleted = Math.round(progressEvent.loaded * 100);
          progress(percentCompleted);
        },
      });
      const uploadedData = await filesApi.filesControllerPostUpload({
        postFilesUploadReqDto: { type: "image", path: res.data.path, kind },
      });
      return uploadedData.data.url;
    } catch (e) {
      throw e;
    }
  }

  return (
    <Editor
      onEditorChange={(value) => {
        if (onChange) onChange(value);
      }}
      value={value}
      disabled={disabled}
      tinymceScriptSrc={import.meta.env.BASE_URL + "/js/tinymce/tinymce.min.js"}
      init={{
        height,
        menubar,
        promotion: false,
        file_picker_types: "image",
        images_upload_handler: imageUpload,
        plugins: [
          "preview",
          "importcss",
          "searchreplace",
          "autolink",
          "directionality",
          "code",
          "visualblocks",
          "visualchars",
          "fullscreen",
          "image",
          "link",
          "template",
          "table",
          "charmap",
          "pagebreak",
          "nonbreaking",
          "insertdatetime",
          "advlist",
          "lists",
          "wordcount",
          "help",
          "charmap",
          "quickbars",
          "emoticons",
        ],
        toolbar: toolbar
          ? "undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | " +
            "alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | " +
            "forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview print | " +
            "image template link | ltr rt"
          : false,
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:12px }",
      }}
    />
  );
}
