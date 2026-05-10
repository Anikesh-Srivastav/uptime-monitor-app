import { View } from 'react-native';
import Svg, { Path, Polyline } from 'react-native-svg';

export default function Sparkline({ data = [], width = 100, height = 32, color = '#818CF8' }) {
  if (!data || data.length < 2) return <View style={{ width, height }} />;

  const validData = data.map(v => (typeof v === 'number' && v > 0 ? v : null));
  const nums = validData.filter(v => v !== null);
  if (nums.length < 2) return <View style={{ width, height }} />;

  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const range = max - min || 1;

  const pad = 2;
  const innerH = height - pad * 2;
  const innerW = width - pad * 2;
  const step = innerW / (data.length - 1);

  const points = data
    .map((v, i) => {
      if (v === null || v <= 0) return null;
      const x = pad + i * step;
      const y = pad + innerH - ((v - min) / range) * innerH;
      return `${x},${y}`;
    })
    .filter(Boolean)
    .join(' ');

  // Wrap in a non-interactive View so the Svg element never absorbs touches
  // that should propagate up to a parent TouchableOpacity.
  return (
    <View pointerEvents="none">
      <Svg width={width} height={height}>
        <Polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={data.some(v => v <= 0) ? '4,3' : undefined}
        />
      </Svg>
    </View>
  );
}
