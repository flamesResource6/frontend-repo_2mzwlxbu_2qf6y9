import UploadEstimator from './components/UploadEstimator'
import IngredientsCalculator from './components/IngredientsCalculator'
import BarcodeLookup from './components/BarcodeLookup'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />

      <div className="relative min-h-screen p-6 md:p-10">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img src="/flame-icon.svg" alt="Flames" className="w-10 h-10" />
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Sequenzfluss: Food Vision → Nährwerte</h1>
          </div>
        </header>

        <main className="grid gap-6 md:grid-cols-2">
          <UploadEstimator />
          <IngredientsCalculator />
          <BarcodeLookup />
        </main>

        <footer className="mt-10 text-center text-sm text-blue-300/60">
          Demo: Wahrnehmung teilweise heuristisch, API-gestützt für Nährwerte und Barcodes
        </footer>
      </div>
    </div>
  )
}

export default App
