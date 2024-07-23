import { FileAppWrite } from "@/types";
import { Client, ID, Storage } from "react-native-appwrite";

class StorageAppWrite {
  private static _storage: Storage;

  constructor(client: Client) {
    if (!StorageAppWrite._storage)
      StorageAppWrite._storage = new Storage(client);
  }

  /**
   * This function uploads a file (e.g., image, audio) to the remote storage in Appwrite and returns the file's URL.
   *
   * @param {File} file - The file to be uploaded to remote storage.
   * @returns {Promise<{url: string, id: string} | undefined>} A promise that resolves to the URL of the uploaded file and it's id or undefined.
   */
  async uploadFile(
    file: FileAppWrite
  ): Promise<{ url: string; id: string } | undefined> {
    try {
      const fileId = ID.unique();
      const FilePromise = await StorageAppWrite._storage?.createFile(
        process.env.EXPO_PUBLIC_BUCKET_ID,
        fileId,
        file
      );
      const fileUrl = StorageAppWrite._storage?.getFilePreview(
        process.env.EXPO_PUBLIC_BUCKET_ID,
        FilePromise?.$id ?? ""
      );
      return { url: fileUrl?.toString(), id: FilePromise?.$id };
    } catch (err: any) {
      alert(err.message);
    }
  }

  async getFileById(fileId: string) {
    try {
      const audioUrl = StorageAppWrite._storage
        .getFileDownload(process.env.EXPO_PUBLIC_BUCKET_ID ?? "", fileId)
        .toString();

      return audioUrl;
    } catch (err: any) {
      console.log(err);
    }
  }
}

export default StorageAppWrite;
