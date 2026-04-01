'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import ReactFlow, {
  Background, Controls, MiniMap,
  addEdge, applyNodeChanges, applyEdgeChanges,
  type Node, type Edge, type Connection, type NodeChange, type EdgeChange,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { NODE_TYPES } from '@/components/board/CustomNodes'
import EditNodeModal from '@/components/board/EditNodeModal'
import { Loader2, Wand2, Plus, Save, CheckCircle2, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const NODE_TYPE_OPTIONS = ['root', 'icp', 'channel', 'tactic', 'content', 'goal']

export default function DrawingBoardPage() {
  const router = useRouter()
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [editNode, setEditNode] = useState<Node | null>(null)
  const [addingType, setAddingType] = useState(false)
  const [hasStrategy, setHasStrategy] = useState(false)
  const saveTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    async function load() {
      // Load existing board
      const boardRes = await fetch('/api/gtm/board')
      const boardData = await boardRes.json()
      if (boardData.nodes?.length > 0) {
        setNodes(boardData.nodes)
        setEdges(boardData.edges)
      }

      // Check if strategy exists
      const stratRes = await fetch('/api/gtm/strategy')
      const stratData = await stratRes.json()
      setHasStrategy(!!stratData.strategy)

      setLoading(false)
    }
    load()
  }, [])

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes(nds => applyNodeChanges(changes, nds))
    scheduleSave()
  }, [])

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges(eds => applyEdgeChanges(changes, eds))
    scheduleSave()
  }, [])

  const onConnect = useCallback((connection: Connection) => {
    setEdges(eds => addEdge({
      ...connection,
      style: { stroke: 'rgba(0,0,0,0.15)', strokeWidth: 1.5 },
      animated: false,
    }, eds))
    scheduleSave()
  }, [])

  function scheduleSave() {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setSaved(false)
    saveTimer.current = setTimeout(() => saveBoard(), 2000)
  }

  async function saveBoard(explicit = false) {
    setSaving(true)
    await fetch('/api/gtm/board', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save', nodes, edges }),
    })
    setSaving(false)
    setSaved(true)
    if (explicit) toast.success('Board saved')
  }

  async function generateBoard() {
    setGenerating(true)
    const stratRes = await fetch('/api/gtm/strategy')
    const stratData = await stratRes.json()

    if (!stratData.strategy) {
      toast.error('Generate your GTM strategy first from the Ideate page')
      setGenerating(false)
      return
    }

    const res = await fetch('/api/gtm/board', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'generate', strategy: stratData.strategy }),
    })
    const data = await res.json()

    if (data.nodes) {
      setNodes(data.nodes.map((n: Node) => ({
        ...n,
        style: { cursor: 'grab' },
      })))
      setEdges(data.edges.map((e: Edge) => ({
        ...e,
        style: { stroke: 'rgba(0,0,0,0.12)', strokeWidth: 1.5 },
      })))
      toast.success('Drawing board generated from your strategy')
    } else {
      toast.error('Generation failed — try again')
    }
    setGenerating(false)
  }

  function addNode(type: string) {
    const id = `node-${Date.now()}`
    const newNode: Node = {
      id,
      type,
      position: { x: 300 + Math.random() * 200, y: 200 + Math.random() * 150 },
      data: { label: `New ${type}`, subtitle: 'Double-click to edit' },
    }
    setNodes(nds => [...nds, newNode])
    setAddingType(false)
    scheduleSave()
  }

  function onNodeDoubleClick(_: React.MouseEvent, node: Node) {
    setEditNode(node)
  }

  function handleSaveNode(id: string, label: string, subtitle: string) {
    setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, label, subtitle } } : n))
    scheduleSave()
  }

  function handleDeleteNode(id: string) {
    setNodes(nds => nds.filter(n => n.id !== id))
    setEdges(eds => eds.filter(e => e.source !== id && e.target !== id))
    scheduleSave()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="text-neutral-400 text-sm">Loading your board...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-200 glass-sidebar shrink-0">
        <div>
          <h1 className="text-neutral-800 font-semibold text-sm">Drawing Board</h1>
          <p className="text-neutral-400 text-xs">Double-click any node to edit · Drag to connect</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto-save indicator */}
          <div className="flex items-center gap-1.5 text-xs mr-2">
            {saving && <><Loader2 size={11} className="animate-spin text-neutral-400" /><span className="text-neutral-400">Saving...</span></>}
            {saved && !saving && <><CheckCircle2 size={11} className="text-neutral-400" /><span className="text-neutral-400">Saved</span></>}
          </div>

          {/* Generate from strategy */}
          <button
            onClick={generateBoard}
            disabled={generating}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-500 text-xs hover:text-neutral-700 hover:border-neutral-300 transition-all disabled:opacity-40"
          >
            {generating ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
            {generating ? 'Generating...' : 'Generate from strategy'}
          </button>

          {/* Add node */}
          <div className="relative">
            <button
              onClick={() => setAddingType(v => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-500 text-xs hover:text-neutral-700 hover:border-neutral-300 transition-all"
            >
              <Plus size={12} /> Add node
            </button>
            {addingType && (
              <div className="absolute right-0 top-full mt-2 glass rounded-xl overflow-hidden z-20 w-40">
                {NODE_TYPE_OPTIONS.map(type => (
                  <button
                    key={type}
                    onClick={() => addNode(type)}
                    className="w-full text-left px-4 py-2.5 text-xs text-neutral-500 hover:text-neutral-800 hover:bg-black/6 transition-all capitalize"
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Save */}
          <button
            onClick={() => saveBoard(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-500 text-xs hover:text-neutral-700 hover:border-neutral-300 transition-all"
          >
            <Save size={12} /> Save
          </button>

          {/* Next step */}
          <button
            onClick={() => router.push('/dashboard/campaigns')}
            className="btn-accent flex items-center gap-2 px-4 py-1.5 text-xs"
          >
            Campaigns <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Empty state */}
      {nodes.length === 0 && !generating && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none" style={{ top: 60 }}>
          <div className="glass p-8 text-center max-w-sm pointer-events-auto">
            <div className="text-neutral-300 text-4xl mb-4">⬡</div>
            <div className="text-neutral-500 font-medium text-sm mb-1">Your canvas is empty</div>
            <p className="text-neutral-400 text-xs mb-5">
              Generate a board from your GTM strategy, or add nodes manually to build your campaign map.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={generateBoard}
                className="btn-accent flex items-center gap-2 px-4 py-2 text-sm"
              >
                <Wand2 size={13} /> Generate from strategy
              </button>
              <button
                onClick={() => addNode('root')}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl border border-neutral-200 text-neutral-500 hover:text-neutral-700 transition-all"
              >
                <Plus size={13} /> Start from scratch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generating overlay */}
      {generating && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/30 backdrop-blur-sm" style={{ top: 60 }}>
          <div className="glass p-8 text-center">
            <Loader2 size={28} className="animate-spin text-neutral-400 mx-auto mb-3" />
            <div className="text-neutral-500 text-sm">Building your campaign map...</div>
            <div className="text-neutral-400 text-xs mt-1">10–15 seconds</div>
          </div>
        </div>
      )}

      {/* React Flow Canvas */}
      <div className="flex-1" style={{ background: '#F5F5F7' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDoubleClick={onNodeDoubleClick}
          nodeTypes={NODE_TYPES}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          defaultEdgeOptions={{
            style: { stroke: 'rgba(0,0,0,0.12)', strokeWidth: 1.5 },
          }}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            color="rgba(0,0,0,0.10)"
            gap={24}
            size={1}
          />
          <Controls
            style={{
              background: 'rgba(255,255,255,0.80)',
              border: '1px solid rgba(0,0,0,0.10)',
              borderRadius: 10,
            }}
          />
          <MiniMap
            style={{
              background: 'rgba(255,255,255,0.70)',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 10,
            }}
            nodeColor="rgba(0,0,0,0.15)"
          />
        </ReactFlow>
      </div>

      {/* Edit node modal */}
      <EditNodeModal
        node={editNode}
        onClose={() => setEditNode(null)}
        onSave={handleSaveNode}
        onDelete={handleDeleteNode}
      />
    </div>
  )
}
