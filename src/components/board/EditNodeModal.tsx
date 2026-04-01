'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface Props {
  node: { id: string; data: { label: string; subtitle?: string } } | null
  onClose: () => void
  onSave: (id: string, label: string, subtitle: string) => void
  onDelete: (id: string) => void
}

export default function EditNodeModal({ node, onClose, onSave, onDelete }: Props) {
  const [label, setLabel] = useState('')
  const [subtitle, setSubtitle] = useState('')

  useEffect(() => {
    if (node) {
      setLabel(node.data.label ?? '')
      setSubtitle(node.data.subtitle ?? '')
    }
  }, [node])

  if (!node) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="glass relative z-10 p-6 w-full max-w-sm mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="text-neutral-600 text-sm font-semibold">Edit node</div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-3 mb-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-neutral-400 text-xs uppercase tracking-wide">Label</label>
            <input
              value={label}
              onChange={e => setLabel(e.target.value)}
              className="glass-input w-full px-3 py-2 text-sm"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-neutral-400 text-xs uppercase tracking-wide">Description</label>
            <input
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              className="glass-input w-full px-3 py-2 text-sm"
              placeholder="Optional description"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { onSave(node.id, label, subtitle); onClose() }}
            className="btn-accent flex-1 py-2 text-sm"
          >
            Save
          </button>
          <button
            onClick={() => { onDelete(node.id); onClose() }}
            className="px-4 py-2 text-sm rounded-xl border border-neutral-200 text-neutral-400 hover:text-red-400 hover:border-red-400/30 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
