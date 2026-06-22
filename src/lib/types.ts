// ==================== AI Native 入职陪练官 — 类型定义 ====================

// --- 页面导航 ---
export type AppPage = 'page1' | 'page2' | 'page3'

// --- 全局进度节点 ---
export type JourneyNode = 'calibrate' | 'collaborate' | 'decide' | 'solidify' | 'diffuse'

export const JOURNEY_NODES: { key: JourneyNode; label: string; subtitle: string }[] = [
  { key: 'calibrate', label: '校准', subtitle: '观察你的 AI 协作习惯' },
  { key: 'collaborate', label: '协同', subtitle: '组建你的 AI 分析团队' },
  { key: 'decide', label: '决策', subtitle: '在冲突和约束中选择行动' },
  { key: 'solidify', label: '沉淀', subtitle: '把方法保存为可复用 Agent' },
  { key: 'diffuse', label: '增值', subtitle: '看见你的组织资产增值' },
]

// --- 身份标签 ---
export type Identity = '快速执行型新人' | '工作流设计型新人' | 'Agent协作型新人' | '组织沉淀型新人'

// --- Page1：场景一 — 工作流卡片 ---
export type CardType = 'tool' | 'action'

export interface WorkflowCard {
  id: string
  label: string
  type: CardType
  description?: string
}

export const TOOL_CARDS: WorkflowCard[] = [
  { id: 'gpt', label: 'GPT', type: 'tool', description: '通用大模型，可生成文本、分析、总结' },
  { id: 'search', label: '搜索引擎', type: 'tool', description: '检索竞品公开信息、行业动态' },
  { id: 'data-tool', label: '数据工具', type: 'tool', description: '查看竞品数据、版本指标变化' },
  { id: 'doc-tool', label: '文档工具', type: 'tool', description: '编辑、排版、输出最终报告' },
  { id: 'code-assist', label: '代码助手', type: 'tool', description: '自动化数据抓取或格式处理' },
]

export const ACTION_CARDS: WorkflowCard[] = [
  { id: 'check-focus', label: '明确主管关注重点', type: 'action', description: '先对齐上级期望的周报核心信息' },
  { id: 'collect-news', label: '搜集竞品动态', type: 'action', description: '从多渠道获取竞品最新动作' },
  { id: 'compare-version', label: '对比版本变化', type: 'action', description: '对比竞品新旧版本差异' },
  { id: 'summarize-feedback', label: '总结用户反馈', type: 'action', description: '汇总竞品用户评论中的关键信号' },
  { id: 'verify-source', label: '检查信息来源', type: 'action', description: '验证信息可靠性，标注不确定来源' },
  { id: 'gen-draft', label: '生成报告初稿', type: 'action', description: '基于收集的信息生成周报初稿' },
  { id: 'optimize-structure', label: '优化报告结构', type: 'action', description: '调整报告逻辑，突出重点信息' },
  { id: 'save-template', label: '沉淀为周报模板', type: 'action', description: '将本次流程保存为可复用模板' },
  { id: 'share-team', label: '分享给团队复用', type: 'action', description: '把模板分享给同组同事使用' },
]

// 步骤 → 推荐工具映射（用于 P1 场景一中每个步骤显示关联工具图标）
export const STEP_TOOL_MAP: Record<string, string[]> = {
  'check-focus': ['gpt'],
  'collect-news': ['search', 'gpt'],
  'compare-version': ['data-tool', 'search'],
  'summarize-feedback': ['gpt'],
  'verify-source': ['search', 'gpt'],
  'gen-draft': ['gpt', 'doc-tool'],
  'optimize-structure': ['gpt', 'doc-tool'],
  'save-template': ['doc-tool'],
  'share-team': ['doc-tool'],
}

// 工具 ID → 图标和简称映射
export const TOOL_META: Record<string, { emoji: string; short: string }> = {
  'gpt': { emoji: '🤖', short: 'GPT' },
  'search': { emoji: '🔍', short: '搜索' },
  'data-tool': { emoji: '📊', short: '数据' },
  'doc-tool': { emoji: '📄', short: '文档' },
  'code-assist': { emoji: '💻', short: '代码' },
}

// --- Page1：场景二 — Agent ---
export interface AgentDef {
  id: string
  name: string
  cost: number
  ability: string
  emoji: string
  color: string
}

export const SCENE2_AGENTS: AgentDef[] = [
  { id: 'data-ai', name: '数据 AI', cost: 3, ability: '定位异常人群、留存分群、渠道差异', emoji: '📊', color: '#7C3AED' },
  { id: 'cs-ai', name: '客服 AI', cost: 2, ability: '聚类用户抱怨、提取高频反馈', emoji: '💬', color: '#F59E0B' },
  { id: 'product-ai', name: '产品 AI', cost: 2, ability: '分析路径变化、识别体验摩擦', emoji: '🧩', color: '#06B6D4' },
  { id: 'eng-ai', name: '工程 AI', cost: 3, ability: '排查性能、Bug、埋点异常', emoji: '⚙️', color: '#22C55E' },
  { id: 'competitor-ai', name: '竞品 AI', cost: 1, ability: '对比同期竞品动作', emoji: '🔍', color: '#EC4899' },
  { id: 'review-ai', name: '复盘 AI', cost: 1, ability: '整理假设和输出摘要', emoji: '📝', color: '#8B5CF6' },
]

export const SCENE2_ROLES = [
  '定位异常用户群',
  '分析用户反馈',
  '检查产品路径变化',
  '排查技术风险',
  '提出初步假设',
  '生成分析摘要',
] as const

export type Scene2Role = typeof SCENE2_ROLES[number]

// --- Page2 — Agent ---
export const PAGE2_AGENTS: AgentDef[] = [
  { id: 'data-ai', name: '数据分析 Agent', cost: 3, ability: '定位异常人群、留存分群、渠道差异', emoji: '📊', color: '#7C3AED' },
  { id: 'feedback-ai', name: '用户反馈 Agent', cost: 2, ability: '聚类用户抱怨、整理高频反馈', emoji: '💬', color: '#F59E0B' },
  { id: 'product-ai', name: '产品体验 Agent', cost: 2, ability: '分析路径变化、识别体验摩擦', emoji: '🧩', color: '#06B6D4' },
  { id: 'eng-ai', name: '工程诊断 Agent', cost: 3, ability: '排查性能、Bug、埋点异常', emoji: '⚙️', color: '#22C55E' },
  { id: 'competitor-ai', name: '竞品观察 Agent', cost: 1, ability: '对比同期竞品动作', emoji: '🔍', color: '#EC4899' },
  { id: 'review-ai', name: '复盘写作 Agent', cost: 1, ability: '整理假设和输出报告', emoji: '📝', color: '#8B5CF6' },
]

// --- Page2：冲突面板 — 结论短句 ---
export interface AgentConclusion {
  agentId: string
  agentName: string
  shortText: string
  tag: string
  fullText: string
}

export const PAGE2_CONCLUSIONS: AgentConclusion[] = [
  {
    agentId: 'data-ai', agentName: '数据 AI', shortText: '新用户 D1 异常',
    tag: '数据异常',
    fullText: '留存下降主要集中在新用户 D1，老用户留存变化不明显。异常主要出现在 Android 低端机用户和渠道 A 新用户。',
  },
  {
    agentId: 'feedback-ai', agentName: '客服 AI', shortText: '找不到旧入口',
    tag: '用户反馈',
    fullText: '客服和社群反馈中，用户主要抱怨「找不到旧入口」和「新手引导变长」，负面反馈集中在新版本上线后 48 小时内。',
  },
  {
    agentId: 'product-ai', agentName: '产品 AI', shortText: '核心路径稳定',
    tag: '体验争议',
    fullText: '新手引导完成率没有明显下降，核心路径转化率也基本稳定。因此留存下降不一定完全由体验改版导致。',
  },
  {
    agentId: 'eng-ai', agentName: '工程 AI', shortText: '低端机加载变慢',
    tag: '技术风险',
    fullText: 'Android 低端机启动速度变慢，但目前样本有限。完整排查需要 3 人天，目前工程团队只能提供 1 人天。',
  },
]

// --- 线索张力条数据 ---
export interface TensionSignal {
  dimension: string       // 数据/用户/产品/技术
  label: string           // 新用户 D1 异常
  strength: number        // 0-100 异常强度
  color: string           // 色条颜色
}

export const TENSION_SIGNALS: TensionSignal[] = [
  { dimension: '数据', label: '异常较强', strength: 75, color: '#7C3AED' },
  { dimension: '用户', label: '体验抱怨', strength: 60, color: '#F59E0B' },
  { dimension: '产品', label: '暂未异常', strength: 20, color: '#22C55E' },
  { dimension: '技术', label: '风险提示', strength: 55, color: '#EF4444' },
]

// P3 决策链追溯
export interface DecisionChain {
  evidenceNames: string[]
  hypothesisLabel: string
  strategyLabel: string
  relationship: string   // 一致性评价文案
}

// --- Page2：冲突面板 — 假设选项 ---
export const HYPOTHESIS_OPTIONS = [
  { id: 'entry-change', label: '入口变化影响新用户路径' },
  { id: 'android-perf', label: 'Android 低端机性能问题' },
  { id: 'feedback-rep', label: '客服反馈代表整体体验问题' },
  { id: 'wait-data', label: '暂不判断，等待更多数据' },
] as const

// --- 策略卡（替代旧单选行动方案）---
export interface StrategyCard {
  id: string
  label: string
  cost: string
}

export const STRATEGY_CARDS: StrategyCard[] = [
  { id: 'onboarding-fix', label: '新用户引导微调：增加入口提示和新手引导补偿', cost: '运营可快速执行，但可能只缓解表层问题' },
  { id: 'channel-target', label: '渠道 A 定向触达：对异常渠道用户发送 FAQ 和补偿提醒', cost: '聚焦异常人群，执行成本低，但覆盖有限' },
  { id: 'key-track', label: '关键埋点排查：用 1 人天检查关键埋点和异常渠道', cost: '能验证技术线索，但工程资源被占用、短期止损弱' },
  { id: 'rollback-eval', label: '推动版本回滚评估：发起回滚讨论并准备风险说明', cost: '可能快速止损，但组织阻力大、说服成本高' },
  { id: 'light-touch', label: '小范围运营调整：先做轻量入口提示，同步监控数据变化', cost: '风险低、适合快速试探，但不申请额外工程支持' },
]

// 假设 → 策略标签映射（每个假设最多 3 条标签）
export const STRATEGY_LABELS: Record<string, Record<string, string>> = {
  'entry-change': {
    'onboarding-fix': '最直接验证',
    'channel-target': '可辅助验证',
    'rollback-eval': '组织阻力高',
  },
  'android-perf': {
    'key-track': '最直接验证',
    'onboarding-fix': '只能缓解',
    'light-touch': '暂缓技术验证',
  },
  'feedback-rep': {
    'onboarding-fix': '可验证入口假设',
    'channel-target': '可验证人群假设',
    'key-track': '间接验证',
  },
  'wait-data': {
    'light-touch': '最低风险试探',
    'rollback-eval': '证据不足时高风险',
  },
}

// 团队风格标签
export type TeamStyle = '问题定位型' | '体验归因型' | '外部观察型' | '混合探索型'

export function getTeamStyle(agentIds: string[]): { style: TeamStyle; feedback: string } {
  const hasData = agentIds.includes('data-ai')
  const hasEng = agentIds.includes('eng-ai')
  const hasCS = agentIds.includes('feedback-ai')
  const hasProduct = agentIds.includes('product-ai')
  const hasCompetitor = agentIds.includes('competitor-ai')

  if (hasData && hasEng) {
    return {
      style: '问题定位型',
      feedback: '适合从数据异常和技术风险两侧建立判断，但用户声音和产品体验视角可以后续补充。',
    }
  }
  if (hasData && hasCS && hasProduct) {
    return {
      style: '体验归因型',
      feedback: '适合快速建立用户反馈与产品路径之间的假设，但技术风险需要在后续阶段补充验证。',
    }
  }
  if (hasCompetitor && !hasEng) {
    return {
      style: '外部观察型',
      feedback: '关注外部参照和用户声音，技术深度相对较浅，后续可补充工程排查视角。',
    }
  }
  return {
    style: '混合探索型',
    feedback: '覆盖面较广，后续可逐步聚焦关键方向。',
  }
}

// --- Page2：子任务三 — 复盘 Agent 创建 ---
export const REVIEW_TRIGGERS = [
  '版本上线后留存异常',
  '客服负面反馈上升',
  '新用户转化下降',
  '某渠道数据异常',
  '产品改版后路径争议',
] as const

export const REVIEW_FLOW_STEPS = [
  '数据分群定位异常',
  '用户反馈聚类',
  '产品路径变化分析',
  '技术与埋点排查',
  '建立问题假设',
  '评估组织资源',
  '生成短期动作',
  '输出复盘报告',
] as const

export const CONFLICT_PRINCIPLES = [
  '不直接采信单一 Agent 结论',
  '优先建立假设并验证',
  '区分短期止损与长期优化',
  '在组织约束下选择可执行方案',
] as const

export const OUTPUT_TEMPLATES = [
  '异常现象',
  '关键证据',
  '可能原因',
  '短期动作',
  '长期建议',
  '需要协同的团队',
] as const

// --- Page3 — 身份进化 ---
export interface Page3BehaviorEvidence {
  agentCount: number
  budgetExceeded: boolean
  handledConflict: boolean
  resourceDecision: string
  createdAgent: boolean
  agentComplete: boolean
}

// --- 全局状态 ---
export interface AppState {
  currentPage: AppPage
  currentNode: JourneyNode

  // Page1 信号
  p1Scene1Workflow: string[]
  p1Scene1NextAction: 'A' | 'B' | 'C' | 'D' | null
  p1Scene2Agents: string[]
  p1Scene2Roles: Record<string, Scene2Role>
  p1Scene2Reason: string
  p1Identity: Identity | null

  // Page2 信号
  p2Task1Agents: string[]
  p2Task1Roles: Record<string, string>
  p2Task1Reason: string
  p2Task2Evidence: string[]
  p2Task2Hypothesis: string | null
  p2Task2Action: string | null
  p2Task2Reason: string
  p2Task3Name: string
  p2Task3Triggers: string[]
  p2Task3Flow: string[]
  p2Task3Principles: string[]
  p2Task3Template: string[]

  // 开场弹窗
  showWelcome: boolean
  scene1Complete: boolean
  scene2Complete: boolean
  page2Complete: boolean
}
