import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // log to console for now
    console.error('Captured error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{padding:24,fontFamily:'Inter, sans-serif'}}>
          <h2 style={{color:'#b91c1c'}}>An error occurred rendering the app</h2>
          <pre style={{whiteSpace:'pre-wrap',background:'#fff',color:'#111',padding:12,borderRadius:6}}>{String(this.state.error)}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
