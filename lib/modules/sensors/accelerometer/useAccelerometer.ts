import { useEffect, useRef, useState } from "react";
import { SensorService } from "./accelerometer.service";
import { isShaking } from "@/lib/core/logic/motion";

export const useAccelerometer = () => {
  const [trigger, setTrigger] = useState(false);
  const cooldownRef = useRef(false);

  useEffect(() => {
    const subscription = SensorService.subscribe((data) => {
      if (!cooldownRef.current && isShaking(data)) {
        cooldownRef.current = true;
        setTrigger(true);

        // Cooldown de 1.2 segundos
        setTimeout(() => {
          cooldownRef.current = false;
          setTrigger(false);
        }, 1200);
      }
    });

    return () => {
      SensorService.unsubscribe(subscription);
    };
  }, []);

  return trigger;
};
