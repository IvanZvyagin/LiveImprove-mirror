import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './IconButton.module.css'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  badge?: ReactNode
}

export default function IconButton({ badge, className, children, ...props }: IconButtonProps) {
  return (
    <button {...props} className={`${styles.button}${className ? ` ${className}` : ''}`}>
      {children}
      {badge ? <span className={styles.badge}>{badge}</span> : null}
    </button>
  )
}
