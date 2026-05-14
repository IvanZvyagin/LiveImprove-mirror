import type { ButtonHTMLAttributes } from 'react'
import styles from './Chip.module.css'

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean
}

export default function Chip({ active, className, ...props }: ChipProps) {
  return (
    <button
      {...props}
      className={`${styles.chip}${active ? ` ${styles.active}` : ''}${className ? ` ${className}` : ''}`}
    />
  )
}
