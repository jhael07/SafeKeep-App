import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-url-polyfill/auto";

import { Client } from "react-native-appwrite";

const _layout = () => {
  // Init your React Native SDK
  const client = new Client();

  client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("669caa390022bcbcf8fa");
  // .setPlatform("com.example.myappwriteapp"); // Your application ID or bundle ID.

  return (
    <GestureHandlerRootView>
      <SQLiteProvider databaseName="vigilance.db">
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
};

export default _layout;
