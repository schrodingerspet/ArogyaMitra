import React from "react";
import { FiActivity } from "react-icons/fi";
import MetricCard from "./MetricCard";

const meta = {
  title: "UI/MetricCard",
  component: MetricCard,
  tags: ["autodocs"],
  args: {
    icon: FiActivity,
    title: "Workouts completed",
    value: "14",
    subtitle: "This week",
    trendLabel: "7-day trend",
    trend: [2, 3, 2, 4, 5, 4, 6],
  },
  decorators: [
    (Story) => React.createElement("div", { style: { width: 320 } }, React.createElement(Story)),
  ],
};

export default meta;

export const Default = {};

export const WarningTone = {
  args: {
    title: "Calories burned",
    value: "2,140",
    color: "var(--color-warning)",
    trend: [120, 220, 180, 260, 300, 280, 340],
  },
};
