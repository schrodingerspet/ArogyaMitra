export function Card({ children, className = "", ...props }) {
  return (
    <section className={`glass glass-lens rounded-2xl ${className}`} {...props}>
      {children}
    </section>
  );
}

export function CardHeader({ icon: Icon, title, subtitle, action, className = "" }) {
  return (
    <header className={`flex items-start justify-between gap-3 ${className}`}>
      <div className="flex items-start gap-3 min-w-0">
        {Icon && (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border-subtle)", color: "var(--accent-light)" }}
            aria-hidden="true"
          >
            <Icon size={16} />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold truncate" style={{ color: "var(--text-1)" }}>{title}</h3>
          {subtitle ? <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>{subtitle}</p> : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function CardBody({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return (
    <footer className={`pt-3 mt-3 ${className}`} style={{ borderTop: "1px solid var(--border-subtle)" }}>
      {children}
    </footer>
  );
}
