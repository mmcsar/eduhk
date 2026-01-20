import { useEffect, useState } from 'react'
import './App.css'

type HealthResponse = {
  ok: boolean
  service: string
  timestamp: string
}

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/health')
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`API error: ${res.status} ${res.statusText}`)
        }
        return (await res.json()) as HealthResponse
      })
      .then(setHealth)
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : String(e))
      })
  }, [])

  return (
    <>
      <h1>Salut coach</h1>
      <div className="card">
        <p>Projet de base EduHK: Web (React) + API (Node) + Mongo (Docker).</p>
      </div>

      <h2>API status</h2>
      {error ? <pre>{error}</pre> : null}
      {health ? (
        <pre>{JSON.stringify(health, null, 2)}</pre>
      ) : (
        <p>Chargement...</p>
      )}
    </>
  )
}

export default App
