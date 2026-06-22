import { useState, useCallback } from 'react'
import { loadState, saveState, calculateIdentity, resetState } from '@/lib/storage'
import type { AppState, AppPage, JourneyNode, Identity } from '@/lib/types'
import { JOURNEY_NODES } from '@/lib/types'
import { GlobalProgressBar } from '@/components/GlobalProgressBar'
import { WelcomeModal } from '@/components/WelcomeModal'
import { Page1 } from '@/pages/Page1'
import { Page2 } from '@/pages/Page2'
import { Page3 } from '@/pages/Page3'

export default function App() {
  const [state, setState] = useState<AppState>(loadState)

  const update = useCallback((partial: Partial<AppState>) => {
    setState(prev => {
      const next = { ...prev, ...partial }
      saveState(next)
      return next
    })
  }, [])

  const navigateTo = useCallback((page: AppPage, node: JourneyNode) => {
    update({ currentPage: page, currentNode: node })
  }, [update])

  const dismissWelcome = useCallback(() => {
    update({ showWelcome: false })
  }, [update])

  const completeScene1 = useCallback((workflow: string[]) => {
    update({ p1Scene1Workflow: workflow, scene1Complete: true })
  }, [update])

  const completeScene2 = useCallback((agents: string[], roles: Record<string, string>, reason: string) => {
    const newState: Partial<AppState> = {
      p1Scene2Agents: agents,
      p1Scene2Roles: roles as Record<string, any>,
      p1Scene2Reason: reason,
      scene2Complete: true,
    }
    update(newState)
    // Calculate identity after both scenes are done
    const fullState = { ...loadState(), ...newState }
    const identity = calculateIdentity(fullState)
    update({ p1Identity: identity })
  }, [update])

  const setScene1NextAction = useCallback((action: 'A' | 'B' | 'C' | 'D') => {
    update({ p1Scene1NextAction: action })
    // Recalculate identity
    const fullState: AppState = { ...loadState(), p1Scene1NextAction: action }
    const identity = calculateIdentity(fullState)
    update({ p1Identity: identity })
  }, [update])

  const updateP2 = useCallback((partial: Partial<AppState>) => {
    update(partial)
  }, [update])

  const handleReset = useCallback(() => {
    resetState()
    setState(loadState())
  }, [])

  return (
    <div className="h-screen overflow-hidden bg-subtle-move flex flex-col">
      {state.showWelcome && <WelcomeModal onDismiss={dismissWelcome} />}

      <GlobalProgressBar currentNode={state.currentNode} currentPage={state.currentPage} />

      <main className="flex-1 overflow-hidden">
        {state.currentPage === 'page1' && (
          <Page1
            state={state}
            onCompleteScene1={completeScene1}
            onCompleteScene2={completeScene2}
            onSetNextAction={setScene1NextAction}
            onNavigate={(page, node) => navigateTo(page, node)}
          />
        )}
        {state.currentPage === 'page2' && (
          <Page2
            state={state}
            onUpdate={updateP2}
            onNavigate={(page, node) => navigateTo(page, node)}
          />
        )}
        {state.currentPage === 'page3' && (
          <Page3
            state={state}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  )
}
