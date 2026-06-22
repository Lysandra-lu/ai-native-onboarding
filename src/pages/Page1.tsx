import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { AccordionPanel } from '@/components/AccordionPanel'
import {
  TOOL_CARDS, ACTION_CARDS, STEP_TOOL_MAP, TOOL_META,
  SCENE2_AGENTS, SCENE2_ROLES,
  type AppState, type WorkflowCard, type AgentDef, type Identity,
} from '@/lib/types'
import { ArrowRight, Trash2, GripVertical, ChevronRight, User, Sparkles, Check, AlertCircle, Zap } from 'lucide-react'

// --- AI 头像组件 ---
function AIAvatar({ emoji, color, size = 'md', pulse = false }: { emoji: string; color: string; size?: 'sm' | 'md' | 'lg'; pulse?: boolean }) {
  const sizeClass = size === 'sm' ? 'w-8 h-8 text-sm' : size === 'lg' ? 'w-14 h-14 text-xl' : 'w-10 h-10 text-base'
  return (
    <motion.div
      className={`${sizeClass} rounded-full flex items-center justify-center border-2`}
      style={{ borderColor: color, backgroundColor: `${color}15` }}
      animate={pulse ? { boxShadow: [`0 0 0px ${color}00`, `0 0 12px ${color}40`, `0 0 0px ${color}00`] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {emoji}
    </motion.div>
  )
}

// --- 工作流步骤卡片（仅动作卡片可拖拽）---
function StepCard({ card, onDelete, compact, draggable = true, showTools = false }: { card: WorkflowCard; onDelete?: () => void; compact?: boolean; draggable?: boolean; showTools?: boolean }) {
  const isAction = card.type === 'action'
  const isTool = card.type === 'tool'
  const bg = isTool ? 'bg-purple-500/5 border-purple-500/15' : 'bg-cyan-500/10 border-cyan-500/30'
  const text = isTool ? 'text-purple-300/70' : 'text-cyan-200'
  const tagText = isTool ? '参考工具' : '步骤'
  const tools = isAction ? STEP_TOOL_MAP[card.id] || [] : []

  const handleDragStart = (e: React.DragEvent) => {
    if (!draggable) {
      e.preventDefault()
      return
    }
    e.dataTransfer.setData('cardId', card.id)
    e.dataTransfer.effectAllowed = 'move'
    const el = e.currentTarget as HTMLElement
    el.style.opacity = '0.5'
  }

  return (
    <div
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.opacity = '1'
      }}
      className={`border rounded-xl px-3 py-2.5 transition-all hover:shadow-md group ${bg} ${compact ? 'text-xs' : ''} ${draggable ? 'cursor-grab active:cursor-grabbing active:scale-95' : 'cursor-default opacity-60'}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {draggable && <GripVertical size={compact ? 12 : 14} className="opacity-40 flex-shrink-0" />}
          {!draggable && <span className="text-[10px] opacity-30 flex-shrink-0">🔧</span>}
          <span className={`${text} font-medium truncate`}>{card.label}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${bg} ${text} opacity-70`}>
            {tagText}
          </span>
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete() }}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-odyssey-muted hover:text-red-400"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
      {!draggable && card.description && (
        <p className="text-[10px] text-odyssey-muted/50 mt-1 leading-tight">{card.description}</p>
      )}
      {/* 推荐工具 */}
      {showTools && tools.length > 0 && (
        <div className="mt-2 pt-2 border-t border-purple-500/15">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] text-purple-400/60 font-medium tracking-wide">推荐工具</span>
            {tools.map(tId => {
              const meta = TOOL_META[tId]
              if (!meta) return null
              return (
                <span
                  key={tId}
                  className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-purple-500/8 border border-purple-500/20 text-purple-300"
                  title={meta.short}
                >
                  <span>{meta.emoji}</span>
                  <span className="text-purple-300/70">{meta.short}</span>
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// --- Agent 选择卡片 ---
function AgentSelectCard({
  agent, selected, disabled, onClick,
}: {
  agent: AgentDef; selected: boolean; disabled: boolean; onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled && !selected}
      className={`w-full relative border rounded-xl p-3 text-left transition-all min-h-[80px] ${
        selected
          ? 'border-odyssey-accent bg-odyssey-accent/10 shadow-lg shadow-odyssey-accent/10'
          : disabled
            ? 'border-odyssey-border/40 bg-odyssey-surface/20 opacity-40 cursor-not-allowed'
            : 'border-odyssey-border bg-odyssey-surface hover:border-odyssey-accent/40 cursor-pointer'
      }`}
    >
      {selected && (
        <div className="absolute top-2 right-2">
          <Check size={14} className="text-odyssey-accent-glow" />
        </div>
      )}
      <div className="flex items-center gap-3">
        <AIAvatar emoji={agent.emoji} color={agent.color} size="sm" pulse={selected} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-odyssey-text">{agent.name}</div>
          <div className="text-xs text-odyssey-muted truncate">{agent.ability}</div>
        </div>
        <div className="w-8 text-right flex-shrink-0">
          <span className={`text-xs font-bold ${selected ? 'text-odyssey-accent-glow' : disabled ? 'text-odyssey-muted' : 'text-odyssey-muted'}`}>
            {agent.cost}点
          </span>
        </div>
      </div>
      {disabled && (
        <div className="text-[9px] text-odyssey-muted/30 mt-1 text-center">预算已用尽</div>
      )}
    </motion.button>
  )
}

// ==================== Page1 主组件 ====================
interface Props {
  state: AppState
  onCompleteScene1: (workflow: string[]) => void
  onCompleteScene2: (agents: string[], roles: Record<string, string>, reason: string) => void
  onSetNextAction: (action: 'A' | 'B' | 'C' | 'D') => void
  onNavigate: (page: 'page1' | 'page2' | 'page3', node: any) => void
}

type Scene = 'intro' | 'scene1' | 'scene1-feedback' | 'scene2' | 'scene2-feedback' | 'result'

export function Page1({ state, onCompleteScene1, onCompleteScene2, onSetNextAction, onNavigate }: Props) {
  const [scene, setScene] = useState<Scene>(state.scene1Complete ? (state.scene2Complete ? 'result' : 'scene2') : 'scene1')

  // 场景一状态
  const [workflow, setWorkflow] = useState<string[]>(state.p1Scene1Workflow)
  const [activeTab, setActiveTab] = useState<'tool' | 'action'>('action')
  const [dragOver, setDragOver] = useState(false)

  // 场景二状态
  const [selectedAgents, setSelectedAgents] = useState<string[]>(state.p1Scene2Agents)
  const [agentRoles, setAgentRoles] = useState<Record<string, string>>(state.p1Scene2Roles || {})
  const [reason, setReason] = useState(state.p1Scene2Reason)

  // 场景一反馈
  const [nextAction, setNextAction] = useState<'A' | 'B' | 'C' | 'D' | null>(state.p1Scene1NextAction)
  const [showScene1Feedback, setShowScene1Feedback] = useState(false)

  const budget = 6
  const usedBudget = selectedAgents.reduce((sum, id) => {
    const agent = SCENE2_AGENTS.find(a => a.id === id)
    return sum + (agent?.cost || 0)
  }, 0)
  const overBudget = usedBudget > budget

  // 拖拽处理 — 仅接受动作卡片
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const cardId = e.dataTransfer.getData('cardId')
    if (!cardId || workflow.includes(cardId)) return
    // 只接受动作卡片
    const card = ACTION_CARDS.find(c => c.id === cardId)
    if (!card) return
    if (workflow.length >= 7) return
    setWorkflow(prev => [...prev, cardId])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const removeFromWorkflow = (id: string) => {
    setWorkflow(prev => prev.filter(c => c !== id))
  }

  const getCardLabel = (id: string) => {
    return ACTION_CARDS.find(c => c.id === id)?.label || id
  }
  const getCard = (id: string): WorkflowCard | undefined => {
    return ACTION_CARDS.find(c => c.id === id)
  }

  // 场景一完成
  const handleScene1Complete = () => {
    if (workflow.length < 4) return
    onCompleteScene1(workflow)
    setShowScene1Feedback(true)
  }

  const handleScene1Next = () => {
    if (!nextAction) return
    onSetNextAction(nextAction)
    setScene('scene2')
  }

  // 场景二 Agent 选择
  const toggleAgent = (agentId: string) => {
    setSelectedAgents(prev => {
      if (prev.includes(agentId)) {
        const next = prev.filter(id => id !== agentId)
        setAgentRoles(roles => {
          const r = { ...roles }
          delete r[agentId]
          return r
        })
        return next
      }
      // Check budget
      const agent = SCENE2_AGENTS.find(a => a.id === agentId)
      const currentCost = prev.reduce((s, id) => s + (SCENE2_AGENTS.find(a => a.id === id)?.cost || 0), 0)
      if (agent && currentCost + agent.cost > budget) return prev
      return [...prev, agentId]
    })
  }

  // 自动推荐职责
  const getRecommendedRole = (agentId: string): string => {
    const map: Record<string, string> = {
      'data-ai': '定位异常用户群',
      'cs-ai': '分析用户反馈',
      'product-ai': '检查产品路径变化',
      'eng-ai': '排查技术风险',
      'competitor-ai': '提出初步假设',
      'review-ai': '生成分析摘要',
    }
    return map[agentId] || '提出初步假设'
  }

  // 场景二完成
  const handleScene2Complete = () => {
    if (selectedAgents.length === 0) return
    // Auto-assign roles
    const roles: Record<string, string> = { ...agentRoles }
    selectedAgents.forEach(id => {
      if (!roles[id]) {
        roles[id] = getRecommendedRole(id)
      }
    })
    onCompleteScene2(selectedAgents, roles, reason)
    setScene('result')
  }

  const identityInfo: Record<Identity, { emoji: string; desc: string; nextHint: string }> = {
    '快速执行型新人': {
      emoji: '⚡',
      desc: '你倾向于快速调用 AI 完成任务，交付意识较强。接下来可以练习如何拆解任务、验证信息质量，并将一次性工作沉淀为可复用流程。',
      nextHint: '在后续实战中，你会逐渐学习如何把任务拆解成多个步骤，并让 AI 协作更高效。',
    },
    '工作流设计型新人': {
      emoji: '🔧',
      desc: '你已经开始用流程化方式组织 AI 工具，能够把任务拆成多个步骤。接下来可以进一步练习如何在复杂业务问题中协调多个 Agent。',
      nextHint: '你已经具备基础的 AI 工具编排意识。接下来，你将面对 Agent 结论冲突、工程资源有限和组织决策压力。',
    },
    'Agent协作型新人': {
      emoji: '🤝',
      desc: '你能够理解不同 AI 的职责边界，并尝试根据问题配置 Agent 小队。接下来可以在真实业务冲突中练习如何处理 Agent 结论不一致。',
      nextHint: '你的 Agent 协作意识已经展现出来。接下来你将面对更复杂的组织约束和决策场景。',
    },
    '组织沉淀型新人': {
      emoji: '🏗️',
      desc: '你不仅关注完成任务，也开始考虑如何保存流程、复用模板，并让团队共享你的方法。接下来你将训练如何把一次复盘沉淀为组织可复用的 Agent。',
      nextHint: '你的沉淀意识让你在 AI Native 组织中走得更远。接下来你将面对真实版本复盘实战。',
    },
  }

  const identity = state.p1Identity
  const info = identity ? identityInfo[identity] : null

  // ==================== 渲染 ====================
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          {/* --- 场景一 --- */}
          {scene === 'scene1' && (
            <motion.div key="scene1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* 顶部任务描述 */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-odyssey-text mb-2">场景一：竞品动态周报工作流</h1>
                <p className="text-sm text-odyssey-muted">
                  每周三上午，运营团队都需要提交一份《竞品动态周报》。请设计一个完成这份周报的 AI 工作流。
                </p>
              </div>

              {/* 折叠说明 */}
              <div className="mb-4 max-w-md mx-auto">
                <AccordionPanel title="这个任务在训练什么？">
                  <p>通过搭建周报工作流，观察你是否能将重复性运营任务拆解成可复用的 AI 工作流。重点关注：任务拆解能力、工具协作设计、信息质量意识和沉淀复用意识。</p>
                </AccordionPanel>
              </div>

              <div className="grid grid-cols-12 gap-4">
                {/* 左侧：资源池 */}
                <div className="col-span-3">
                  <div className="bg-odyssey-surface/60 border border-odyssey-border rounded-xl p-3 sticky top-4">
                    <div className="flex border-b border-odyssey-border mb-3">
                      <button
                        onClick={() => setActiveTab('action')}
                        className={`flex-1 pb-2 text-xs font-medium transition-colors ${
                          activeTab === 'action' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-odyssey-muted'
                        }`}
                      >
                        流程步骤
                      </button>
                      <button
                        onClick={() => setActiveTab('tool')}
                        className={`flex-1 pb-2 text-xs font-medium transition-colors ${
                          activeTab === 'tool' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-odyssey-muted'
                        }`}
                      >
                        可用工具
                      </button>
                    </div>

                    <AccordionPanel title="查看卡片说明">
                      <div className="space-y-2 text-xs">
                        <p><span className="text-cyan-400 font-medium">流程步骤</span> — 拖拽到中间轨道，搭建你的工作流。拖拽至少 4 张（最多 7 张）。</p>
                        <p><span className="text-purple-400 font-medium">可用工具</span> — 参考工具，帮助你了解每种步骤可以搭配什么 AI 能力，不需要拖入工作流。</p>
                      </div>
                    </AccordionPanel>

                    <div className="mt-3 space-y-1.5 max-h-[380px] overflow-y-auto">
                      {activeTab === 'action' ? (
                        <>
                          <p className="text-xs text-odyssey-muted mb-2">拖拽步骤到轨道中（不需要全选，选最重要的流程步骤即可）</p>
                          {ACTION_CARDS.map(card => (
                            <StepCard key={card.id} card={card} compact draggable />
                          ))}
                        </>
                      ) : (
                        <>
                          <p className="text-xs text-odyssey-muted mb-2">这些工具可以在步骤中辅助使用（仅供参考，不需要拖拽）</p>
                          {TOOL_CARDS.map(card => (
                            <StepCard key={card.id} card={card} compact draggable={false} />
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* 中间：工作流轨道 */}
                <div
                  className="col-span-5"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <div className={`border-2 rounded-xl min-h-[420px] p-4 transition-all duration-200 ${
                    dragOver
                      ? 'drop-zone-active'
                      : workflow.length === 0
                        ? 'border-dashed border-odyssey-border/50 bg-odyssey-surface/20'
                        : 'border-odyssey-border bg-odyssey-surface/40'
                  }`}>
                    <div className="text-center mb-3">
                      <span className="text-xs text-odyssey-muted/60">
                        {workflow.length === 0 ? '将步骤卡片拖到这里' : `已选 ${workflow.length} 步`}
                      </span>
                      <p className="text-xs text-odyssey-muted mt-0.5">
                        你不需要选择所有步骤，请选择你认为本次任务最重要的流程
                      </p>
                    </div>

                    <div className="space-y-2">
                      {workflow.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-odyssey-muted/30">
                          <GripVertical size={32} className="mb-2" />
                          <p className="text-sm">将左侧卡片拖到这里搭建流程</p>
                          <p className="text-xs mt-1">至少需要 4 张卡片</p>
                        </div>
                      )}

                      <AnimatePresence>
                        {workflow.map((id, idx) => {
                          const card = getCard(id)
                          if (!card) return null
                          return (
                            <motion.div
                              key={`${id}-${idx}`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center gap-2"
                            >
                              <span className="text-xs text-odyssey-muted/40 w-6 text-right font-mono">
                                {idx + 1}
                              </span>
                              <div className="flex-1">
                                <StepCard card={card} onDelete={() => removeFromWorkflow(id)} draggable showTools />
                              </div>
                              {idx < workflow.length - 1 && (
                                <div className="absolute left-8 w-0.5 h-6 bg-odyssey-accent/20 translate-y-8" />
                              )}
                            </motion.div>
                          )
                        })}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <Button
                      variant="accent"
                      size="md"
                      disabled={workflow.length < 4}
                      onClick={handleScene1Complete}
                    >
                      完成工作流 (已选 {workflow.length} 步，建议 4-7 步)
                    </Button>
                  </div>
                </div>

                {/* 右侧：流程预览 */}
                <div className="col-span-4">
                  <div className="bg-odyssey-surface/60 border border-odyssey-border rounded-xl p-4 sticky top-4">
                    <h3 className="text-sm font-semibold text-odyssey-text mb-3 flex items-center gap-2">
                      <Sparkles size={14} className="text-odyssey-accent-glow" />
                      我的竞品周报流程
                    </h3>
                    {workflow.length === 0 ? (
                      <p className="text-xs text-odyssey-muted/50">拖拽卡片后这里会实时展示你的流程</p>
                    ) : (
                      <ol className="space-y-2">
                        {workflow.map((id, idx) => (
                          <li key={id} className="flex items-start gap-2 text-sm">
                            <span className="text-odyssey-accent-glow font-bold flex-shrink-0">{idx + 1}.</span>
                            <span className="text-odyssey-text">{getCardLabel(id)}</span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* --- 场景一反馈 --- */}
          {scene === 'scene1' && showScene1Feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
              <div className="bg-odyssey-surface border border-odyssey-border rounded-2xl p-6 max-w-md mx-4 shadow-2xl">
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">✅</div>
                  <p className="text-sm text-odyssey-muted leading-relaxed">
                    任务完成。我们观察到你更倾向于「工作流设计型」协作方式：
                    你没有直接让 AI 生成报告，而是先拆解信息来源、处理过程和输出结构。
                  </p>
                </div>

                <p className="text-sm font-medium text-odyssey-text mb-3">接下来，你会如何处理这套流程？</p>

                <div className="space-y-2">
                  {([
                    { key: 'A' as const, label: '直接提交报告，等待下次任务再重新处理' },
                    { key: 'B' as const, label: '简单记录本次用到的工具，方便下次参考' },
                    { key: 'C' as const, label: '保存为每周竞品报告模板，后续持续复用' },
                    { key: 'D' as const, label: '分享给同组运营同学，让团队一起复用' },
                  ]).map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setNextAction(opt.key)}
                      className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                        nextAction === opt.key
                          ? 'border-odyssey-accent bg-odyssey-accent/10 text-odyssey-text'
                          : 'border-odyssey-border hover:border-odyssey-accent/40 text-odyssey-muted hover:text-odyssey-text'
                      }`}
                    >
                      <span className="font-bold text-odyssey-accent-glow mr-2">{opt.key}.</span>
                      {opt.label}
                    </button>
                  ))}
                </div>

                <Button
                  variant="accent"
                  size="md"
                  className="w-full mt-4"
                  disabled={!nextAction}
                  onClick={handleScene1Next}
                >
                  继续
                  <ChevronRight size={16} />
                </Button>
              </div>
            </motion.div>
          )}

          {/* --- 场景二 --- */}
          {scene === 'scene2' && (
            <motion.div key="scene2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-odyssey-text mb-2">场景二：留存下降 Agent 分工</h1>
                <p className="text-sm text-odyssey-muted">
                  紧急任务：V2.3 版本上线后，用户次日留存下降 5%。请组建你的初步分析小队。
                </p>
              </div>

              <div className="mb-4 max-w-md mx-auto">
                <AccordionPanel title="这个任务在训练什么？">
                  <p>观察你是否理解复杂业务问题需要多个 Agent 协作，以及是否能在有限预算下合理分配 AI 职责。</p>
                </AccordionPanel>
              </div>

              {/* 预算条 */}
              <div className="bg-odyssey-surface/60 border border-odyssey-border rounded-xl p-4 mb-4 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-odyssey-muted">AI 调用预算</span>
                  <span className={`text-sm font-bold ${overBudget ? 'text-red-400' : 'text-odyssey-accent-glow'}`}>
                    {usedBudget} / {budget} 点
                  </span>
                </div>
                <div className="h-2 bg-odyssey-border rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${overBudget ? 'bg-red-500' : 'bg-odyssey-accent'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((usedBudget / budget) * 100, 100)}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                {overBudget && (
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                    <AlertCircle size={12} /> 预算不足，请重新配置你的 AI 小队
                  </p>
                )}
                <p className="text-xs text-odyssey-muted/60 mt-2">
                  预算有限，你不需要找出完整答案，只需要组建一个"第一轮分析小队"。
                </p>
              </div>

              <div className="grid grid-cols-12 gap-4">
                {/* 左侧：Agent 资源 */}
                <div className="col-span-5">
                  <h3 className="text-sm font-semibold text-odyssey-text mb-3 flex items-center gap-2">
                    <User size={14} className="text-odyssey-accent-glow" />
                    AI 资源池
                  </h3>
                  <div className="space-y-2">
                    {SCENE2_AGENTS.map(agent => (
                      <AgentSelectCard
                        key={agent.id}
                        agent={agent}
                        selected={selectedAgents.includes(agent.id)}
                        disabled={overBudget && !selectedAgents.includes(agent.id)}
                        onClick={() => toggleAgent(agent.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* 右侧：我的 Agent 小队 */}
                <div className="col-span-7">
                  <h3 className="text-sm font-semibold text-odyssey-text mb-3 flex items-center gap-2">
                    <Zap size={14} className="text-odyssey-accent-glow" />
                    我的 Agent 小队
                    {selectedAgents.length > 0 && (
                      <span className="text-xs text-odyssey-muted">({selectedAgents.length} 人)</span>
                    )}
                  </h3>

                  {selectedAgents.length === 0 ? (
                    <div className="border border-dashed border-odyssey-border/50 rounded-xl p-8 text-center">
                      <User size={32} className="mx-auto mb-2 text-odyssey-muted/30" />
                      <p className="text-sm text-odyssey-muted/50">点击左侧 Agent 加入你的小队</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedAgents.map(id => {
                        const agent = SCENE2_AGENTS.find(a => a.id === id)
                        if (!agent) return null
                        const currentRole = agentRoles[id] || getRecommendedRole(id)
                        return (
                          <motion.div
                            key={id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border border-odyssey-border bg-odyssey-surface/60 rounded-xl p-3"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <AIAvatar emoji={agent.emoji} color={agent.color} size="sm" />
                              <div>
                                <div className="text-sm font-medium text-odyssey-text">{agent.name}</div>
                                <div className="text-xs text-odyssey-muted">成本 {agent.cost} 点</div>
                              </div>
                              <button
                                onClick={() => toggleAgent(id)}
                                className="ml-auto text-odyssey-muted hover:text-red-400 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            {/* 职责选择 */}
                            <div className="flex flex-wrap gap-1.5">
                              {SCENE2_ROLES.map(role => (
                                <button
                                  key={role}
                                  onClick={() => setAgentRoles(prev => ({ ...prev, [id]: role }))}
                                  className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                                    currentRole === role
                                      ? 'bg-odyssey-accent/20 text-odyssey-accent-glow border border-odyssey-accent/40'
                                      : 'bg-odyssey-bg text-odyssey-muted border border-odyssey-border hover:border-odyssey-accent/30'
                                  }`}
                                >
                                  {role}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}

                  {/* 一句话理由 — 选填 */}
                  {selectedAgents.length > 0 && (
                    <div className="mt-4">
                      <label className="text-[10px] text-odyssey-muted/50 mb-1 block">可选：一句话说明你为什么这样安排</label>
                      <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="不写也没关系，直接进入下一步"
                        className="w-full bg-odyssey-bg border border-odyssey-border rounded-xl px-4 py-3 text-sm text-odyssey-text placeholder:text-odyssey-muted/50 focus:outline-none focus:border-odyssey-accent/50 transition-colors"
                      />
                    </div>
                  )}

                  <div className="mt-4">
                    <Button
                      variant="accent"
                      size="md"
                      disabled={selectedAgents.length === 0 || overBudget}
                      onClick={handleScene2Complete}
                      className="w-full"
                    >
                      完成 Agent 分工
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* --- 结果页 --- */}
          {scene === 'result' && identity && info && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto mt-12"
            >
              <div className="bg-odyssey-surface border border-odyssey-border rounded-2xl p-8 text-center shadow-2xl shadow-odyssey-accent/5">
                <div className="text-5xl mb-4">{info.emoji}</div>
                <h2 className="text-xl font-bold text-odyssey-text mb-1">
                  你的初始 AI Native 身份
                </h2>
                <div className="inline-block bg-odyssey-accent/10 border border-odyssey-accent/30 rounded-full px-4 py-1.5 mt-2 mb-4">
                  <span className="text-odyssey-accent-glow font-bold text-lg">{identity}</span>
                </div>
                <p className="text-sm text-odyssey-muted leading-relaxed mb-4">
                  {info.desc}
                </p>

                <AccordionPanel title="查看详细分析">
                  <div className="text-xs space-y-2">
                    <p>{info.nextHint}</p>
                    <p className="text-odyssey-muted/60">
                      这个身份基于你在两个场景中的协作行为：工作流设计方式、工具组合选择、Agent 分工策略和沉淀复用意识。
                    </p>
                  </div>
                </AccordionPanel>

                <p className="text-xs text-odyssey-muted/60 mt-4 mb-2">
                  你已经能把重复任务拆成流程。接下来，你将面对更复杂的挑战：当多个 AI 给出不一致判断时，你如何推动一次版本复盘？
                </p>
                <Button
                  variant="accent"
                  size="lg"
                  className="mt-4"
                  onClick={() => onNavigate('page2', 'collaborate')}
                >
                  开始第一次版本复盘
                  <ArrowRight size={18} />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
