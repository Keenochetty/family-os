import type { JSX } from "react";
import { PanResponder, ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";

import { SmartHeaderActionCard } from "@/components/SmartHeaderActionCard";
import type { SmartHeaderAction } from "@/lib/smartHeaderTypes";

type SmartHeaderActionCarouselProps = {
  actions: SmartHeaderAction[];
  activeIndex: number;
  isDark: boolean;
  onActiveIndexChange: (index: number) => void;
  onDismiss: (actionId: string) => void;
  onDismissArea: (velocityY?: number) => void;
  onLongPressAction?: (action: SmartHeaderAction) => void;
  onQuickLog: (action: SmartHeaderAction) => void;
};

export function SmartHeaderActionCarousel({
  actions,
  activeIndex,
  isDark,
  onActiveIndexChange,
  onDismiss,
  onDismissArea,
  onLongPressAction,
  onQuickLog,
}: SmartHeaderActionCarouselProps): JSX.Element {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 32, 420);
  const dotColor = isDark ? "rgba(248,250,252,0.34)" : "rgba(15,23,42,0.2)";

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_event, gesture) => gesture.dy < -14 && Math.abs(gesture.dy) > Math.abs(gesture.dx) * 1.2,
    onPanResponderRelease: (_event, gesture) => {
      if (gesture.dy < -18) {
        onDismissArea(gesture.vy);
      }
    },
  });

  return (
    <View {...panResponder.panHandlers}>
      <ScrollView
        horizontal
        onMomentumScrollEnd={(event) => {
          const nextIndex = Math.round(event.nativeEvent.contentOffset.x / cardWidth);
          onActiveIndexChange(Math.max(0, Math.min(actions.length - 1, nextIndex)));
        }}
        pagingEnabled
        scrollEnabled={actions.length > 1}
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth}
        style={styles.scroller}
      >
        {actions.map((action) => (
          <View key={action.id} style={[styles.slide, { width: cardWidth }]}>
            <SmartHeaderActionCard action={action} embedded isDark={isDark} onDismiss={onDismiss} onLongPressAction={onLongPressAction} onQuickLog={onQuickLog} />
          </View>
        ))}
      </ScrollView>
      {actions.length > 1 ? (
        <View style={styles.dots}>
          {actions.map((action, index) => (
            <View
              key={action.id}
              style={[
                styles.dot,
                { backgroundColor: index === activeIndex ? actions[activeIndex]?.accentColor ?? "#35A96B" : dotColor },
                index === activeIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  activeDot: {
    width: 18,
  },
  dot: {
    borderRadius: 999,
    height: 6,
    width: 6,
  },
  dots: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    marginTop: 9,
  },
  scroller: {
    overflow: "visible",
  },
  slide: {
    paddingHorizontal: 0,
  },
});
