import type { HTMLAttributes } from 'react'
import styles from './Badge.module.css'

type BadgeVariant = 'habit' | 'task' | 'study' | 'interview' | 'meeting' | 'outline'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
}

export default function Badge({ variant, className, ...props }: BadgeProps) {
  const variantClass = variant ? styles[variant] : ''

  return <span {...props} className={`${styles.badge} ${variantClass}${className ? ` ${className}` : ''}`} />
}
