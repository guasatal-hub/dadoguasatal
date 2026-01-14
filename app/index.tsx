import React, { Suspense, useRef, useState, useEffect } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Canvas, useFrame } from '@react-three/fiber/native'
import { useAccelerometer } from "@/lib/modules/sensors/accelerometer/useAccelerometer"

function Dice(props: any) {
  const meshRef = useRef<any>()
  const [isRolling, setIsRolling] = useState(false)
  
  // Lógica de rotación constante (como el código que pasaste)
  useFrame((state, delta) => {
    if (meshRef.current) {
      if (isRolling) {
        // Giro rápido de "lanzamiento"
        meshRef.current.rotation.x += delta * 10
        meshRef.current.rotation.y += delta * 10
      } else {
        // Giro suave de "espera"
        meshRef.current.rotation.x += delta * 0.5
        meshRef.current.rotation.y += delta * 0.5
      }
    }
  })

  // Exponemos la función para lanzar el dado
  useEffect(() => {
    if (props.trigger) {
      setIsRolling(true)
      setTimeout(() => {
        setIsRolling(false)
        // Aquí podrías forzar una posición final según el resultado
        meshRef.current.rotation.set(Math.random(), Math.random(), 0)
        props.onFinish()
      }, 1000)
    }
  }, [props.trigger])

  return (
    <mesh {...props} ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="white" />
    </mesh>
  )
}

export default function DiceScreen() {
  const shakeTrigger = useAccelerometer()
  const [rolling, setRolling] = useState(false)
  const [value, setValue] = useState(1)

  useEffect(() => {
    if (shakeTrigger && !rolling) {
      setRolling(true)
    }
  }, [shakeTrigger])

  return (
    <View style={styles.container}>
      <View style={styles.canvasContainer}>
        <Canvas>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          
          <Suspense fallback={null}>
            <Dice 
              trigger={rolling} 
              onFinish={() => {
                setRolling(false)
                setValue(Math.floor(Math.random() * 6) + 1)
              }} 
            />
          </Suspense>
        </Canvas>
      </View>
      
      <Text style={styles.label}>
        {rolling ? "¡Lanzando!" : `Resultado: ${value}`}
      </Text>
      <Text style={styles.subLabel}>Agita para jugar 🎲</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
  canvasContainer: { width: '100%', height: 400 },
  label: { color: 'white', fontSize: 32, fontWeight: 'bold', marginTop: 20 },
  subLabel: { color: '#888', fontSize: 16, marginTop: 10 }
})