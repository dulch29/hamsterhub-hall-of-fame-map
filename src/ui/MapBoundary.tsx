import { Component, type ReactNode } from "react";

/** Keep a failed scene/module from taking the independent student list down. */
export class MapBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? (
      <p role="status">Switching to the student list…</p>
    ) : (
      this.props.children
    );
  }
}
