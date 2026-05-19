import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import styles from './Card.module.css'

type CardProps<T extends ElementType> = {
  as?: T
  className?: string
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>

export default function Card<T extends ElementType = 'div'>({
  as,
  className,
  children,
  ...rest
}: CardProps<T>) {
  const Component = (as ?? 'div') as ElementType

  return (
    <Component {...rest} className={`${styles.card}${className ? ` ${className}` : ''}`}>
      {children}
    </Component>
  )
}
