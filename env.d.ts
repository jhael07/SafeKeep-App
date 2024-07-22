declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_PROJECT_ID: string;
      EXPO_PUBLIC_BUCKET_ID: string;
    }
  }
}

export {};
