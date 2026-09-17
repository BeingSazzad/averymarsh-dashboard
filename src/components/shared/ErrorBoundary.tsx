import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App crash', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-3xl border border-[#DDE1E7] bg-white p-6 shadow-sm">
            <h1 className="text-lg font-bold text-[#171A1F]">Something went wrong</h1>
            <p className="text-sm text-[#68707C] mt-2 leading-relaxed break-words">
              {this.state.error.message || 'Unexpected error'}
            </p>
            <button
              type="button"
              className="mt-4 h-10 px-4 rounded-xl bg-[#1677FF] text-white text-sm font-semibold cursor-pointer"
              onClick={() => {
                this.setState({ error: null })
                window.location.assign('/')
              }}
            >
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
