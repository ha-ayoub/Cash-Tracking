import React, { Component } from "react";
import Button from "./Button";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid h-screen place-content-center bg-white px-4">
          <h1 className="uppercase tracking-widest text-gray-500">
            404 | Not Found
          </h1>
          <Button label={"Go Back"} className="bg-black text-white mt-4" />
        </div>
      );
    }

    // Render children if no error occurred
    return this.props.children;
  }
}

export default ErrorBoundary;
