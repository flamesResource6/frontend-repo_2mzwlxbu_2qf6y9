import React, { useState } from 'react'

const BarcodeLookup = () => {
  const [code, setCode] = useState('737628064502')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const onLookup = async () => {
    if (!code) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/b2/barcode/${code}`)
      if (!res.ok) throw new Error('Lookup failed')
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
      <h3 className="text-white font-semibold mb-4">Pfad B2 – Barcode → Produkt</h3>
      <div className="flex gap-3 items-center">
        <input value={code} onChange={e=> setCode(e.target.value)} placeholder="Barcode" className="flex-1 bg-slate-900/60 text-blue-100 px-3 py-2 rounded-lg border border-slate-700" />
        <button onClick={onLookup} disabled={loading} className="bg-blue-600 hover:bg-blue-500 transition text-white px-4 py-2 rounded-lg disabled:opacity-50">Suchen</button>
      </div>
      {error && <p className="text-red-300 mt-3 text-sm">{error}</p>}
      {result && (
        <div className="mt-4 text-blue-100 text-sm">
          <p><span className="text-blue-300">Produkt:</span> {result.product_name || 'Unbekannt'}</p>
          {result.image_url && <img src={result.image_url} alt="product" className="mt-2 w-32 rounded" />}
          {result.nutriments_per_100g && (
            <p className="mt-2">per 100g: {result.nutriments_per_100g.kcal} kcal • P {result.nutriments_per_100g.protein_g} g • F {result.nutriments_per_100g.fat_g} g • KH {result.nutriments_per_100g.carbs_g} g</p>
          )}
        </div>
      )}
    </div>
  )
}

export default BarcodeLookup
