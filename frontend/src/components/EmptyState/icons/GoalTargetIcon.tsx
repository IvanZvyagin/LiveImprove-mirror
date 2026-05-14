type Props = { size?: number }

export default function GoalTargetIcon({ size = 320 }: Props) {
  return (
    <img
      src="/empty-states/goals-target-transparent.png"
      width={size}
      height={size}
      alt=""
      aria-hidden
      draggable={false}
      style={{
        display: 'block',
        width: '100%',
        maxWidth: size,
        height: 'auto',
        objectFit: 'contain',
        userSelect: 'none',
        pointerEvents: 'none',
        filter: 'drop-shadow(0 26px 52px rgba(124, 58, 237, 0.48))',
      }}
    />
  )
}
