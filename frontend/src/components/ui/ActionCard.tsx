import { Link } from "react-router-dom";
import { Card, CardBody, CardFooter, CardHeader } from "./Card";

export default function ActionCard({ icon, title, subtitle, to, buttonLabel, tone = "btn-accent-soft" }) {
  return (
    <Card className="p-4 card-hover" role="region" aria-label={title}>
      <CardHeader icon={icon} title={title} subtitle={subtitle} />
      <CardBody className="min-h-10" />
      <CardFooter>
        <Link to={to} className={`btn ${tone} py-2 px-3 text-xs rounded-lg w-full justify-center`} aria-label={buttonLabel}>
          {buttonLabel}
        </Link>
      </CardFooter>
    </Card>
  );
}
