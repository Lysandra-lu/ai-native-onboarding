import { motion } from 'framer-motion'
import { JOURNEY_NODES, type JourneyNode, type AppPage } from '@/lib/types'

interface Props {
  currentNode: JourneyNode
  currentPage: AppPage
}

const NODE_TO_STEP: Record<JourneyNode, number> = {
  calibrate: 1,
  collaborate: 2,
  decide: 3,
  solidify: 4,
  diffuse: 5,
}

export function GlobalProgressBar({ currentNode, currentPage }: Props) {
  const activeIdx = NODE_TO_STEP[currentNode] - 1

  return (
    <div className="flex-shrink-0 bg-odyssey-surface/60 border-b border-odyssey-border backdrop-blur-sm px-6 py-3">
      <div className="max-w-5xl mx-auto">
        {/* 标题 + 主线 */}
        <div className="text-center mb-2">
          <span className="text-xs uppercase tracking-[0.2em] text-odyssey-accent-glow font-medium">
            从协作习惯，到业务决策，再到组织复用
          </span>
        </div>

        {/* 进度条 */}
        <div className="flex items-center gap-0">
          {JOURNEY_NODES.map((node, idx) => {
            const isActive = idx === activeIdx
            const isPast = idx < activeIdx
            const isLast = idx === JOURNEY_NODES.length - 1

            return (
              <div key={node.key} className="flex items-center flex-1 last:flex-none">
                {/* 节点 */}
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
                      isActive
                        ? 'bg-odyssey-accent text-white shadow-lg shadow-odyssey-accent/30'
                        : isPast
                          ? 'bg-odyssey-accent/30 text-odyssey-accent-glow'
                          : 'bg-odyssey-border text-odyssey-muted'
                    }`}
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {idx + 1}
                  </motion.div>
                  <span
                    className={`text-[10px] mt-1 transition-colors duration-300 ${
                      isActive ? 'text-odyssey-accent-glow font-medium' : isPast ? 'text-odyssey-muted' : 'text-odyssey-muted/50'
                    }`}
                  >
                    {node.label}
                  </span>
                  {isActive && (
                    <span className="text-[9px] text-odyssey-muted/60 mt-0.5 max-w-[80px] text-center leading-tight">
                      {node.subtitle}
                    </span>
                  )}
                </div>

                {/* 连线 */}
                {!isLast && (
                  <div className="flex-1 mx-2 h-0.5 relative">
                    <div className="absolute inset-0 bg-odyssey-border rounded-full" />
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-odyssey-accent/60 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: isPast ? '100%' : '0%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
