'use client'

import { Handle, Position, NodeProps } from 'reactflow'

const TYPE_STYLES: Record<string, { border: string; bg: string; labelColor: string; dot: string }> = {
  root:    { border: 'rgba(255,255,255,0.30)', bg: 'rgba(255,255,255,0.10)', labelColor: 'rgba(255,255,255,0.95)', dot: '#fff' },
  icp:     { border: 'rgba(255,255,255,0.18)', bg: 'rgba(255,255,255,0.06)', labelColor: 'rgba(255,255,255,0.85)', dot: 'rgba(255,255,255,0.6)' },
  channel: { border: 'rgba(255,255,255,0.18)', bg: 'rgba(255,255,255,0.06)', labelColor: 'rgba(255,255,255,0.85)', dot: 'rgba(255,255,255,0.5)' },
  tactic:  { border: 'rgba(255,255,255,0.10)', bg: 'rgba(255,255,255,0.03)', labelColor: 'rgba(255,255,255,0.65)', dot: 'rgba(255,255,255,0.3)' },
  content: { border: 'rgba(255,255,255,0.10)', bg: 'rgba(255,255,255,0.03)', labelColor: 'rgba(255,255,255,0.65)', dot: 'rgba(255,255,255,0.3)' },
  goal:    { border: 'rgba(255,255,255,0.25)', bg: 'rgba(255,255,255,0.08)', labelColor: 'rgba(255,255,255,0.90)', dot: 'rgba(255,255,255,0.7)' },
}

const TYPE_BADGE: Record<string, string> = {
  root: 'Strategy', icp: 'ICP', channel: 'Channel',
  tactic: 'Tactic', content: 'Content', goal: 'Goal',
}

function BaseNode({ data, type, selected }: NodeProps & { type: string }) {
  const style = TYPE_STYLES[type] ?? TYPE_STYLES.tactic

  return (
    <div
      style={{
        background: style.bg,
        border: `1px solid ${selected ? 'rgba(255,255,255,0.45)' : style.border}`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 14,
        padding: '12px 16px',
        minWidth: 180,
        maxWidth: 240,
        boxShadow: selected
          ? '0 0 0 2px rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.4)'
          : '0 4px 24px rgba(0,0,0,0.35)',
        transition: 'all 0.15s ease',
        cursor: 'grab',
      }}
    >
      <Handle type="target" position={Position.Top}
        style={{ background: style.dot, border: 'none', width: 8, height: 8, top: -4 }} />

      {/* Badge */}
      <div style={{
        fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
        color: 'rgba(255,255,255,0.30)', marginBottom: 6,
      }}>
        {TYPE_BADGE[type] ?? type}
      </div>

      {/* Label */}
      <div style={{ color: style.labelColor, fontSize: 13, fontWeight: 600, lineHeight: 1.3, marginBottom: 4 }}>
        {data.label}
      </div>

      {/* Subtitle */}
      {data.subtitle && (
        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, lineHeight: 1.4 }}>
          {data.subtitle}
        </div>
      )}

      <Handle type="source" position={Position.Bottom}
        style={{ background: style.dot, border: 'none', width: 8, height: 8, bottom: -4 }} />
    </div>
  )
}

export const RootNode = (props: NodeProps) => <BaseNode {...props} type="root" />
export const IcpNode = (props: NodeProps) => <BaseNode {...props} type="icp" />
export const ChannelNode = (props: NodeProps) => <BaseNode {...props} type="channel" />
export const TacticNode = (props: NodeProps) => <BaseNode {...props} type="tactic" />
export const ContentNode = (props: NodeProps) => <BaseNode {...props} type="content" />
export const GoalNode = (props: NodeProps) => <BaseNode {...props} type="goal" />

export const NODE_TYPES = {
  root: RootNode,
  icp: IcpNode,
  channel: ChannelNode,
  tactic: TacticNode,
  content: ContentNode,
  goal: GoalNode,
}
