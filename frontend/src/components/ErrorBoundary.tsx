import { Component, ErrorInfo, ReactNode } from "react";
import { FiAlertCircle } from "react-icons/fi";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-6 rounded-2xl glass-subtle border border-red-500/20" style={{ background: "var(--danger-dim, rgba(239, 68, 68, 0.05))" }}>
          <div className="flex items-center gap-3 mb-4" style={{ color: "var(--danger, #ef4444)" }}>
            <FiAlertCircle size={24} />
            <h2 className="text-lg font-bold">Something went wrong</h2>
          </div>
          <p className="text-sm mb-4" style={{ color: "var(--text-2)" }}>
            The application encountered an unexpected error while rendering this component.
          </p>
          <pre className="p-4 rounded-xl text-xs overflow-auto" style={{ background: "var(--surface-1)", color: "var(--danger, #ef4444)" }}>
            {this.state.error?.message}
          </pre>
          <button 
            className="mt-4 px-4 py-2 rounded-lg text-sm font-medium transition"
            style={{ background: "var(--surface-2)", color: "var(--text-1)" }}
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
