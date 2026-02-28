import { Card, CardBody, CardHeader } from "./Card";

export default function ChartCard({ icon, title, subtitle, action, children, className = "" }) {
  return (
    <Card className={`p-5 ${className}`} role="region" aria-label={title}>
      <CardHeader icon={icon} title={title} subtitle={subtitle} action={action} />
      <CardBody className="mt-4">{children}</CardBody>
    </Card>
  );
}
