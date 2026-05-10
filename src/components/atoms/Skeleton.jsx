import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

/**
 * A single pulsing placeholder block. width/height/borderRadius control shape;
 * all Skeleton instances share the same animation cadence (750ms per phase).
 */
export default function Skeleton({ width, height = 16, borderRadius = 8, style }) {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.3, duration: 750, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 750, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width ?? '100%',
          height,
          borderRadius,
          backgroundColor: theme.isDark ? '#2D3A4F' : '#E5E7EB',
          opacity,
        },
        style,
      ]}
    />
  );
}
