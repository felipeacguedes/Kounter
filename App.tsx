import { StatusBar } from 'expo-status-bar';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    scale.stopAnimation(() => {
      scale.setValue(0.92);

      Animated.timing(scale, {
        toValue: 1,
        duration: 90,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.buttonWrapper, { transform: [{ scale }] }]}>
        <Pressable style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>+1</Text>
        </Pressable>
      </Animated.View>
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
  buttonWrapper: {
    borderRadius: 999,
  },
  button: {
    minWidth: 50,
    paddingHorizontal: 23,
    paddingVertical: 18,
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
    fontSize: 18,
    fontWeight: '700',
  },
});
