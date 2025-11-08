import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { ThemedText } from "@/components/themed-text";
import { StatCard } from "@/components/statistics";
import { useStatistics } from "@/contexts/StatisticsContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "@/constants/theme";

export default function StatisticsScreen() {
  const { activeTheme } = useTheme();
  const colors = Colors[activeTheme];
  const { width: screenWidth } = useWindowDimensions();
  const { stats, weeklyData, priorityData, chartKey } = useStatistics();

  // Responsive chart width
  const chartWidth = screenWidth - Spacing.md * 6;
  const isSmallScreen = screenWidth < 375;
  const barWidth = isSmallScreen ? 24 : 28;
  const spacing = isSmallScreen ? 12 : 16;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <ThemedText style={[Typography.h2, styles.title]}>
            Statistics
          </ThemedText>
          <ThemedText
            style={[styles.subtitle, { color: colors.textSecondary }]}
          >
            Track your productivity
          </ThemedText>
        </View>

        {/* Overview Stats */}
        <View style={styles.statsRow}>
          <StatCard
            key={`total-${stats.total}`}
            title="Total Tasks"
            value={stats.total}
            icon="checkbox-outline"
            gradientColors={[colors.primary, colors.secondary]}
            size="medium"
          />
          <StatCard
            key={`completed-${stats.completed}-${stats.completionRate}`}
            title="Completed"
            value={stats.completed}
            // subtitle={`${stats.completionRate}% completion rate`}
            showProgressCircle={true}
            progress={stats.completionRate}
            gradientColors={[colors.success, "#28A745"]}
            size="medium"
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            key={`active-${stats.active}`}
            title="Active"
            value={stats.active}
            icon="time-outline"
            gradientColors={[colors.warning, "#FFA500"]}
            size="medium"
          />
          <StatCard
            key={`overdue-${stats.overdue}`}
            title="Overdue"
            value={stats.overdue}
            icon="alert-circle"
            gradientColors={[colors.danger, "#DC3545"]}
            size="medium"
          />
        </View>

        {/* Weekly Completion Chart */}
        <View
          style={[
            styles.chartCard,
            { backgroundColor: colors.card },
            Shadows.medium,
          ]}
        >
          <ThemedText
            style={[
              Typography.h3,
              { color: colors.text, marginBottom: Spacing.sm },
            ]}
          >
            This Week
          </ThemedText>
          <ThemedText
            style={[
              Typography.caption,
              { color: colors.textSecondary, marginBottom: Spacing.md },
            ]}
          >
            Tasks completed in the last 7 days
          </ThemedText>

          <View style={styles.chartContainer}>
            {weeklyData.some((d) => d.value > 0) ? (
              <BarChart
                key={`bar-${chartKey}`}
                data={weeklyData}
                width={chartWidth}
                height={isSmallScreen ? 160 : 180}
                barWidth={barWidth}
                spacing={spacing}
                barBorderRadius={4}
                noOfSections={4}
                yAxisThickness={0}
                xAxisThickness={0}
                hideRules
                hideYAxisText
                isAnimated
                animationDuration={800}
                initialSpacing={10}
                endSpacing={10}
                xAxisLabelTextStyle={{
                  color: colors.textSecondary,
                  fontSize: isSmallScreen ? 10 : 11,
                  marginTop: 4,
                }}
              />
            ) : (
              <View style={styles.emptyChart}>
                <ThemedText
                  style={[
                    Typography.body,
                    { color: colors.textSecondary, textAlign: "center" },
                  ]}
                >
                  No completed tasks this week. Start completing tasks to see
                  your progress!
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        {/* Priority Distribution */}
        {priorityData.length > 0 && (
          <View
            style={[
              styles.chartCard,
              { backgroundColor: colors.card },
              Shadows.medium,
            ]}
          >
            <ThemedText
              style={[
                Typography.h3,
                { color: colors.text, marginBottom: Spacing.sm },
              ]}
            >
              Priority Distribution
            </ThemedText>
            <ThemedText
              style={[
                Typography.caption,
                { color: colors.textSecondary, marginBottom: Spacing.md },
              ]}
            >
              Active tasks by priority level
            </ThemedText>

            <View style={styles.pieChartContainer}>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <PieChart
                  key={`pie-${chartKey}`}
                  data={priorityData}
                  donut
                  radius={isSmallScreen ? 65 : 80}
                  innerRadius={isSmallScreen ? 45 : 55}
                  innerCircleColor={colors.card}
                  centerLabelComponent={() => (
                    <View style={styles.centerLabel}>
                      <ThemedText
                        style={[Typography.h2, { color: colors.text }]}
                      >
                        {stats.active}
                      </ThemedText>
                      <ThemedText
                        style={[
                          Typography.caption,
                          { color: colors.textSecondary, fontSize: 11 },
                        ]}
                      >
                        Active
                      </ThemedText>
                    </View>
                  )}
                />
              </View>

              <View style={styles.legend}>
                {priorityData.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendDot,
                        { backgroundColor: item.color },
                      ]}
                    />
                    <ThemedText
                      style={[Typography.caption, { color: colors.text }]}
                    >
                      {item.label}: {item.value}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Recent Activity Stats */}
        <View style={styles.statsRow}>
          <StatCard
            key={`today-${stats.completedToday}`}
            title="Today"
            value={stats.completedToday}
            subtitle="completed"
            icon="today-outline"
            gradientColors={[colors.tertiary, "#9B59B6"]}
            size="medium"
          />
          <StatCard
            key={`month-${stats.completedThisMonth}`}
            title="This Month"
            value={stats.completedThisMonth}
            subtitle="completed"
            icon="calendar"
            gradientColors={[colors.primary, colors.tertiary]}
            size="medium"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  header: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  chartCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    overflow: "visible",
  },
  emptyChart: {
    paddingVertical: Spacing.xl,
    alignItems: "center",
  },
  pieChartContainer: {
    alignItems: "center",
    gap: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  centerLabel: {
    alignItems: "center",
    justifyContent: "center",
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
