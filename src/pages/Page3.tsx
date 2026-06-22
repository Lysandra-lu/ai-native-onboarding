import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { AccordionPanel } from '@/components/AccordionPanel'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import type { AppState, Identity, JourneyNode } from '@/lib/types'
import { PAGE2_CONCLUSIONS, HYPOTHESIS_OPTIONS, STRATEGY_CARDS } from '@/lib/types'
import { calculateIdentity } from '@/lib/storage'
import {
  ArrowRight, User, TrendingUp, Network, Target, Lightbulb, ChevronRight,
  ChevronDown, Eye, Zap, Shield, Share2, Clock, RefreshCw,
} from 'lucide-react'

interface Props {
  state: AppState
  onReset: () => void
}

export function Page3({ state, onReset }: Props) {
  const [showMirror, setShowMirror] = useState(false)
  const [showNext, setShowNext] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)
  const [showEvidence, setShowEvidence] = useState(false)
  const [mirrorExpanded, setMirrorExpanded] = useState<'calibrate' | 'resource' | 'sediment' | null>(null)

  const p2Agents = state.p2Task1Agents
  const p2Hypothesis = state.p2Task2Hypothesis
  const p2Action = state.p2Task2Action

  const hasEngAgent = p2Agents.includes('eng-ai')
  const usesHypothesisPriority = p2Hypothesis && p2Hypothesis !== 'feedback-rep'
  const usesCombinedAction = p2Action === 'combined'
  const usesRollback = p2Action === 'rollback'
  const usesWait = p2Action === 'wait'

  const agentComplete = state.p2Task3Triggers.length >= 2 &&
    state.p2Task3Flow.length >= 4 &&
    state.p2Task3Principles.length >= 1 &&
    state.p2Task3Template.length >= 2

  // 行为证据
  const evidence = [
    `你组建了 ${p2Agents.length} 个 Agent 的分析团队`,
    hasEngAgent ? '你提前配置了工程诊断视角' : '你以数据和体验视角为主',
    usesHypothesisPriority ? '你建立了假设优先级而非直接采信' : '你倾向于采信直接证据',
    usesCombinedAction ? '你选择了组合行动方案兼顾止损和验证' : '你选择了聚焦行动方案',
    agentComplete ? '你创建了可复用的《版本复盘 Agent》' : '你的 Agent 偏向一次性使用',
  ]

  // 是否选择了直接采信单一 Agent
  const directTrust = p2Hypothesis === 'feedback-rep'
  const ignoreEngineering = !hasEngAgent && !usesCombinedAction
  const lowSediment = !agentComplete

  // 下一挑战推荐
  let nextChallenge = { title: '增长实验一周验证战', reason: '', ability: '增长假设验证' }
  if (directTrust) {
    nextChallenge = { title: '多 Agent 证据校准战', reason: '避免被单一 AI 结论带偏，学习建立多证据判断链。', ability: '多证据判断' }
  } else if (ignoreEngineering) {
    nextChallenge = { title: '跨部门资源争取战', reason: '在证据不完整、资源有限的情况下推动协同。', ability: '资源协调' }
  } else if (lowSediment) {
    nextChallenge = { title: '从个人交付到组织复用', reason: '把一次任务流程转化为可被团队复用的 Agent。', ability: '方法沉淀' }
  } else {
    nextChallenge = { title: '增长实验一周验证战', reason: '在一周内用 AI 团队完成增长假设验证。', ability: '增长实验' }
  }

  const backupChallenges = [
    '法务 AI 否决产品方案',
    'CEO 要求一周验证增长假设',
    '客服反馈爆发后的危机处理',
  ]

  // 复盘镜内容
  const mirrorItems: { id: string; title: string; content: string; suggestion: string; trigger: boolean }[] = []
  if (directTrust) {
    mirrorItems.push({
      id: 'calibrate',
      title: '过度相信单一 Agent',
      content: '你在冲突阶段较快采信了单一 Agent 的判断。这可以提升决策速度，但也可能让你忽略其他解释路径。',
      suggestion: '下次可以先让不同 Agent 各自给出"支持证据"和"反证"，再建立假设优先级。',
      trigger: true,
    })
  }
  if (ignoreEngineering) {
    mirrorItems.push({
      id: 'resource',
      title: '忽略工程资源约束',
      content: '工程团队当前只有 1 人天支持。AI Native 组织中的好决策，往往不是找到最完整答案，而是在资源有限时找到最可执行的下一步。',
      suggestion: '下次可以将工程资源用于检查关键埋点和异常渠道，同时用运营动作先做短期止损。',
      trigger: true,
    })
  }
  if (lowSediment) {
    mirrorItems.push({
      id: 'sediment',
      title: '缺少沉淀意识',
      content: '你完成了当前版本复盘，但沉淀出的 Agent 还偏向一次性使用。后续可以补充触发条件、冲突处理原则和输出模板，让它更容易被团队复用。',
      suggestion: '补充触发条件、冲突处理原则和输出模板，让 Agent 从"一次性"变成"可复用"。',
      trigger: true,
    })
  }
  if (mirrorItems.length === 0) {
    mirrorItems.push({
      id: 'general',
      title: '表现均衡，继续前进',
      content: '你在 Agent 分工、冲突处理和沉淀方面表现均衡。继续保持多角度思考的习惯。',
      suggestion: '下一步可以挑战更高复杂度的跨部门协同场景。',
      trigger: true,
    })
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
        {/* 顶部完成提示 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-4xl mb-3">🎉</div>
          <h1 className="text-2xl font-bold text-odyssey-text mb-2">你的 AI Native 成长复盘已生成</h1>
          <p className="text-sm text-odyssey-accent-glow mb-2">
            从一次版本复盘，到一个可复用 Agent；从个人交付，到组织资产增值。
          </p>
          <p className="text-xs text-odyssey-muted/60">
            这不是评分报告，而是一次 AI Native 工作方式复盘。我们会回看你的关键选择、沉淀出的 Agent，以及它可能带来的组织复用价值。
          </p>
        </motion.div>

        {/* 卡片一：身份进化 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-odyssey-accent/20">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-odyssey-accent/10 flex items-center justify-center">
                  <TrendingUp size={16} className="text-odyssey-accent-glow" />
                </div>
                <CardTitle className="text-lg">身份进化</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {/* 进化箭头 */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-center">
                  <div className="text-xs text-odyssey-muted mb-1">P1 初始身份</div>
                  <div className="px-3 py-1.5 rounded-full bg-odyssey-surface border border-odyssey-border text-sm text-odyssey-text">
                    {state.p1Identity || '工作流设计型新人'}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <ArrowRight size={20} className="text-odyssey-accent-glow" />
                  <span className="text-[10px] text-odyssey-muted mt-0.5">P2 实战</span>
                </div>
                <div className="text-center">
                  <div className="text-xs text-odyssey-muted mb-1">实战后身份</div>
                  <div className="px-3 py-1.5 rounded-full bg-odyssey-accent/10 border border-odyssey-accent/30 text-sm text-odyssey-accent-glow font-medium">
                    初级 AI Orchestrator
                  </div>
                </div>
              </div>

              {/* 三维变化 */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-odyssey-bg/60 rounded-xl p-3 text-center">
                  <div className="text-lg mb-1">🔧</div>
                  <div className="text-[10px] text-odyssey-muted">工作流设计</div>
                  <div className={`text-xs font-medium mt-0.5 ${state.p1Scene1Workflow.length >= 4 ? 'text-green-400' : 'text-odyssey-muted'}`}>
                    {state.p1Scene1Workflow.length >= 4 ? '已展现' : '待成长'}
                  </div>
                </div>
                <div className="bg-odyssey-bg/60 rounded-xl p-3 text-center">
                  <div className="text-lg mb-1">🤝</div>
                  <div className="text-[10px] text-odyssey-muted">Agent 协作</div>
                  <div className={`text-xs font-medium mt-0.5 ${p2Agents.length >= 2 && usesHypothesisPriority ? 'text-green-400' : 'text-odyssey-muted'}`}>
                    {p2Agents.length >= 2 && usesHypothesisPriority ? '已展现' : '待成长'}
                  </div>
                </div>
                <div className="bg-odyssey-bg/60 rounded-xl p-3 text-center">
                  <div className="text-lg mb-1">🏗️</div>
                  <div className="text-[10px] text-odyssey-muted">组织沉淀</div>
                  <div className={`text-xs font-medium mt-0.5 ${agentComplete ? 'text-green-400' : 'text-odyssey-muted'}`}>
                    {agentComplete ? '已展现' : '待成长'}
                  </div>
                </div>
              </div>

              <p className="text-sm text-odyssey-muted leading-relaxed mb-4">
                在 P1 中，你表现出工作流设计倾向：能够选择并排序任务步骤。在 P2 中，你进一步完成了 Agent 组队、冲突判断和组织约束下的行动选择。因此，你的实战身份从「{state.p1Identity || '工作流设计型新人'}」进化为「初级 AI Orchestrator」。
              </p>

              {/* 行为证据（折叠） */}
              <button
                onClick={() => setShowEvidence(!showEvidence)}
                className="flex items-center gap-1 text-xs text-odyssey-accent-glow hover:underline"
              >
                {showEvidence ? '收起行为证据' : '查看行为证据'}
                <ChevronDown size={12} className={`transition-transform ${showEvidence ? 'rotate-180' : ''}`} />
              </button>
              {showEvidence && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-3 space-y-2"
                >
                  {evidence.map((e, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-odyssey-accent-glow mt-1.5 flex-shrink-0" />
                      <span className="text-odyssey-muted">{e}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* 卡片二：决策链追溯 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-odyssey-accent/10 flex items-center justify-center">
                  <Target size={16} className="text-odyssey-accent-glow" />
                </div>
                <CardTitle className="text-lg">决策链追溯</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {/* 三段链路 */}
              <div className="flex items-stretch gap-2 mb-4">
                {/* 证据 */}
                <div className="flex-1 bg-odyssey-bg/60 border border-odyssey-border rounded-xl p-3 text-center">
                  <div className="text-[10px] text-odyssey-muted/50 mb-1">证据选择</div>
                  <div className="text-xs text-odyssey-text">
                    {state.p2Task2Evidence.length > 0
                      ? state.p2Task2Evidence.map(id => {
                          const c = PAGE2_CONCLUSIONS.find(x => x.agentId === id)
                          return c ? c.shortText : id
                        }).join('，')
                      : '未选择证据'
                    }
                  </div>
                </div>
                {/* 箭头 */}
                <div className="flex items-center">
                  <ArrowRight size={16} className="text-odyssey-accent-glow/40" />
                </div>
                {/* 假设 */}
                <div className="flex-1 bg-odyssey-bg/60 border border-odyssey-border rounded-xl p-3 text-center">
                  <div className="text-[10px] text-odyssey-muted/50 mb-1">假设建立</div>
                  <div className="text-xs text-odyssey-text">
                    {p2Hypothesis
                      ? (HYPOTHESIS_OPTIONS.find(h => h.id === p2Hypothesis)?.label || '未选择')
                      : '未选择假设'
                    }
                  </div>
                </div>
                {/* 箭头 */}
                <div className="flex items-center">
                  <ArrowRight size={16} className="text-odyssey-accent-glow/40" />
                </div>
                {/* 行动 */}
                <div className="flex-1 bg-odyssey-bg/60 border border-odyssey-border rounded-xl p-3 text-center">
                  <div className="text-[10px] text-odyssey-muted/50 mb-1">行动策略</div>
                  <div className="text-xs text-odyssey-text">
                    {p2Action
                      ? (STRATEGY_CARDS.find(s => s.id === p2Action)?.label.split('：')[0] || '已选择')
                      : '未选择行动'
                    }
                  </div>
                </div>
              </div>

              {/* 判断链反馈 */}
              <div className="bg-odyssey-accent/5 border border-odyssey-accent/20 rounded-xl p-3">
                <p className="text-xs text-odyssey-muted leading-relaxed">
                  {(() => {
                    const evidence = state.p2Task2Evidence
                    const hasDataEvidence = evidence.includes('data-ai')
                    const hasUserEvidence = evidence.includes('feedback-ai')
                    const hasTechEvidence = evidence.includes('eng-ai')
                    const hasProductEvidence = evidence.includes('product-ai')
                    const isEntryHyp = p2Hypothesis === 'entry-change'
                    const isPerfHyp = p2Hypothesis === 'android-perf'
                    const isFeedbackHyp = p2Hypothesis === 'feedback-rep'
                    const isWaitHyp = p2Hypothesis === 'wait-data'
                    const isOnboardingAct = p2Action === 'onboarding-fix'
                    const isKeyTrackAct = p2Action === 'key-track'
                    const isRollbackAct = p2Action === 'rollback-eval'
                    const isLightTouchAct = p2Action === 'light-touch'
                    const isWaitAct = p2Action === 'wait'

                    if (!p2Hypothesis || !p2Action) {
                      return '你尚未完成完整的决策链。在 P2 中做出证据、假设和行动的选择后，这里会展示你的判断链路分析。'
                    }

                    // 一致性判断
                    const entryConsistent = isEntryHyp && isOnboardingAct
                    const perfConsistent = isPerfHyp && isKeyTrackAct
                    const feedbackConsistent = isFeedbackHyp && (isOnboardingAct || isRollbackAct)

                    if (entryConsistent || perfConsistent || feedbackConsistent) {
                      const sources = []
                      if (hasDataEvidence) sources.push('数据异常')
                      if (hasUserEvidence) sources.push('用户反馈')
                      if (hasTechEvidence) sources.push('技术线索')
                      return `你的判断链比较一致：你采信了${sources.join('和')}等证据，建立了假设并选择了能直接验证该假设的行动。`
                    }

                    if (isWaitHyp || isWaitAct) {
                      return '你选择了暂不判断或暂不动作。在信息不充分时保持克制，本身就是一种值得记录的经验。'
                    }

                    // 不一致的情况
                    if (hasTechEvidence && isOnboardingAct) {
                      return '你的证据更偏向技术风险，但行动选择偏向体验修复。这可能说明你在组织约束下选择了更容易快速执行的路径。'
                    }
                    if (hasDataEvidence && isRollbackAct) {
                      return '你的证据指向数据异常，选择了强力干预。虽然能快速止损，但在证据尚未完整闭环时可能面临较大组织阻力。'
                    }

                    return '你的判断链中每个环节都有各自的逻辑，后续可以进一步对齐证据、假设和行动之间的关系。'
                  })()}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 卡片三：组织资产增值模拟 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-odyssey-accent/10 flex items-center justify-center">
                  <Network size={16} className="text-odyssey-accent-glow" />
                </div>
                <CardTitle className="text-lg">组织资产增值模拟</CardTitle>
              </div>
              <CardDescription>以下为 demo 模拟推演，展示个人方法沉淀为 Agent 后可能产生的组织资产增值路径</CardDescription>
            </CardHeader>
            <CardContent>
              {/* 网络图 */}
              <div className="flex flex-col items-center py-6">
                {/* 中心 */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="w-16 h-16 rounded-full bg-odyssey-accent/20 border-2 border-odyssey-accent/40 flex items-center justify-center text-xl mb-4"
                >
                  👤
                </motion.div>
                <span className="text-xs text-odyssey-muted mb-6">产品运营专员</span>

                {/* 一层 */}
                <div className="w-px h-8 bg-odyssey-accent/30 mb-2" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="px-4 py-2 rounded-full bg-odyssey-accent/10 border border-odyssey-accent/30 text-sm text-odyssey-accent-glow font-medium mb-6"
                >
                  🤖 {state.p2Task3Name || '《V2.3 版本复盘 Agent》'}
                </motion.div>

                {/* 增值路径线 */}
                <svg className="w-full h-16 mb-2" viewBox="0 0 400 60">
                  <motion.path
                    d="M 200 0 L 50 50 M 200 0 L 200 50 M 200 0 L 350 50"
                    stroke="#7C3AED"
                    strokeOpacity="0.3"
                    strokeWidth="1"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.7, duration: 1 }}
                  />
                </svg>

                {/* 二层 */}
                <div className="flex justify-center gap-8 w-full">
                  {[
                    { label: '用户运营', reuse: '4次', scene: '社群反馈复盘' },
                    { label: '增长运营', reuse: '3次', scene: '活动复盘' },
                    { label: '产品助理', reuse: '2次', scene: '需求评审前分析' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + i * 0.15 }}
                      className="text-center group relative"
                    >
                      <div className="w-10 h-10 rounded-full bg-odyssey-surface border border-odyssey-border flex items-center justify-center text-xs mx-auto mb-1 group-hover:border-odyssey-accent/40 transition-colors">
                        {item.label[0]}
                      </div>
                      <span className="text-[10px] text-odyssey-muted">{item.label}</span>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-32 text-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <span className="text-[10px] text-odyssey-accent-glow bg-odyssey-surface border border-odyssey-border rounded px-2 py-1">
                          预计复用 {item.reuse} · {item.scene}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* 组织价值摘要 */}
                <div className="mt-8 grid grid-cols-3 gap-3 w-full">
                  <div className="text-center p-3 bg-odyssey-bg/60 rounded-xl">
                    <div className="text-sm font-bold text-odyssey-accent-glow">
                      {agentComplete ? '4个' : '1-2个'}
                    </div>
                    <div className="text-[10px] text-odyssey-muted mt-0.5">复用场景</div>
                  </div>
                  <div className="text-center p-3 bg-odyssey-bg/60 rounded-xl">
                    <div className="text-sm font-bold text-odyssey-accent-glow">
                      {agentComplete ? '~6.5h' : '~2h'}
                    </div>
                    <div className="text-[10px] text-odyssey-muted mt-0.5">预计节省时间</div>
                  </div>
                  <div className="text-center p-3 bg-odyssey-bg/60 rounded-xl">
                    <div className="text-sm font-bold text-odyssey-accent-glow">方法论</div>
                    <div className="text-[10px] text-odyssey-muted mt-0.5">贡献类型</div>
                  </div>
                </div>

                <p className="text-[10px] text-odyssey-muted/40 mt-4">
                  以上为 demo 模拟数据，不代表真实绩效
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 卡片四：复盘镜（折叠） */}
        <AccordionPanel title={`复盘镜 · 你的关键转折点 (${mirrorItems.length})`}>
          <div className="space-y-3 py-2">
            {mirrorItems.map((item, i) => (
              <div key={item.id} className="bg-odyssey-bg/60 rounded-xl p-3 border border-odyssey-border">
                <h4 className="text-sm font-semibold text-odyssey-text mb-1">{item.title}</h4>
                <p className="text-xs text-odyssey-muted leading-relaxed mb-2">{item.content}</p>
                <p className="text-xs text-odyssey-accent-glow flex items-start gap-1">
                  <Lightbulb size={12} className="flex-shrink-0 mt-0.5" />
                  <span>建议：{item.suggestion}</span>
                </p>

                {/* 轻量模拟按钮 */}
                {item.id === 'calibrate' && (
                  <button
                    onClick={() => setMirrorExpanded(mirrorExpanded === 'calibrate' ? null : 'calibrate')}
                    className="mt-2 text-xs text-odyssey-accent-glow hover:underline flex items-center gap-1"
                  >
                    试一下证据校准
                    <ChevronDown size={12} className={mirrorExpanded === 'calibrate' ? 'rotate-180' : ''} />
                  </button>
                )}
                {item.id === 'resource' && (
                  <button
                    onClick={() => setMirrorExpanded(mirrorExpanded === 'resource' ? null : 'resource')}
                    className="mt-2 text-xs text-odyssey-accent-glow hover:underline flex items-center gap-1"
                  >
                    试一下资源取舍
                    <ChevronDown size={12} className={mirrorExpanded === 'resource' ? 'rotate-180' : ''} />
                  </button>
                )}
                {item.id === 'sediment' && (
                  <button
                    onClick={() => setMirrorExpanded(mirrorExpanded === 'sediment' ? null : 'sediment')}
                    className="mt-2 text-xs text-odyssey-accent-glow hover:underline flex items-center gap-1"
                  >
                    优化我的 Agent
                    <ChevronDown size={12} className={mirrorExpanded === 'sediment' ? 'rotate-180' : ''} />
                  </button>
                )}

                {/* 展开的轻量模拟 */}
                {mirrorExpanded === 'calibrate' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-3 space-y-2 overflow-hidden"
                  >
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-2 text-[10px]">
                        <span className="text-green-400 font-medium">数据 AI 支持证据</span>
                        <p className="text-odyssey-muted mt-1">新用户 D1 异常，老用户稳定</p>
                      </div>
                      <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-2 text-[10px]">
                        <span className="text-red-400 font-medium">用户反馈 AI 反证</span>
                        <p className="text-odyssey-muted mt-1">核心路径稳定，非纯体验问题</p>
                      </div>
                      <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-2 text-[10px]">
                        <span className="text-blue-400 font-medium">产品体验 AI 补充</span>
                        <p className="text-odyssey-muted mt-1">低端机可能有性能影响</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-green-400">✅ 多证据校准后，结论更稳健</p>
                  </motion.div>
                )}

                {mirrorExpanded === 'resource' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-3 space-y-2 overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-2 text-[10px]">
                        <span className="text-red-400 font-medium">方案 A：完整排查</span>
                        <p className="text-odyssey-muted mt-1">3 人天，完整但无法立刻执行</p>
                      </div>
                      <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-2 text-[10px]">
                        <span className="text-green-400 font-medium">方案 B：关键排查</span>
                        <p className="text-odyssey-muted mt-1">1 人天，24h 内辅助决策</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-green-400">✅ 当前约束下，方案 B 更适合作为第一步</p>
                  </motion.div>
                )}

                {mirrorExpanded === 'sediment' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-3 space-y-2 overflow-hidden"
                  >
                    <div className="space-y-1">
                      <p className="text-[10px] text-odyssey-muted">
                        <span className="text-green-400">+</span> 补充触发条件
                      </p>
                      <p className="text-[10px] text-odyssey-muted">
                        <span className="text-green-400">+</span> 补充冲突处理原则
                      </p>
                      <p className="text-[10px] text-odyssey-muted">
                        <span className="text-green-400">+</span> 补充输出模板
                      </p>
                    </div>
                    <p className="text-[10px] text-green-400">✅ 复用性提升，更多团队可以使用</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </AccordionPanel>

        {/* 卡片五：下一挑战推荐（折叠） */}
        <AccordionPanel title={`下一挑战推荐：${nextChallenge.title}`}>
          <div className="space-y-3 py-2">
            <div className="bg-odyssey-bg/60 border border-odyssey-border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-odyssey-accent/10 flex items-center justify-center">
                  <Zap size={18} className="text-odyssey-accent-glow" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-odyssey-text">{nextChallenge.title}</h4>
                  <p className="text-xs text-odyssey-muted">训练能力：{nextChallenge.ability}</p>
                </div>
              </div>
              <p className="text-sm text-odyssey-muted leading-relaxed mb-3">
                为什么推荐你：{nextChallenge.reason}
              </p>

              <p className="text-xs font-medium text-odyssey-text mb-2">备选挑战</p>
              <div className="space-y-1">
                {backupChallenges.map((c, i) => (
                  <div key={i} className="text-xs text-odyssey-muted flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-odyssey-muted/40" />
                    {c}
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-odyssey-muted/40 mt-3">
                下一轮挑战将在后续版本开放。本 Demo 当前展示推荐逻辑。
              </p>
            </div>
          </div>
        </AccordionPanel>

        {/* 彩蛋：完整成长轨迹 */}
        <div className="text-center pb-8">
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="text-xs text-odyssey-muted/40 hover:text-odyssey-accent-glow transition-colors flex items-center gap-1 mx-auto"
          >
            查看完整成长轨迹
            <ChevronDown size={12} className={showTimeline ? 'rotate-180' : ''} />
          </button>

          {showTimeline && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-6 overflow-hidden"
            >
              <div className="relative pl-8 text-left max-w-sm mx-auto">
                <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-odyssey-accent/20" />

                {[
                  { label: 'AI Operator', desc: '你开始使用 AI 完成单点任务', active: true },
                  { label: 'Workflow Designer', desc: '你开始把重复任务拆解为可复用工作流', active: true },
                  { label: 'Agent Coordinator', desc: '你能够为多个 AI 分配职责并协调分析过程', active: true },
                  { label: 'Decision Orchestrator', desc: '你开始在组织约束下做出可解释决策', active: true },
                  { label: 'Agent Builder', desc: '你将个人方法沉淀为可复用 Agent', active: agentComplete },
                  { label: 'AI Orchestrator', desc: '你能通过 AI 与组织协同创造可复用的组织资产', active: false },
                ].map((item, i) => (
                  <div key={i} className="relative pb-6 last:pb-0">
                    <div className={`absolute left-[-23px] w-3 h-3 rounded-full border-2 ${
                      item.active
                        ? 'bg-odyssey-accent border-odyssey-accent'
                        : 'bg-odyssey-bg border-odyssey-border'
                    }`} />
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-sm font-medium ${item.active ? 'text-odyssey-text' : 'text-odyssey-muted/40'}`}>
                        {item.label}
                      </span>
                      {!item.active && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-odyssey-border text-odyssey-muted/40">
                          未解锁
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-odyssey-muted/60">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="text-center pb-12 space-y-3">
          <Button variant="outline" size="md" onClick={onReset}>
            <RefreshCw size={14} />
            重新体验
          </Button>
        </div>
      </div>
    </div>
  )
}
