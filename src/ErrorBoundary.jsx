import React from "react";

/**
 * Top-level error boundary.
 *
 * Catches synchronous rendering errors from anywhere in the React tree and
 * shows a graceful fallback instead of an empty white screen. Async errors
 * (promise rejections, timers, network) are NOT caught by this — those must
 * be handled at the call site.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
     
    console.error("[ErrorBoundary]", error, info?.componentStack);
  }

  handleReload = () => {
    window.location.assign("/");
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
          }}
        >
          <h1 style={{ marginBottom: "0.5rem" }}>Something went wrong</h1>
          <p style={{ color: "#555", maxWidth: 480 }}>
            The page crashed unexpectedly. This has been logged. Try reloading —
            if the issue persists, please contact support.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              marginTop: "1.5rem",
              padding: "0.75rem 1.5rem",
              background: "#111",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Go to home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
