import React, { useState } from 'react'

const Row = ({i, onChange, onRemove}) => (
  <div className="flex gap-2 items-center">
    <input value={i.name} onChange={e=> onChange({...i, name: e.target.value})} placeholder="Zutat" className="flex-1 bg-slate-900/60 text-blue-100 px-3 py-2 rounded-lg border border-slate-700" />
    <input type="number" value={i.grams} onChange={e=> onChange({...i, grams: Number(e.target.value)})} placeholder="g" className="w-24 bg-slate-900/60 text-blue-100 px-3 py-2 rounded-lg border border-slate-700" />
    <button onClick={onRemove} className="text-blue-300 hover:text-white">Entfernen</button>
  </div>
)

const IngredientsCalculator = () => {
  const [items, setItems] = useState([{name:'Reis', grams:150}, {name:'Brokkoli', grams:120}])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const calc = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/b1/nutrition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      })
      if (!res.ok) throw new Error('Fehler bei Anfrage')
      const data = await res.json()
      setResult(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const recipe = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/b1/recipe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: items })
      })
      const data = await res.json()
      setResult(prev => ({...prev, recipe: data}))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
      <h3 className="text-white font-semibold mb-4">Pfad B1 – Zutaten → Nährwerte + Rezept</h3>
      <div className="grid gap-3">
        {items.map((it, idx)=> (
          <Row key={idx} i={it} onChange={(v)=> setItems(items.map((x,j)=> j===idx?v:x))} onRemove={()=> setItems(items.filter((_,j)=> j!==idx))} />
        ))}
        <button onClick={()=> setItems([...items, {name:'', grams:100}])} className="text-blue-300 hover:text-white text-sm">+ Zutat</button>
        <div className="flex gap-3 mt-2">
          <button onClick={calc} disabled={loading} className="bg-blue-600 hover:bg-blue-500 transition text-white px-4 py-2 rounded-lg disabled:opacity-50">Berechnen</button>
          <button onClick={recipe} disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 transition text-white px-4 py-2 rounded-lg disabled:opacity-50">Rezept vorschlagen</button>
        </div>
      </div>
      {result && (
        <div className="mt-4 text-blue-100 text-sm">
          {result.totals && (
            <p><span className="text-blue-300">Summe:</span> {result.totals.kcal} kcal • P {result.totals.protein_g} g • F {result.totals.fat_g} g • KH {result.totals.carbs_g} g</p>
          )}
          {result.items && (
            <ul className="mt-2 list-disc list-inside space-y-1">
              {result.items.map((it, i)=> (
                <li key={i}>{it.name} – {it.grams} g → {it.total.kcal} kcal</li>
              ))}
            </ul>
          )}
          {result.recipe && (
            <div className="mt-4">
              <p className="text-blue-300">Rezept: {result.recipe.title}</p>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                {result.recipe.steps.map((s, i)=> <li key={i}>{s}</li>)}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default IngredientsCalculator
