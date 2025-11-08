import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number;
  colorMode?: 'light' | 'dark';
  colors?: string[];
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  radius = 4,
  colorMode,
  colors,
}) => {
  const { activeTheme } = useTheme();
  const mode = colorMode || activeTheme || 'light';
  
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, {
        duration: 1500,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const defaultColors = mode === 'dark'
      ? ['#2a2a2a', '#3a3a3a', '#2a2a2a']
      : ['#e0e0e0', '#f5f5f5', '#e0e0e0'];
    
    const skeletonColors = colors || defaultColors;
    
    const backgroundColor = interpolateColor(
      shimmer.value,
      [0, 0.5, 1],
      skeletonColors
    );

    return {
      backgroundColor,
    };
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius,
        },
        animatedStyle,
      ]}
    />
  );
};

