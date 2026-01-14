import { View, StyleSheet, Animated, Easing } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useAccelerometer } from "@/lib/modules/sensors/accelerometer/useAccelerometer";

// Componente para los puntos del dado
const DiceFace = ({ value }: { value: number }) => {
  const dotPositions: Record<number, any[]> = {
    1: ["center"],
    2: ["top-right", "bottom-left"],
    3: ["top-right", "center", "bottom-left"],
    4: ["top-left", "top-right", "bottom-left", "bottom-right"],
    5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
    6: ["top-left", "top-right", "mid-left", "mid-right", "bottom-left", "bottom-right"],
  };

  return (
    <View style={styles.diceSurface}>
      {dotPositions[value].map((pos, index) => (
        <View key={index} style={[styles.dot, styles[pos as keyof typeof styles]]} />
      ))}
    </View>
  );
};

export default function DiceScreen() {
  const shakeTrigger = useAccelerometer();
  const [value, setValue] = useState(1);
  const [isLanded, setIsLanded] = useState(true); // Controla si el dado está detenido
  
  const rotateX = useRef(new Animated.Value(0)).current;
  const rotateY = useRef(new Animated.Value(0)).current;
  const loopAnim = useRef<Animated.CompositeAnimation | null>(null);

  // Función para el giro infinito (mientras lo "agitas" o esperas)
  const startInfiniteLoop = () => {
    setIsLanded(false);
    rotateX.setValue(0);
    rotateY.setValue(0);

    loopAnim.current = Animated.loop(
      Animated.parallel([
        Animated.timing(rotateX, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(rotateY, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );
    loopAnim.current.start();
  };

  // Función para detener el dado y mostrar resultado
  const landDice = () => {
    if (loopAnim.current) loopAnim.current.stop();

    // Animación final de frenado
    Animated.parallel([
      Animated.spring(rotateX, { toValue: 0, friction: 4, useNativeDriver: true }),
      Animated.spring(rotateY, { toValue: 0, friction: 4, useNativeDriver: true }),
    ]).start(() => {
      setValue(Math.floor(Math.random() * 6) + 1);
      setIsLanded(true);
    });
  };

  useEffect(() => {
    if (shakeTrigger) {
      if (isLanded) {
        startInfiniteLoop(); // Si estaba quieto, empieza a girar
      } else {
        landDice(); // Si estaba girando, lánzalo
      }
    }
  }, [shakeTrigger]);

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
          { transform: [{ perspective: 1000 }, { rotateX: spinX }, { rotateY: spinY }] }
        ]}
      >
        <DiceFace value={value} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a1a", justifyContent: "center", alignItems: "center" },
  dice: {
    width: 130,
    height: 130,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    elevation: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    borderBottomWidth: 5,
    borderRightWidth: 3,
    borderColor: "#ddd",
  },
  diceSurface: { flex: 1, position: 'relative' },
  dot: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#222",
  },
  // Posiciones de los puntos
  center: { top: '50%', left: '50%', marginTop: -11, marginLeft: -11 },
  "top-left": { top: 0, left: 0 },
  "top-right": { top: 0, right: 0 },
  "mid-left": { top: '50%', left: 0, marginTop: -11 },
  "mid-right": { top: '50%', right: 0, marginTop: -11 },
  "bottom-left": { bottom: 0, left: 0 },
  "bottom-right": { bottom: 0, right: 0 },
});