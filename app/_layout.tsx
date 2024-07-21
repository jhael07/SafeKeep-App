import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const _layout = () => {
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