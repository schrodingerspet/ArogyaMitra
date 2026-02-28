import { Link } from "react-router-dom";
import { FiChevronRight, FiTrash2 } from "react-icons/fi";
import { Card } from "./Card";

export default function PlanCard({ id, title, description, chips = [], detailsTo, onDelete }) {
  return (
    <Card className="p-5 card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>{title}</h3>
          {description ? <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--text-3)" }}>{description}</p> : null}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {chips.map((chip) => (
              <span
                key={`${id}-${chip.label}`}
                className={`chip ${chip.tone === "accent" ? "chip-accent" : ""}`}
                style={chip.style}
              >
                {chip.label}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => onDelete(id)}
            className="btn btn-ghost p-1.5 rounded-lg focus-ring"
            style={{ color: "var(--text-3)" }}
            aria-label={`Delete ${title}`}
          >
            <FiTrash2 size={14} />
          </button>
          <Link
            to={detailsTo}
            className="btn btn-ghost p-1.5 rounded-lg focus-ring"
            style={{ color: "var(--text-3)" }}
            aria-label={`Open ${title}`}
          >
            <FiChevronRight size={14} />
          </Link>
        </div>
      </div>
    </Card>
  );
}
