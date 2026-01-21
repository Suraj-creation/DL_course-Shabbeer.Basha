import React, { Component } from 'react';

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 * 
 * Best Practice: Wrap major sections of your app to prevent full crashes
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // In production, you could send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error tracking (Sentry, LogRocket, etc.)
      // logErrorToService(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={styles.container}>
          <div style={styles.content}>
            <div style={styles.iconWrapper}>
              <span style={styles.icon}>⚠️</span>
            </div>
            <h1 style={styles.title}>Something went wrong</h1>
            <p style={styles.message}>
              We're sorry, but something unexpected happened. 
              Please try again or return to the home page.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>Error Details (Development Only)</summary>
                <pre style={styles.errorText}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <div style={styles.buttonGroup}>
              <button onClick={this.handleRetry} style={styles.primaryButton}>
                🔄 Try Again
              </button>
              <button onClick={this.handleRefresh} style={styles.secondaryButton}>
                ↻ Refresh Page
              </button>
              <button onClick={this.handleGoHome} style={styles.outlineButton}>
                🏠 Go Home
              </button>
            </div>
            
            {this.state.retryCount > 2 && (
              <p style={styles.helpText}>
                If the problem persists, please try clearing your browser cache 
                or contact support.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Inline styles for the error boundary (ensures styles work even if CSS fails)
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  content: {
    background: 'white',
    borderRadius: '16px',
    padding: '48px',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },
  iconWrapper: {
    marginBottom: '24px'
  },
  icon: {
    fontSize: '64px'
  },
  title: {
    margin: '0 0 16px',
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937'
  },
  message: {
    margin: '0 0 24px',
    fontSize: '16px',
    color: '#6b7280',
    lineHeight: '1.6'
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '24px'
  },
  primaryButton: {
    padding: '14px 28px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  secondaryButton: {
    padding: '14px 28px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#4F46E5',
    background: '#EEF2FF',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  outlineButton: {
    padding: '14px 28px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#6b7280',
    background: 'transparent',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'border-color 0.2s, color 0.2s'
  },
  details: {
    marginTop: '24px',
    textAlign: 'left',
    background: '#fef2f2',
    borderRadius: '8px',
    padding: '16px'
  },
  summary: {
    cursor: 'pointer',
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: '8px'
  },
  errorText: {
    fontSize: '12px',
    color: '#7f1d1d',
    overflow: 'auto',
    maxHeight: '200px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  },
  helpText: {
    marginTop: '24px',
    fontSize: '14px',
    color: '#9ca3af'
  }
};

export default ErrorBoundary;
