import { Text } from 'react-native';
import { Card } from 'heroui-native';
import type { MetricItem } from '../../types';
import { getFitnessTheme, type FitnessThemeMode } from '../../theme/fitnessTheme';

type Props = MetricItem & { themeMode: FitnessThemeMode };

export function MetricCard({ label, value, detail, tone = 'neutral', themeMode }: Props) {
  const theme = getFitnessTheme(themeMode);
  const tones = {
    accent: theme.accent,
    teal: theme.teal,
    green: theme.green,
    gold: theme.gold,
    neutral: theme.text,
  };

  return (
    <Card className="min-h-24 flex-1 rounded-[16px] border border-border" variant="default">
      <Card.Body className="gap-1 p-3">
        <Text className="text-[11px] text-muted">{label}</Text>
        <Text
          className="text-[23px] font-bold tabular-nums"
          style={{ color: tones[tone] }}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {value}
        </Text>
        {detail ? <Text className="text-[10px] text-muted">{detail}</Text> : null}
      </Card.Body>
    </Card>
  );
}
