import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

interface AnimatedNumberProps {
  value: number;
  style?: TextStyle;
  duration?: number;
  delay?: number;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  style,
}) => {
  return (
    <Text style={style}>
      {Math.round(value)}
    </Text>
  );
};
