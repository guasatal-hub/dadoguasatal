import { Accelerometer } from "expo-sensors";
import { UPDATE_INTERVAL } from "@/lib/core/constants";

export const SensorService = {
  subscribe(callback: (data: any) => void) {
    Accelerometer.setUpdateInterval(UPDATE_INTERVAL);
    return Accelerometer.addListener(callback);
  },

  unsubscribe(subscription: any) {
    if (subscription) subscription.remove();
  }
};
