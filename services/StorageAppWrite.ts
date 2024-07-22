import { FileAppWrite } from "@/types";
import { Client, ID, Storage } from "react-native-appwrite";

class StorageAppWrite {
  private static _storage: Storage;
  private _bucketId = process.env.EXPO_PUBLIC_BUCKET_ID; //  this is the appWrite bucket id

  constructor(client: Client) {
    if (!StorageAppWrite._storage) StorageAppWrite._storage = new Storage(client);
  }

  /**
   * This function uploads a file (e.g., image, audio) to the remote storage in Appwrite and returns the file's URL.
   *
   * @param {File} file - The file to be uploaded to remote storage.
   * @returns {Promise<string>} A promise that resolves to the URL of the uploaded file.
   */
  async uploadFile(file: FileAppWrite): Promise<string | undefined> {
    try {
      const FilePromise = await StorageAppWrite._storage?.createFile(
        this._bucketId,
        ID.unique(),
        file
      );
      const fileUrl = StorageAppWrite._storage?.getFilePreview(
        this._bucketId,
        FilePromise?.$id ?? ""
      );
      return fileUrl?.toString();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async getFileCustom() {
    try {
      const audioUrl = StorageAppWrite._storage
        .getFileDownload(process.env.EXPO_PUBLIC_BUCKET_ID ?? "", "669ec73e000e0ea3ed00")
        .toString();

      return audioUrl;
    } catch (err: any) {
      console.log(err);
    }
  }
}

export default StorageAppWrite;
