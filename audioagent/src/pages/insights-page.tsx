import { Sparkles } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const insights = [
  {
    title: 'Most common objections',
    description: 'Budget timing and CRM integration effort are top objections this week.',
  },
  {
    title: 'Best performing company',
    description: 'BluePeak SaaS leads conversion at 69.2% with high confidence interactions.',
  },
  {
    title: 'Qualification trends',
    description: 'Healthcare pipeline improved 8.4% after prompt updates.',
  },
  {
    title: 'Lead quality score',
    description: 'Average score rose from 61 to 67 across enterprise campaigns.',
  },
  {
    title: 'Suggested improvements',
    description: 'Add objection-specific rebuttals for pricing and security concerns.',
  },
]

export function InsightsPage() {
  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-semibold'>AI Insights</h1>
      <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {insights.map((insight) => (
          <Card key={insight.title} className='relative overflow-hidden'>
            <div className='absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand/10 blur-2xl' />
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Sparkles className='h-4 w-4 text-brand' /> {insight.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-slate-600 dark:text-slate-300'>{insight.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
