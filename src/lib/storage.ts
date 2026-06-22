import type { AppState, AppPage, JourneyNode, Identity } from './types'

const STORAGE_KEY = 'ai-native-journey'

const DEFAULT_STATE: AppState = {
  currentPage: 'page1',
  currentNode: 'calibrate',
  p1Scene1Workflow: [],
  p1Scene1NextAction: null,
  p1Scene2Agents: [],
  p1Scene2Roles: {},
  p1Scene2Reason: '',
  p1Identity: null,
  p2Task1Agents: [],
  p2Task1Roles: {},
  p2Task1Reason: '',
  p2Task2Evidence: [],
  p2Task2Hypothesis: null,
  p2Task2Action: null,
  p2Task2Reason: '',
  p2Task3Name: '《V2.3 版本复盘 Agent》',
  p2Task3Triggers: [],
  p2Task3Flow: [],
  p2Task3Principles: [],
  p2Task3Template: [],
  showWelcome: true,
  scene1Complete: false,
  scene2Complete: false,
  page2Complete: false,
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_STATE }
    return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

export function saveState(partial: Partial<AppState>): void {
  const current = loadState()
  const next = { ...current, ...partial }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function resetState(): void {
  localStorage.removeItem(STORAGE_KEY)
}

// --- Page1 身份判断 ---
export function calculateIdentity(state: AppState): Identity {
  let workflowScore = 0
  let agentScore = 0
  let verifyScore = 0
  let orgScore = 0

  // 场景一：工作流
  const wf = state.p1Scene1Workflow
  const actionCards = ['check-focus', 'collect-news', 'compare-version', 'summarize-feedback', 'verify-source', 'gen-draft', 'optimize-structure', 'save-template', 'share-team']
  const hasMultipleSteps = wf.length >= 4
  const hasCollect = wf.some(id => ['collect-news', 'compare-version'].includes(id))
  const hasGenerate = wf.some(id => ['gen-draft', 'optimize-structure'].includes(id))
  const hasVerify = wf.includes('verify-source')
  const hasSave = wf.includes('save-template')
  const hasShare = wf.includes('share-team')
  const usesTool = wf.some(id => ['gpt', 'search', 'data-tool', 'doc-tool', 'code-assist'].includes(id))

  if (hasMultipleSteps && hasCollect && hasGenerate) workflowScore += 2
  if (usesTool && hasMultipleSteps) workflowScore += 1
  if (hasVerify) verifyScore += 2
  if (hasSave) orgScore += 2
  if (hasShare) orgScore += 2

  // 场景一下一步选择
  if (state.p1Scene1NextAction === 'C') orgScore += 2
  if (state.p1Scene1NextAction === 'D') orgScore += 2
  if (state.p1Scene1NextAction === 'B') workflowScore += 1

  // 场景二：Agent 组队
  const agents = state.p1Scene2Agents
  if (agents.length >= 3) agentScore += 2
  if (agents.length === 2) agentScore += 1
  if (agents.includes('data-ai')) agentScore += 1
  if (agents.includes('cs-ai')) agentScore += 1
  if (agents.includes('product-ai')) agentScore += 1
  if (agents.includes('eng-ai')) agentScore += 1

  // 职责分配合理性
  const roles = state.p1Scene2Roles
  const hasDataRole = Object.values(roles).some(r => r === '定位异常用户群')
  const hasFeedbackRole = Object.values(roles).some(r => r === '分析用户反馈')
  if (hasDataRole && agents.includes('data-ai')) agentScore += 1
  if (hasFeedbackRole && agents.includes('cs-ai')) agentScore += 1

  // 一句话理由
  if (state.p1Scene2Reason.length > 10) agentScore += 1

  // 优先级判断：组织沉淀型 > Agent协作型 > 工作流设计型 > 快速执行型
  if (orgScore >= 4) return '组织沉淀型新人'
  if (agentScore >= 4) return 'Agent协作型新人'
  if (workflowScore >= 3) return '工作流设计型新人'
  return '快速执行型新人'
}
