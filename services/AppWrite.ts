import { Client } from "react-native-appwrite";
import StorageAppWrite from "./StorageAppWrite";

/**
 * The ```AppWrite``` class provides methods to interact with the Appwrite platform,
 * including simplified access to Appwrite Storage services,database Services, etc..
 */
class AppWrite {
  private static _client: Client;

  /**
   * Provides an instance of the ```StorageAppWrite``` class,
   * which offers simplified methods to interact with the ```Appwrite Storage service```.
   * @returns {StorageAppWrite} An instance of the StorageAppWrite class.
   */
  static Storage(): StorageAppWrite {
    return new StorageAppWrite(this.getClient);
  }

  /**
   * Retrieves the Appwrite client instance. If it doesn't exist, a new instance is created.
   * @returns {Client} The Appwrite client instance.
   */
  static get getClient(): Client {
    return AppWrite.createNewInstance();
  }

  /**
   * Creates a new instance of the Appwrite Client if one doesn't already exist.
   * @private
   * @returns {Client} The Appwrite client instance.
   */
  private static createNewInstance(): Client {
    if (!AppWrite._client) {
      AppWrite._client = new Client();
      AppWrite._client
        .setEndpoint("https://cloud.appwrite.io/v1")
        .setProject(process.env.EXPO_PUBLIC_PROJECT_ID)
        .setPlatform("com.jehlicot.appvigilancia");
    }
    return AppWrite._client;
  }
}

export default AppWrite;
