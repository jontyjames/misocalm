/**
 * Error Boundary Component
 * Catches JavaScript errors in child components and displays fallback UI
 */

'use client';

import { Component } from 'react';
import { Button, Card } from '@/components/ui';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });

    // Call optional onReset callback
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          reset: this.handleReset,
        });
      }

      // Default fallback UI
      return (
        <div className="min-h-[200px] flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-rose-400" />
              </div>
            </div>
            <h2 className="text-lg font-light text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-slate-400 font-light mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <Button onClick={this.handleReset} variant="secondary" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try again
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Simple error fallback component
 */
export function ErrorFallback({ error, reset, title, message }) {
  return (
    <div className="min-h-[200px] flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
          </div>
        </div>
        <h2 className="text-lg font-light text-white mb-2">
          {title || 'Something went wrong'}
        </h2>
        <p className="text-sm text-slate-400 font-light mb-4">
          {message || error?.message || 'An unexpected error occurred'}
        </p>
        {reset && (
          <Button onClick={reset} variant="secondary" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try again
          </Button>
        )}
      </Card>
    </div>
  );
}

export default ErrorBoundary;
