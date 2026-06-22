import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { X } from 'lucide-react'

interface Props {
  onDismiss: () => void
}

export function WelcomeModal({ onDismiss }: Props) {
  const [visible, setVisible] = useState(true)

  const handleDismiss = () => {
    setVisible(false)
    setTimeout(onDismiss, 300)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleDismiss}
        >
          <motion.div
            className="bg-odyssey-surface border border-odyssey-border rounded-2xl p-8 max-w-md mx-4 shadow-2xl shadow-odyssey-accent/10"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-odyssey-muted hover:text-odyssey-text transition-colors"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🚀</div>
              <h2 className="text-xl font-bold text-odyssey-text mb-2">
                欢迎来到 AI Native Journey
              </h2>
              <p className="text-sm text-odyssey-muted leading-relaxed">
                接下来，你将通过两个真实工作场景完成一次轻量热身。
                我们会通过观察你的 AI 协作习惯，生成你的初始 AI Native 身份。
              </p>
            </div>

            <Button
              variant="accent"
              size="lg"
              className="w-full"
              onClick={handleDismiss}
            >
              知道了，开始热身
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
