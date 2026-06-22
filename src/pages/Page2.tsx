import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { AccordionPanel } from '@/components/AccordionPanel'
import {
  PAGE2_AGENTS, PAGE2_CONCLUSIONS, HYPOTHESIS_OPTIONS, STRATEGY_CARDS, STRATEGY_LABELS,
  REVIEW_TRIGGERS, REVIEW_FLOW_STEPS, CONFLICT_PRINCIPLES, OUTPUT_TEMPLATES,
  TENSION_SIGNALS, getTeamStyle, type AppState, type AgentDef, type JourneyNode,
} from '@/lib/types'
import {
  ArrowRight, User, Zap, AlertTriangle, Clock, Wrench, Target,
  Check, ChevronRight, Save, Share2, Layers, GripVertical, Trash2, Lightbulb, Info,
} from 'lucide-react'

// --- AI 头像 ---
function AIAvatar({ emoji, color, size = 'md', pulse = false }: { emoji: string; color: string; size?: 'sm' | 'md' | 'lg'; pulse?: boolean }) {
  const sizeClass = size === 'sm' ? 'w-8 h-8 text-sm' : size === 'lg' ? 'w-14 h-14 text-xl' : 'w-10 h-10 text-base'
  return (
    <motion.div
      className={`${sizeClass} rounded-full flex items-center justify-center border-2 flex-shrink-0`}
      style={{ borderColor: color, backgroundColor: `${color}15` }}
      animate={pulse ? { boxShadow: [`0 0 0px ${color}00`, `0 0 12px ${color}40`, `0 0 0px ${color}00`] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {emoji}
    </motion.div>
  )
}

// --- Agent 选择卡片 ---
function AgentCard({
  agent, selected, disabled, onClick, compact,
}: {
  agent: AgentDef; selected: boolean; disabled: boolean; onClick: () => void; compact?: boolean;
}) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled && !selected}
      className={`relative border rounded-xl p-3 text-left transition-all w-full min-h-[80px] ${
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
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-odyssey-text">{agent.name}</div>
          <div className="text-xs text-odyssey-muted truncate">{agent.ability}</div>
        </div>
        <div className="w-8 text-right flex-shrink-0">
          <span className={`text-xs font-bold ${selected ? 'text-odyssey-accent-glow' : 'text-odyssey-muted'}`}>
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

// --- 小标签 ---
function Tag({ children, color = 'default' }: { children: string; color?: 'default' | 'red' | 'green' | 'yellow' | 'purple' }) {
  const colors = {
    default: 'bg-odyssey-surface text-odyssey-muted border-odyssey-border',
    red: 'bg-red-500/10 text-red-400 border-red-500/30',
    green: 'bg-green-500/10 text-green-400 border-green-500/30',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  }
  return (
    <span className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[10px] font-medium ${colors[color]}`}>
      {children}
    </span>
  )
}

// ==================== Page2 主组件 ====================
interface Props {
  state: AppState
  onUpdate: (partial: Partial<AppState>) => void
  onNavigate: (page: 'page1' | 'page2' | 'page3', node: JourneyNode) => void
}

type SubTask = 1 | 2 | 3

export function Page2({ state, onUpdate, onNavigate }: Props) {
  const [subTask, setSubTask] = useState<SubTask>(1)
  const [showTaskComplete, setShowTaskComplete] = useState(false)

  // 子任务一
  const [agents, setAgents] = useState<string[]>(state.p2Task1Agents)
  const [roles, setRoles] = useState<Record<string, string>>(state.p2Task1Roles || {})
  const [reason, setReason] = useState(state.p2Task1Reason)
  const budget = 8
  const usedBudget = agents.reduce((sum, id) => sum + (PAGE2_AGENTS.find(a => a.id === id)?.cost || 0), 0)

  // 子任务二
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([])
  const [hypothesis, setHypothesis] = useState<string | null>(state.p2Task2Hypothesis)
  const [action, setAction] = useState<string | null>(state.p2Task2Action)
  const [decisionReason, setDecisionReason] = useState(state.p2Task2Reason)
  const [showConflictFeedback, setShowConflictFeedback] = useState(false)
  const [conflictDone, setConflictDone] = useState(false)

  const toggleEvidence = (agentId: string) => {
    setSelectedEvidence(prev => {
      if (prev.includes(agentId)) return prev.filter(id => id !== agentId)
      if (prev.length >= 2) return prev
      return [...prev, agentId]
    })
  }

  // 子任务三
  const [agentName, setAgentName] = useState(state.p2Task3Name || '《V2.3 版本复盘 Agent》')
  const [triggers, setTriggers] = useState<string[]>(state.p2Task3Triggers)
  const [flow, setFlow] = useState<string[]>(state.p2Task3Flow)
  const [principles, setPrinciples] = useState<string[]>(state.p2Task3Principles)
  const [template, setTemplate] = useState<string[]>(state.p2Task3Template)
  const [agentSaved, setAgentSaved] = useState(false)

  const hasEngAgent = state.p2Task1Agents.includes('eng-ai')

  // 自动推荐职责
  const getRecommendedRole = (agentId: string): string => {
    const map: Record<string, string> = {
      'data-ai': '定位异常人群和留存分群',
      'feedback-ai': '整理用户负面反馈和渠道抱怨',
      'product-ai': '分析新版本产品路径和体验变化',
      'eng-ai': '排查性能、Bug 和埋点异常',
      'competitor-ai': '对比竞品同期变化',
      'review-ai': '汇总分析结果和生成报告',
    }
    return map[agentId] || '参与分析'
  }

  const toggleAgent = (id: string) => {
    setAgents(prev => {
      if (prev.includes(id)) {
        setRoles(r => { const n = { ...r }; delete n[id]; return n })
        return prev.filter(a => a !== id)
      }
      const agent = PAGE2_AGENTS.find(a => a.id === id)
      const currentCost = prev.reduce((s, a) => s + (PAGE2_AGENTS.find(ag => ag.id === a)?.cost || 0), 0)
      if (agent && currentCost + agent.cost > budget) return prev
      return [...prev, id]
    })
  }

  // 子任务一完成
  const handleTask1Complete = () => {
    if (agents.length === 0) return
    const finalRoles: Record<string, string> = { ...roles }
    agents.forEach(id => {
      if (!finalRoles[id]) finalRoles[id] = getRecommendedRole(id)
    })
    onUpdate({ p2Task1Agents: agents, p2Task1Roles: finalRoles, p2Task1Reason: reason })
    setRoles(finalRoles)
    setSubTask(2)
    onUpdate({ currentNode: 'decide' })
  }

  // 子任务二完成
  const handleConflictComplete = () => {
    if (!hypothesis || !action) return
    onUpdate({
      p2Task2Evidence: selectedEvidence,
      p2Task2Hypothesis: hypothesis,
      p2Task2Action: action,
      p2Task2Reason: decisionReason,
    })
    setShowConflictFeedback(true)
    setConflictDone(true)
  }

  const handleTask2Next = () => {
    setSubTask(3)
    setShowConflictFeedback(false)
    onUpdate({ currentNode: 'solidify' })
  }

  // 子任务三完成 — 需要至少配置一些内容
  const task3Configured = triggers.length >= 1 || principles.length >= 1 || template.length >= 1

  const handleSaveAgent = () => {
    if (!task3Configured) return
    const finalFlow = flow.length > 0 ? flow : [...REVIEW_FLOW_STEPS]
    onUpdate({
      p2Task3Name: agentName,
      p2Task3Triggers: triggers,
      p2Task3Flow: finalFlow,
      p2Task3Principles: principles,
      p2Task3Template: template,
      page2Complete: true,
    })
    setAgentSaved(true)
  }

  // 继承决策 — 保存后展示哪些决策被继承了
  const inheritedDecisions: string[] = []
  if (hypothesis && hypothesis !== 'wait-data') {
    inheritedDecisions.push(`优先验证「${HYPOTHESIS_OPTIONS.find(h => h.id === hypothesis)?.label}」`)
  }
  if (hypothesis === 'wait-data' || action === 'wait') {
    inheritedDecisions.push('在证据不充分时选择不急于判断')
  } else if (action) {
    const strategy = STRATEGY_CARDS.find(s => s.id === action)
    if (strategy) inheritedDecisions.push(`采用「${strategy.label.split('：')[0]}」作为第一步策略`)
  }
  if (hypothesis && hypothesis !== 'feedback-rep') {
    inheritedDecisions.push('在冲突中采用「先建假设再验证」的判断方式')
  }

  const handleGoToPage3 = () => {
    onNavigate('page3', 'diffuse')
  }

  // 生成冲突反馈
  const getConflictFeedback = () => {
    if (hypothesis === 'entry-change' && action === 'combined') {
      return {
        title: '组合决策型',
        text: '你没有急于推动回滚，而是选择了「小范围运营干预 + 工程低成本排查 + 数据分群监控」的组合方案。这个决策兼顾了短期止损和长期验证，比较符合新员工在组织资源有限情况下的推进方式。不过，你还可以进一步明确需要产品团队配合确认的入口变化影响，以增强方案说服力。',
      }
    }
    if (action === 'rollback') {
      return {
        title: '果断干预型',
        text: '你选择了较强干预动作，能快速止损，但在产品团队不支持、证据尚未完全闭环的情况下，可能面临较大组织阻力。建议后续在推动大动作前，先建立更充分的证据链。',
      }
    }
    if (action === 'wait' || hypothesis === 'wait-data') {
      return {
        title: '审慎观望型',
        text: '你倾向于等待更多数据再做判断。这可以避免过早误判，但在 24 小时止损压力下，完全不动可能让问题持续恶化。建议先做小范围、可回滚的运营干预。',
      }
    }
    return {
      title: '分析定位型',
      text: '你优先建立了待验证假设并选择了行动方案。在面对 Agent 结论不一致时，你没有急于采信单一判断，而是从多个角度建立了分析路径。接下来可以进一步明确每个假设需要的验证时间和资源。',
    }
  }

  const feedback = getConflictFeedback()

  // ==================== 渲染 ====================
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* 任务背景 */}
        <div className="bg-odyssey-surface/60 border border-odyssey-border rounded-xl p-4 mb-6">
          {/* P1→P2 过渡 */}
          {state.p1Identity && (
            <div className="text-xs text-odyssey-accent-glow/80 mb-3 flex items-center gap-2">
              <Lightbulb size={12} />
              你在热身中表现出「{state.p1Identity}」的协作倾向。接下来，你将面对更复杂的组织约束和多 Agent 协作挑战。
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-odyssey-accent/10 flex items-center justify-center">
              <Target size={18} className="text-odyssey-accent-glow" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-odyssey-text">第一次版本复盘实战</h2>
              <p className="text-sm text-odyssey-muted mt-1">
                V2.3 上线后，次日留存下降 7%。客服负面反馈上升，产品不希望回滚。工程只有 1 人天，你需要在 24 小时内给出复盘方案。
              </p>
              <AccordionPanel title="查看完整业务背景">
                <div className="text-xs space-y-1">
                  <p>V2.3 版本上线后，产品次日留存从 38% 下降到 31%，客服负面反馈明显上升。产品团队认为新版本核心功能符合预期，不希望轻易回滚；工程团队资源紧张，只能提供 1 人天支持；运营团队需要在 24 小时内给出短期补救动作。</p>
                  <p className="mt-1">你的主管要求你完成一份版本复盘，找出留存下降的可能原因，并提出可执行优化方案。</p>
                </div>
              </AccordionPanel>
            </div>
          </div>

          {/* 状态栏 */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            {[
              { icon: Zap, label: 'Agent 预算', value: `${usedBudget}/${budget}点`, color: 'text-odyssey-accent-glow' },
              { icon: Clock, label: '决策时限', value: '24小时', color: 'text-yellow-400' },
              { icon: Wrench, label: '工程资源', value: '1人天', color: 'text-blue-400' },
              { icon: AlertTriangle, label: '当前风险', value: '高', color: 'text-red-400' },
            ].map((item, i) => (
              <div key={i} className="bg-odyssey-bg/60 rounded-lg p-2.5 text-center">
                <item.icon size={14} className={`mx-auto mb-1 ${item.color}`} />
                <div className="text-[10px] text-odyssey-muted">{item.label}</div>
                <div className={`text-sm font-bold ${item.color}`}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 子任务导航 */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center">
              <button
                onClick={() => { if ((i === 1) || (i === 2 && subTask >= 2) || (i === 3 && subTask >= 3)) { setSubTask(i as SubTask) } }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  subTask === i
                    ? 'bg-odyssey-accent/20 text-odyssey-accent-glow font-medium'
                    : subTask > i
                      ? 'text-odyssey-muted hover:text-odyssey-text cursor-pointer'
                      : 'text-odyssey-muted/40 cursor-not-allowed'
                }`}
              >
                <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center ${
                  subTask === i ? 'bg-odyssey-accent text-white' : 'bg-odyssey-border text-odyssey-muted'
                }`}>
                  {subTask > i ? '✓' : i}
                </span>
                {['组建 AI 分析团队', '处理结论冲突', '创建复盘 Agent'][i - 1]}
              </button>
              {i < 3 && <ChevronRight size={14} className="text-odyssey-muted/30" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ========== 子任务一 ========== */}
          {subTask === 1 && (
            <motion.div key="task1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-5 space-y-2">
                  <h3 className="text-sm font-semibold text-odyssey-text mb-3 flex items-center gap-2">
                    <User size={14} className="text-odyssey-accent-glow" />
                    Agent 团队
                  </h3>
                  {PAGE2_AGENTS.map(agent => (
                    <AgentCard
                      key={agent.id}
                      agent={agent}
                      selected={agents.includes(agent.id)}
                      disabled={usedBudget + agent.cost > budget && !agents.includes(agent.id)}
                      onClick={() => toggleAgent(agent.id)}
                    />
                  ))}
                </div>

                <div className="col-span-7">
                  <h3 className="text-sm font-semibold text-odyssey-text mb-3 flex items-center gap-2">
                    <Zap size={14} className="text-odyssey-accent-glow" />
                    我的分析团队
                    {agents.length > 0 && (
                      <span className="text-xs text-odyssey-muted">({agents.length} 人 · {usedBudget} 点)</span>
                    )}
                  </h3>

                  {agents.length === 0 ? (
                    <div className="border border-dashed border-odyssey-border/50 rounded-xl p-8 text-center">
                      <User size={32} className="mx-auto mb-2 text-odyssey-muted/30" />
                      <p className="text-sm text-odyssey-muted/50">点击左侧 Agent 加入你的分析团队</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {agents.map(id => {
                        const agent = PAGE2_AGENTS.find(a => a.id === id)
                        if (!agent) return null
                        const currentRole = roles[id] || getRecommendedRole(id)
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
                                className="ml-auto text-odyssey-muted hover:text-red-400"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              <span className="text-[10px] text-odyssey-muted/60">推荐职责：</span>
                              <span className="px-2 py-0.5 rounded-lg text-xs bg-odyssey-accent/10 text-odyssey-accent-glow border border-odyssey-accent/20">
                                {currentRole}
                              </span>
                              <span className="text-[10px] text-odyssey-muted/40 self-center">（可修改）</span>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}

                  {agents.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <label className="text-[10px] text-odyssey-muted/50 block">可选：一句话说明你为什么这样组建团队</label>
                      <div className="flex gap-2 flex-wrap">
                        {[
                          { id: 'quick-stop-loss', label: '优先快速止损' },
                          { id: 'quick-hypothesis', label: '先验证关键假设' },
                          { id: 'quick-balance', label: '兼顾资源与风险' },
                        ].map(q => (
                          <button
                            key={q.id}
                            onClick={() => setReason(prev => prev === q.label ? '' : q.label)}
                            className={`px-2.5 py-1 rounded-lg text-xs border transition-all ${
                              reason === q.label
                                ? 'bg-odyssey-accent/20 text-odyssey-accent-glow border-odyssey-accent/30'
                                : 'bg-odyssey-bg text-odyssey-muted border-odyssey-border hover:border-odyssey-accent/30'
                            }`}
                          >
                            {q.label}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="也可以自己写一句理由"
                        className="w-full bg-odyssey-bg border border-odyssey-border rounded-xl px-4 py-3 text-sm text-odyssey-text placeholder:text-odyssey-muted/50 focus:outline-none focus:border-odyssey-accent/50 transition-colors"
                      />
                    </div>
                  )}

                  <Button
                    variant="accent"
                    size="md"
                    className="w-full mt-4"
                    disabled={agents.length === 0}
                    onClick={handleTask1Complete}
                  >
                    确认团队，开始分析
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========== 子任务二：冲突面板 ========== */}
          {subTask === 2 && (
            <motion.div key="task2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* 团队风格 */}
              <div className="bg-odyssey-accent/5 border border-odyssey-accent/20 rounded-xl p-3 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-odyssey-accent-glow">
                    你的分析团队偏「{getTeamStyle(state.p2Task1Agents).style}」
                  </span>
                </div>
                <p className="text-xs text-odyssey-muted">
                  {getTeamStyle(state.p2Task1Agents).feedback}
                </p>
              </div>

              {/* 子任务一 → 子任务二 过渡 */}
              <p className="text-xs text-odyssey-muted/60 mb-4">
                你的 AI 分析团队已开始工作。不同 Agent 给出了不完全一致的线索，现在需要你选择最值得优先验证的方向。
              </p>

              {/* 线索张力条 */}
              <div className="border border-odyssey-border bg-odyssey-surface/60 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-odyssey-text">多方信号</span>
                  <span className="text-[10px] text-odyssey-muted">四个维度线索强度不一</span>
                </div>
                <div className="space-y-2">
                  {TENSION_SIGNALS.map(s => (
                    <div key={s.dimension} className="flex items-center gap-3">
                      <span className="text-[11px] text-odyssey-text/70 w-8 flex-shrink-0 font-medium">{s.dimension}</span>
                      <div className="flex-1 h-1.5 bg-odyssey-border rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: s.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${s.strength}%` }}
                          transition={{ duration: 0.8, delay: 0.1 }}
                        />
                      </div>
                      <span className="text-[11px] text-odyssey-text/70 w-20 flex-shrink-0 text-right">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agent 结论卡片 — 可选作证据 */}
              <p className="text-xs text-odyssey-muted mb-2 font-medium">请选择 1-2 条你最重视的线索作为判断依据</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {PAGE2_CONCLUSIONS.map(c => {
                  const isSelected = selectedEvidence.includes(c.agentId)
                  return (
                    <div
                      key={c.agentId}
                      onClick={() => toggleEvidence(c.agentId)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter') toggleEvidence(c.agentId) }}
                      className={`text-left border rounded-xl p-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-odyssey-accent bg-odyssey-accent/10 shadow-lg shadow-odyssey-accent/10'
                          : 'border-odyssey-border bg-odyssey-surface/60 hover:border-odyssey-accent/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-odyssey-text">{c.agentName}</span>
                        <div className="flex items-center gap-1.5">
                          <Tag color={c.tag === '数据异常' ? 'purple' : c.tag === '技术风险' ? 'red' : c.tag === '用户反馈' ? 'yellow' : 'green'}>
                            {c.tag}
                          </Tag>
                          {isSelected && <Check size={14} className="text-odyssey-accent-glow" />}
                        </div>
                      </div>
                      <p className="text-sm text-odyssey-text">{c.shortText}</p>
                      <div onClick={(e) => e.stopPropagation()}>
                        <AccordionPanel title="查看完整分析">
                          <p className="text-xs">{c.fullText}</p>
                        </AccordionPanel>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* 冲突徽章 */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-[10px] text-odyssey-muted/50">当前分歧：</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                  用户反馈 ↔ 产品数据
                </span>
                <span className="text-[10px] text-odyssey-muted/30">|</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                  技术线索 ↔ 体验争议
                </span>
              </div>

              {/* 冲突提示 */}
              <div className="bg-odyssey-accent/5 border border-odyssey-accent/20 rounded-xl p-3 mb-4">
                <p className="text-xs text-odyssey-accent-glow flex items-center gap-2">
                  <AlertTriangle size={12} />
                  当前冲突：用户反馈指向体验问题，但产品数据没有明显异常；工程线索提示可能存在性能影响。
                </p>
              </div>

              {/* 技术线索提示 */}
              <div className="mb-4">
                {hasEngAgent ? (
                  <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-3">
                    <p className="text-xs text-green-400">
                      ✅ 由于你提前配置了工程诊断 Agent，你现在能更快看到 Android 低端机性能异常线索。
                    </p>
                  </div>
                ) : (
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">
                    <p className="text-xs text-yellow-400">
                      ⚠️ 你在初始团队中没有配置工程诊断 Agent，因此技术线索出现得较晚。现在你需要判断是否临时占用 1 人天工程资源。
                    </p>
                  </div>
                )}
              </div>

              {/* 组织约束 */}
              <div className="bg-odyssey-surface/60 border border-odyssey-border rounded-xl p-3 mb-6">
                <h4 className="text-xs font-semibold text-odyssey-text mb-2">组织约束</h4>
                <div className="flex flex-wrap gap-2">
                  <Tag color="red">产品：不希望回滚</Tag>
                  <Tag color="yellow">工程：仅 1 人天</Tag>
                  <Tag color="purple">运营：24 小时内止损</Tag>
                </div>
              </div>

              {!conflictDone ? (
                <>
                  {selectedEvidence.length > 0 && (
                    <>
                      {/* 冲突面板引导 */}
                      <div className="bg-odyssey-accent/10 border border-odyssey-accent/30 rounded-xl p-3 mb-4">
                        <p className="text-sm text-odyssey-accent-glow text-center">
                          当前信息不足以直接得出唯一结论。你的目标不是立刻找到标准答案，而是选择一个最值得优先验证的假设。
                        </p>
                      </div>

                      {/* 第一步：选择假设 */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-odyssey-text mb-3">
                          基于你选中的线索，你要优先验证哪条假设？
                        </h4>
                        <div className="space-y-2">
                          {HYPOTHESIS_OPTIONS.map(opt => (
                            <button
                              key={opt.id}
                              onClick={() => setHypothesis(opt.id)}
                              className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                                hypothesis === opt.id
                                  ? 'border-odyssey-accent bg-odyssey-accent/10 text-odyssey-text'
                                  : 'border-odyssey-border hover:border-odyssey-accent/40 text-odyssey-muted hover:text-odyssey-text'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 第二步：选择第一步推进策略 */}
                      {hypothesis && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-odyssey-text mb-1">
                            选择你的第一步推进策略
                          </h4>
                          <p className="text-xs text-odyssey-muted/50 mb-3">
                            你选择了「{HYPOTHESIS_OPTIONS.find(h => h.id === hypothesis)?.label}」作为优先假设。以下策略中，哪一个最适合作为你的第一步验证动作？
                          </p>
                          <div className="space-y-2">
                            {STRATEGY_CARDS.map(card => {
                              const label = STRATEGY_LABELS[hypothesis]?.[card.id]
                              return (
                                <button
                                  key={card.id}
                                  onClick={() => setAction(card.id)}
                                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                                    action === card.id
                                      ? 'border-odyssey-accent bg-odyssey-accent/10'
                                      : 'border-odyssey-border hover:border-odyssey-accent/40'
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <div className="text-sm text-odyssey-text mb-1">{card.label}</div>
                                      <div className="text-xs text-odyssey-muted">{card.cost}</div>
                                    </div>
                                    {label && (
                                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-odyssey-accent/10 text-odyssey-accent-glow border border-odyssey-accent/20 flex-shrink-0">
                                        {label}
                                      </span>
                                    )}
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* 尚未选择证据时的提示 */}
                  {selectedEvidence.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-xs text-odyssey-muted/40">
                        请先在上方选择 1-2 条最重视的线索
                      </p>
                    </div>
                  )}

                  {/* 决策理由 — 选完策略后出现 */}
                  {action && (
                    <div className="space-y-2 mb-4">
                      <label className="text-[10px] text-odyssey-muted/50 block">可选：一句话说明你的决策理由</label>
                      <div className="flex gap-2 flex-wrap">
                        {[
                          { id: 'd-quick-stop', label: '优先快速止损' },
                          { id: 'd-quick-hy', label: '先验证关键假设' },
                          { id: 'd-quick-bal', label: '兼顾资源与风险' },
                        ].map(q => (
                          <button
                            key={q.id}
                            onClick={() => setDecisionReason(prev => prev === q.label ? '' : q.label)}
                            className={`px-2.5 py-1 rounded-lg text-xs border transition-all ${
                              decisionReason === q.label
                                ? 'bg-odyssey-accent/20 text-odyssey-accent-glow border-odyssey-accent/30'
                                : 'bg-odyssey-bg text-odyssey-muted border-odyssey-border hover:border-odyssey-accent/30'
                            }`}
                          >
                            {q.label}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={decisionReason}
                        onChange={(e) => setDecisionReason(e.target.value)}
                        placeholder="也可以自己写一句理由"
                        className="w-full bg-odyssey-bg border border-odyssey-border rounded-xl px-4 py-3 text-sm text-odyssey-text placeholder:text-odyssey-muted/50 focus:outline-none focus:border-odyssey-accent/50 transition-colors"
                      />
                    </div>
                  )}

                  <Button
                    variant="accent"
                    size="md"
                    className="w-full"
                    disabled={!hypothesis || !action}
                    onClick={handleConflictComplete}
                  >
                    确认决策
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  {/* 冲突反馈 */}
                  <div className="bg-odyssey-surface border border-odyssey-border rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-odyssey-accent/20 flex items-center justify-center">
                        <Check size={12} className="text-odyssey-accent-glow" />
                      </div>
                      <span className="text-sm font-semibold text-odyssey-accent-glow">{feedback.title}</span>
                    </div>
                    <p className="text-sm text-odyssey-muted leading-relaxed">{feedback.text}</p>
                  </div>

                  {/* 决策 → 沉淀 衔接面板 */}
                  <div className="bg-odyssey-accent/5 border border-odyssey-accent/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <Lightbulb size={14} className="text-odyssey-accent-glow" />
                      </div>
                      <div>
                        <p className="text-sm text-odyssey-text font-medium mb-1">
                          你已经做出了关键判断
                        </p>
                        <p className="text-xs text-odyssey-muted leading-relaxed">
                          {hypothesis === 'wait-data' || action === 'wait'
                            ? '你选择了不急于判断，这本身就是一种决策。接下来，把这套分析框架保存下来——下次遇到类似情况时，你可以更快启动。'
                            : '你选择了优先假设和行动策略。现在，把这些判断经验保存为可复用 Agent——让下一次复盘不再从零开始。'
                          }
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-[10px] text-odyssey-accent-glow/60">
                          <span className="w-1 h-1 rounded-full bg-odyssey-accent-glow" />
                          <span>你的决策将被继承到复盘 Agent 中</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="accent"
                    size="md"
                    className="w-full"
                    onClick={handleTask2Next}
                  >
                    创建复盘 Agent
                    <ArrowRight size={16} />
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* ========== 子任务三：创建复盘 Agent ========== */}
          {subTask === 3 && (
            <motion.div key="task3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* 过渡文案 — 引用上一步决策 */}
              <div className="bg-odyssey-surface/40 border border-odyssey-border/50 rounded-xl p-3 mb-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-odyssey-accent/10 flex items-center justify-center mt-0.5">
                    <Save size={14} className="text-odyssey-accent-glow" />
                  </div>
                  <div>
                    <p className="text-sm text-odyssey-text font-medium mb-1">
                      把判断沉淀为方法
                    </p>
                    <p className="text-xs text-odyssey-muted leading-relaxed">
                      {hypothesis && hypothesis !== 'wait-data' ? (
                        <>你选择了「{HYPOTHESIS_OPTIONS.find(h => h.id === hypothesis)?.label}」作为优先假设，并采取了相应的行动策略。现在，把这些经验固化为一个可复用的版本复盘 Agent。</>
                      ) : (
                        <>你选择了不急于判断，等待更多数据。这种克制本身也是值得保存的经验。现在，把这套分析框架固化为一个可复用的版本复盘 Agent。</>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              {!agentSaved ? (
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-7 space-y-4">
                    {/* Agent 命名 */}
                    <div className="bg-odyssey-surface/60 border border-odyssey-border rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-odyssey-text mb-3">Agent 命名</h4>
                      <input
                        type="text"
                        value={agentName}
                        onChange={(e) => setAgentName(e.target.value)}
                        className="w-full bg-odyssey-bg border border-odyssey-border rounded-xl px-4 py-3 text-sm text-odyssey-text focus:outline-none focus:border-odyssey-accent/50"
                      />
                    </div>

                    {/* 触发条件 */}
                    <div className="bg-odyssey-surface/60 border border-odyssey-border rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-odyssey-text mb-3">触发条件（可多选）</h4>
                      <div className="flex flex-wrap gap-2">
                        {REVIEW_TRIGGERS.map(t => (
                          <button
                            key={t}
                            onClick={() => setTriggers(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}
                            className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                              triggers.includes(t)
                                ? 'bg-odyssey-accent/20 text-odyssey-accent-glow border-odyssey-accent/40'
                                : 'bg-odyssey-bg text-odyssey-muted border-odyssey-border hover:border-odyssey-accent/30'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 复盘流程 — 推荐预设，可删除 */}
                    <div className="bg-odyssey-surface/60 border border-odyssey-border rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-odyssey-text mb-2">复盘流程</h4>
                      <p className="text-xs text-odyssey-muted/60 mb-3">
                        已根据前面的分析生成推荐流程。你可以保持推荐，或删除不需要的步骤。
                      </p>

                      <div className="space-y-1">
                        {(flow.length > 0 ? flow : [...REVIEW_FLOW_STEPS]).map((s, idx) => (
                          <div key={s} className="flex items-center gap-2 text-sm py-1 group">
                            <span className="text-odyssey-accent-glow font-bold text-xs w-4">{idx + 1}.</span>
                            <span className="text-odyssey-text flex-1">{s}</span>
                            <button
                              onClick={() => setFlow(prev => {
                                const current = prev.length > 0 ? prev : [...REVIEW_FLOW_STEPS]
                                return current.filter(x => x !== s)
                              })}
                              className="opacity-0 group-hover:opacity-100 text-odyssey-muted hover:text-red-400 transition-all"
                              title="移除此步骤"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <p className="text-[10px] text-odyssey-muted/40 mt-2">
                        悬停步骤可显示删除按钮
                      </p>
                    </div>
                  </div>

                  <div className="col-span-5 space-y-4">
                    {/* 冲突处理原则 */}
                    <div className="bg-odyssey-surface/60 border border-odyssey-border rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-odyssey-text mb-3">冲突处理原则</h4>
                      <div className="space-y-2">
                        {CONFLICT_PRINCIPLES.map(p => (
                          <button
                            key={p}
                            onClick={() => setPrinciples(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs border transition-all ${
                              principles.includes(p)
                                ? 'bg-odyssey-accent/20 text-odyssey-accent-glow border-odyssey-accent/40'
                                : 'bg-odyssey-bg text-odyssey-muted border-odyssey-border hover:border-odyssey-accent/30'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 输出模板 */}
                    <div className="bg-odyssey-surface/60 border border-odyssey-border rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-odyssey-text mb-3">输出模板</h4>
                      <div className="space-y-2">
                        {OUTPUT_TEMPLATES.map(t => (
                          <button
                            key={t}
                            onClick={() => setTemplate(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs border transition-all ${
                              template.includes(t)
                                ? 'bg-odyssey-accent/20 text-odyssey-accent-glow border-odyssey-accent/40'
                                : 'bg-odyssey-bg text-odyssey-muted border-odyssey-border hover:border-odyssey-accent/30'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {!task3Configured && (
                        <p className="text-[10px] text-odyssey-muted/50 text-center">
                          至少选择一个触发条件、流程步骤、冲突原则或输出模板后即可保存
                        </p>
                      )}
                      <Button
                        variant="accent"
                        size="md"
                        className="w-full"
                        disabled={!task3Configured}
                        onClick={handleSaveAgent}
                      >
                        <Save size={16} />
                        保存到组织 Agent 库
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-lg mx-auto"
                >
                  <div className="bg-odyssey-surface border border-odyssey-border rounded-2xl p-8 text-center shadow-2xl shadow-odyssey-accent/5">
                    <div className="text-4xl mb-4">🤖</div>
                    <h2 className="text-xl font-bold text-odyssey-text mb-2">Agent 已生成</h2>
                    <p className="text-sm text-odyssey-text font-medium mb-4">
                      {agentName}
                    </p>

                    {/* 继承决策 */}
                    {inheritedDecisions.length > 0 && (
                      <div className="bg-odyssey-accent/5 border border-odyssey-accent/20 rounded-xl p-3 mb-4 text-left">
                        <p className="text-xs text-odyssey-accent-glow font-medium mb-2">
                          这个 Agent 继承了你本次复盘中的 {inheritedDecisions.length} 个关键判断：
                        </p>
                        <ul className="space-y-1">
                          {inheritedDecisions.map((d, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-odyssey-muted">
                              <span className="text-odyssey-accent-glow mt-0.5">•</span>
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <p className="text-sm text-odyssey-muted leading-relaxed mb-6">
                      它包含留存异常分析流程、Agent 协作分工、冲突处理原则和复盘报告模板。
                      该 Agent 已同步到组织 Agent 库，后续可被增长运营、用户运营和产品助理复用。
                    </p>

                    <div className="flex items-center justify-center gap-2 mb-6">
                      <div className="flex -space-x-2">
                        {['增长运营', '用户运营', '产品助理', '客服团队'].map((label, i) => (
                          <div
                            key={label}
                            className="w-8 h-8 rounded-full border-2 border-odyssey-bg bg-odyssey-accent/10 flex items-center justify-center text-xs"
                            style={{ zIndex: 4 - i }}
                            title={label}
                          >
                            {label[0]}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-odyssey-muted">可被多个团队复用</span>
                    </div>

                    <p className="text-xs text-odyssey-muted/60 mb-4">
                      你的《版本复盘 Agent》已生成。它继承了你刚才的关键判断，并准备进入组织复用网络。
                    </p>

                    <Button
                      variant="accent"
                      size="lg"
                      className="w-full"
                      onClick={handleGoToPage3}
                    >
                      查看我的成长复盘
                      <ArrowRight size={18} />
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
