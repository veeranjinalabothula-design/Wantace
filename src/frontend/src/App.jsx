import Dashboard from './components/Dashboard.jsx';

export default function App() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Vardhan Steelware home">
          <span className="brand-mark" aria-hidden="true">VS</span>
          <span>Vardhan <strong>Steelware</strong></span>
        </a>
        <span className="topbar-label">Operations workspace</span>
      </header>
      <Dashboard />
      <footer className="page-footer">Order operations · Internal use</footer>
    </main>
  );
}
