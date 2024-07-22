import ContextProvider from "@/context/ContextProvider";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-url-polyfill/auto";

const _layout = () => {
  return (
    <ContextProvider>
      <GestureHandlerRootView>
        <SQLiteProvider databaseName="vigilance.db">
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </SQLiteProvider>
      </GestureHandlerRootView>
    </ContextProvider>
  );
};

export default _layout;
