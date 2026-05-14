import type { ButtonHTMLAttributes } from 'react'
import styles from './FabAddButton.module.css'

type FabAddButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  ariaLabel: string
  size?: 'default' | 'compact'
}

export default function FabAddButton({
  ariaLabel,
  size = 'default',
  className,
  type = 'button',
  ...props
}: FabAddButtonProps) {
  const rootClass =
    size === 'compact' ? `${styles.root} ${styles.compact}` : styles.root
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`${rootClass}${className ? ` ${className}` : ''}`}
      {...props}
    >
      <svg
        className={styles.icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <circle cx="20" cy="20" r="16.5" stroke="currentColor" strokeWidth="1.35" />
        <path
          d="M20 12.5v15M12.5 20h15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}
