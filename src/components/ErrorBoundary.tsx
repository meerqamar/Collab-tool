'use client';

import React from 'react';
import * as Sentry from '@sentry/nextjs';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Client React Error Boundary capturing editor crashes and sending stack traces to Sentry.
 */
export class CollaborationErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[Error Boundary] Captured component exception:', error);
    try {
      Sentry.captureException(error, {
        extra: { componentStack: errorInfo.componentStack },
      });
    } catch {
      // Sentry SDK offline
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl max-w-xl mx-auto my-12 text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="font-bold text-xl text-red-800 dark:text-red-200">
            The collaboration editor encountered an unexpected error
          </h2>
          <p className="text-sm text-red-600 dark:text-red-300">
            Our engineering team has been automatically notified with full correlation details.
          </p>
          <button
            onClick={this.resetError}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-lg shadow transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
