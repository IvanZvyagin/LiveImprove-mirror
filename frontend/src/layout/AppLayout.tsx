import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Главная', icon: '⌂' },
  { to: '/goals', label: 'Цели', icon: '◎' },
  { to: '/habits', label: 'Привычки', icon: '✓' },
  { to: '/calendar', label: 'Календарь', icon: '🗓' },
  { to: '/analytics', label: 'Аналитика', icon: '▥' },
]

type AppLayoutProps = {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-mark">{'</>'}</span>
          <span className="logo-text">LiveImprove</span>
        </div>
        <nav className="nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-card">
          <div className="sidebar-card-title">Pro версия</div>
          <div className="sidebar-card-text">Больше возможностей для достижения целей.</div>
          <button className="sidebar-card-button" type="button">
            Подробнее
          </button>
        </div>
        <div className="user-card">
          <div className="avatar">АК</div>
          <div>
            <div className="user-name">Алексей</div>
            <div className="user-role">Про план</div>
          </div>
        </div>
      </aside>
      <main className="content">{children}</main>
    </div>
  )
}
