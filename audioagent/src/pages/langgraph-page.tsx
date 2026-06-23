import { motion } from 'framer-motion'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const nodes = [
  'Fetch Lead',
  'Build Prompt',
  'Dispatch Call',
  'Wait Webhook',
  'Evaluate Transcript',
  'Human Review',
  'Update Status',
]

export function LanggraphPage() {
  const currentNode = 'Evaluate Transcript'

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-semibold'>LangGraph Visualization</h1>
      <Card>
        <CardHeader>
          <CardTitle>Execution Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
            {nodes.map((node, index) => {
              const isCurrent = node === currentNode
              const isDone = index < nodes.indexOf(currentNode)

              return (
                <motion.div
                  key={node}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative rounded-xl border p-3 ${
                    isCurrent
                      ? 'border-sky-400 bg-sky-50 dark:bg-sky-900/20'
                      : isDone
                        ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <p className='text-sm font-semibold'>{node}</p>
                  <p className='text-xs text-slate-500'>Node #{index + 1}</p>
                  {index < nodes.length - 1 ? <span className='animated-edge' /> : null}
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
