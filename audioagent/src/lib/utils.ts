import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPercent = (value: number) => `${value.toFixed(1)}%`

export const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US').format(value)
