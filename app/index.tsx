import { View, StyleSheet, Text, Animated } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useAccelerometer } from "@/lib/modules/sensors/accelerometer/useAccelerometer";

export default function DiceScreen() {
  const shake = useAccelerometer();
  const rotateX = useRef(new Animated.Value(0)).current;
  const rotateY = useRef(new Animated.Value(0)).current;
  const [value, setValue] = useState(1);

  useEffect(() => {
    if (shake) {
      Animated.parallel([
        Animated.timing(rotateX, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true
        }),
        Animated.timing(rotateY, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true
        })
      ]).start(() => {
        rotateX.setValue(0);
        rotateY.setValue(0);
        setValue(Math.floor(Math.random() * 6) + 1);
      });
    }
  }, [shake]);

  const spinX = rotateX.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"]
  });

  const spinY = rotateY.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"]
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.dice,
          {
            transform: [
              { perspective: 800 },
              { rotateX: spinX },
              { rotateY: spinY }
            ]
          }
        ]}
      >
        <Text style={styles.number}>{value}</Text>
      </Animated.View>

      <Text style={styles.label}>Agita el celular 🎲</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center"
  },
  dice: {
    width: 120,
    height: 120,
    backgroundColor: "#eaeaea",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12
  },
  number: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#111"
  },
  label: {
    marginTop: 20,
    color: "white",
    fontSize: 16
  }
});
