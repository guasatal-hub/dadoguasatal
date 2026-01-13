import { View, StyleSheet, Text } from "react-native";
import { useEffect, useRef, useState } from "react";
import { GLView } from "expo-gl";
import * as THREE from "three";
import { Renderer } from "expo-three";
import { useAccelerometer } from "@/lib/modules/sensors/accelerometer/useAccelerometer";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";

export default function Dice3DScreen() {
  const shake = useAccelerometer();
  const cubeRef = useRef<THREE.Mesh | null>(null);
  const [value, setValue] = useState(1);

  // 🔊 Sonido
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    (async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/dice.mp3") // luego te digo cómo crear este archivo
      );
      soundRef.current = sound;
    })();

    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const onContextCreate = async (gl: any) => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#111");

    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      100
    );
    camera.position.z = 4;

    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor("#111");

    // 💡 LUCES (CLAVE)
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    // 🎲 CUBO (DADO)
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const material = new THREE.MeshStandardMaterial({
      color: "#eaeaea",
      roughness: 0.3,
      metalness: 0.1
    });

    const cube = new THREE.Mesh(geometry, material);
    cubeRef.current = cube;
    scene.add(cube);

    const animate = () => {
      requestAnimationFrame(animate);

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    animate();
  };

  // 🎯 REACCIÓN AL SHAKE
  useEffect(() => {
    if (shake && cubeRef.current) {
      // 🔄 Rotación controlada
      cubeRef.current.rotation.x += Math.PI * 2;
      cubeRef.current.rotation.y += Math.PI * 2;

      // 🎲 Valor del dado
      setValue(Math.floor(Math.random() * 6) + 1);

      // 📳 Vibración
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      // 🔊 Sonido
      soundRef.current?.replayAsync();
    }
  }, [shake]);

  return (
    <View style={styles.container}>
      <GLView style={styles.gl} onContextCreate={onContextCreate} />
      <Text style={styles.text}>Resultado: {value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111"
  },
  gl: {
    flex: 1
  },
  text: {
    textAlign: "center",
    fontSize: 26,
    color: "white",
    padding: 16
  }
});
