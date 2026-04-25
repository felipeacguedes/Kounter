import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

type FloatingPlusOne = {
  id: number;
  opacity: Animated.Value;
  translateY: Animated.Value;
};

export default function App() {
  const scale = useRef(new Animated.Value(1)).current;
  const nextGhostId = useRef(0);
  const [count, setCount] = useState(0);
  const [floatingPlusOnes, setFloatingPlusOnes] = useState<FloatingPlusOne[]>([]);

  const handlePress = () => {
    setCount((current) => current + 1);

    scale.stopAnimation(() => {
      scale.setValue(0.92);

      Animated.timing(scale, {
        toValue: 1,
        duration: 90,
        useNativeDriver: true,
      }).start();
    });

    const id = nextGhostId.current++;
    const opacity = new Animated.Value(0.9);
    const translateY = new Animated.Value(0);

    setFloatingPlusOnes((current) => [...current, { id, opacity, translateY }]);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -48,
        duration: 650,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setFloatingPlusOnes((current) => current.filter((ghost) => ghost.id !== id));
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonArea}>
        <Text style={styles.counterText}>{count}</Text>
        <View pointerEvents="none" style={styles.ghostLayer}>
          {floatingPlusOnes.map((ghost) => (
            <Animated.Text
              key={ghost.id}
              style={[
                styles.ghostText,
                {
                  opacity: ghost.opacity,
                  transform: [{ translateY: ghost.translateY }],
                },
              ]}
            >
              +1
            </Animated.Text>
          ))}
        </View>
        <Animated.View style={[styles.buttonWrapper, { transform: [{ scale }] }]}>
          <Pressable style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>+1</Text>
          </Pressable>
        </Animated.View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1f22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 120,
  },
  buttonWrapper: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  button: {
    minWidth: 82,
    paddingHorizontal: 34,
    paddingVertical: 26,
    borderRadius: 999,
    backgroundColor: '#d94c4c',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  buttonText: {
    color: '#fffaf4',
    fontSize: 24,
    fontWeight: '700',
  },
  counterText: {
    marginBottom: 40,
    color: '#fffaf4',
    fontSize: 88,
    fontWeight: '800',
  },
  ghostLayer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  ghostText: {
    position: 'absolute',
    color: '#fffaf4',
    fontSize: 28,
    fontWeight: '800',
  },
});
