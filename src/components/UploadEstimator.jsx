import React, { useState } from 'react'

const UploadEstimator = () => {
  const [file, setFile] = useState(null)
  const [plate, setPlate] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const form = new FormData()
      form.append('image', file)
      if (plate) form.append('plate_diameter_cm', plate)

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/a1/estimate`, {
        method: 'POST',
        body: form,
      })
      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
      <h3 className="text-white font-semibold mb-4">Pfad A – Tellerfoto → Nährwerte</h3>
      <form onSubmit={onSubmit} className="grid gap-3">
        <input type="file" accept="image/*" onChange={(e)=> setFile(e.target.files?.[0]||null)} className="text-blue-100" />
        <div className="flex items-center gap-3">
          <label className="text-blue-200 text-sm">Tellerdurchmesser (cm)</label>
          <input value={plate} onChange={(e)=> setPlate(e.target.value)} placeholder="27" className="bg-slate-900/60 text-blue-100 px-3 py-2 rounded-lg w-24 border border-slate-700" />
        </div>
        <button disabled={loading || !file} className="bg-blue-600 hover:bg-blue-500 transition text-white px-4 py-2 rounded-lg disabled:opacity-50">
          {loading ? 'Schätze...' : 'Schätzen'}
        </button>
      </form>
      {error && <p className="text-red-300 mt-3 text-sm">{error}</p>}
      {result && (
        <div className="mt-4 text-blue-100 text-sm">
          <p><span className="text-blue-300">Portion:</span> {result.portion_grams} g</p>
          <p className="mt-2"><span className="text-blue-300">Kcal:</span> {result.estimation.kcal} • P: {result.estimation.protein_g} g • F: {result.estimation.fat_g} g • KH: {result.estimation.carbs_g} g</p>
          <p className="mt-2"><span className="text-blue-300">Plausibilität:</span> {result.plausibility.message} ({String(result.plausibility.within_bounds)})</p>
        </div>
      )}
    </div>
  )
}

export default UploadEstimator
