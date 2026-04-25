import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

type FloatingGhost = {
  id: number;
  label: '+1' | '-1';
  opacity: Animated.Value;
  translateY: Animated.Value;
};

export default function App() {
  const incrementScale = useRef(new Animated.Value(1)).current;
  const decrementScale = useRef(new Animated.Value(1)).current;
  const nextGhostId = useRef(0);
  const [count, setCount] = useState(0);
  const [incrementGhosts, setIncrementGhosts] = useState<FloatingGhost[]>([]);
  const [decrementGhosts, setDecrementGhosts] = useState<FloatingGhost[]>([]);

  const animateButtonPress = (scale: Animated.Value) => {
    scale.stopAnimation(() => {
      scale.setValue(0.92);

      Animated.timing(scale, {
        toValue: 1,
        duration: 90,
        useNativeDriver: true,
      }).start();
    });
  };

  const spawnGhost = (
    setGhosts: React.Dispatch<React.SetStateAction<FloatingGhost[]>>,
    label: '+1' | '-1',
  ) => {
    const id = nextGhostId.current++;
    const opacity = new Animated.Value(0.9);
    const translateY = new Animated.Value(0);

    setGhosts((current) => [...current, { id, label, opacity, translateY }]);

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
      setGhosts((current) => current.filter((ghost) => ghost.id !== id));
    });
  };

  const handleIncrease = () => {
    setCount((current) => current + 1);
    animateButtonPress(incrementScale);
    spawnGhost(setIncrementGhosts, '+1');
  };

  const handleDecrease = () => {
    setCount((current) => current - 1);
    animateButtonPress(decrementScale);
    spawnGhost(setDecrementGhosts, '-1');
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonArea}>
        <Text style={styles.counterText}>{count}</Text>
        <View style={styles.buttonStack}>
          <View pointerEvents="none" style={styles.ghostLayer}>
            {incrementGhosts.map((ghost) => (
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
                {ghost.label}
              </Animated.Text>
            ))}
          </View>
          <Animated.View
            style={[styles.buttonWrapper, { transform: [{ scale: incrementScale }] }]}
          >
            <Pressable style={styles.button} onPress={handleIncrease}>
              <Text style={styles.buttonText}>+1</Text>
            </Pressable>
          </Animated.View>
        </View>
        <View style={styles.secondaryButtonArea}>
          <View pointerEvents="none" style={styles.secondaryGhostLayer}>
            {decrementGhosts.map((ghost) => (
              <Animated.Text
                key={ghost.id}
                style={[
                  styles.secondaryGhostText,
                  {
                    opacity: ghost.opacity,
                    transform: [{ translateY: ghost.translateY }],
                  },
                ]}
              >
                {ghost.label}
              </Animated.Text>
            ))}
          </View>
          <Animated.View
            style={[styles.secondaryButtonWrapper, { transform: [{ scale: decrementScale }] }]}
          >
            <Pressable style={styles.secondaryButton} onPress={handleDecrease}>
              <Text style={styles.secondaryButtonText}>-1</Text>
            </Pressable>
          </Animated.View>
        </View>
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
  buttonStack: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrapper: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  button: {
    minWidth: 82,
    paddingHorizontal: 44,
    paddingVertical: 36,
    borderRadius: 999,
    backgroundColor: '#3aa76d',
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
    fontSize: 34,
    fontWeight: '700',
  },
  secondaryButtonArea: {
    marginTop: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonWrapper: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  secondaryButton: {
    minWidth: 62,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#d94c4c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#fffaf4',
    fontSize: 20,
    fontWeight: '700',
  },
  counterText: {
    marginBottom: 40,
    color: '#fffaf4',
    fontSize: 88,
    lineHeight: 96,
    fontWeight: '800',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
    fontVariant: ['tabular-nums'],
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
  secondaryGhostLayer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  secondaryGhostText: {
    position: 'absolute',
    color: '#fffaf4',
    fontSize: 22,
    fontWeight: '800',
  },
});
