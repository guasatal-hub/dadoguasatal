import { Accelerometer } from "expo-sensors";
import { Platform } from "react-native";
import { UPDATE_INTERVAL } from "@/lib/core/constants";

export const SensorService = {
  subscribe(callback: (data: any) => void) {
    if (Platform.OS === "web") {
      console.warn("Accelerometer no soportado en Web");
      return null;
    }

    Accelerometer.setUpdateInterval(UPDATE_INTERVAL);
    return Accelerometer.addListener(callback);
  },

  unsubscribe(subscription: any) {
    if (subscription) subscription.remove();
  }
};
