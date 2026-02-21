import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;
  private retryTimeout?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorCount: 0 };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorCount: 0 };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Safely log errors without causing additional crashes
    try {
      const safeErrorMessage = error?.message ? String(error.message).substring(0, 200) : 'Unknown error';
      console.error('ErrorBoundary caught:', safeErrorMessage);
    } catch (logError) {
      console.error('Error while logging error');
    }
    
    // Force garbage collection hint (helps with memory pressure)
    if (global.gc) {
      try {
        global.gc();
      } catch (gcError) {
        // GC not available
      }
    }
    
    // Check if this is a recoverable error
    const errorMessage = error?.message || '';
    const safeErrorMessage = typeof errorMessage === 'string' ? errorMessage.substring(0, 500) : '';
    const isLayoutError = safeErrorMessage.includes('layout') || 
                         safeErrorMessage.includes('measure') ||
                         safeErrorMessage.includes('Yoga') ||
                         safeErrorMessage.includes('TextLayout') ||
                         safeErrorMessage.includes('CoreText') ||
                         safeErrorMessage.includes('TLine');
    const isMemoryError = safeErrorMessage.includes('memory') ||
                         safeErrorMessage.includes('allocation') ||
                         safeErrorMessage.includes('OOM');
    
    if (isLayoutError || isMemoryError) {
      console.warn('Recoverable error detected, attempting recovery...');
      // Auto-recovery with memory cleanup
      this.retryTimeout = setTimeout(() => {
        this.setState(prevState => ({
          hasError: false,
          error: undefined,
          errorCount: prevState.errorCount + 1
        }));
      }, 1000);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorCount } = this.state;
      const errorMessage = error?.message || '';
      const isLayoutError = errorMessage.includes('layout') || 
                           errorMessage.includes('measure') ||
                           errorMessage.includes('Yoga') ||
                           errorMessage.includes('CoreText') ||
                           errorMessage.includes('TLine') ||
                           errorMessage.includes('text rendering');
      
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            {isLayoutError 
              ? "We're fixing a display issue. This should resolve automatically."
              : "The app encountered an unexpected error. Please try again."
            }
          </Text>
          {errorCount < this.maxRetries && (
            <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          )}
          {errorCount >= this.maxRetries && (
            <Text style={styles.retryLimitText}>
              Please restart the app if the issue persists.
            </Text>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#6a4c93',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  retryLimitText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 16,
  },
});
