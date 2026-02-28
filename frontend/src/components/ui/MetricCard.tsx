import { motion } from "framer-motion";
import { Card, CardBody, CardFooter, CardHeader } from "./Card";

function Sparkline({ points = [], color = "var(--accent)" }) {
  if (!points.length) return null;
  const W = 120;
  const H = 34;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const coords = points.map((value, i) => ({
    x: (i / Math.max(points.length - 1, 1)) * W,
    y: H - ((value - min) / range) * H,
  }));
  const d = coords.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MetricCard({
  icon,
  title,
  value,
  subtitle,
  trendLabel,
  trend = [],
  color = "var(--accent)",
  animate = true,
}) {
  const content = (
    <Card className="p-5 card-hover" role="region" aria-label={title}>
      <CardHeader icon={icon} title={title} subtitle={subtitle} />
      <CardBody className="mt-3">
        <p className="text-2xl font-bold" style={{ color: "var(--text-1)" }}>{value}</p>
      </CardBody>
      <CardFooter className="flex items-end justify-between gap-3">
        <span className="text-xs" style={{ color: "var(--text-3)" }}>{trendLabel || "7 day trend"}</span>
        <Sparkline points={trend} color={color} />
      </CardFooter>
    </Card>
  );

  if (!animate) return content;
  return <motion.div whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.15 } }}>{content}</motion.div>;
}
