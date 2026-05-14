import type { ComponentType, ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import ProfileDrawer from '../components/ProfileDrawer'
import TopUserChip from '../components/TopUserChip'
import { FW } from '../icons/focusWayPalette'
import {
  IconLogoCode,
  IconSidebarAnalytics,
  IconSidebarCalendar,
  IconSidebarGoals,
  IconSidebarHabits,
  IconSidebarHome,
  NeonWrap,
} from '../icons/FocusWayIcons'

type NavIcon = ComponentType<{ size?: number }>

const links: { to: string; label: string; Icon: NavIcon; color: string }[] = [
  { to: '/', label: 'Главная', Icon: IconSidebarHome, color: FW.blue },
  { to: '/goals', label: 'Цели', Icon: IconSidebarGoals, color: FW.purple },
  { to: '/habits', label: 'Привычки', Icon: IconSidebarHabits, color: FW.green },
  { to: '/calendar', label: 'Календарь', Icon: IconSidebarCalendar, color: FW.amber },
  { to: '/analytics', label: 'Аналитика', Icon: IconSidebarAnalytics, color: FW.pink },
]

type AppLayoutProps = {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { pathname } = useLocation()

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-mark" aria-hidden>
            <NeonWrap color={FW.purple} strength="soft" size={22}>
              <IconLogoCode size={20} />
            </NeonWrap>
          </div>
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
              {({ isActive }) => (
                <>
                  <span className="nav-icon">
                    <NeonWrap color={link.color} strength={isActive ? 'full' : 'soft'} active={isActive} size={22}>
                      <link.Icon size={20} />
                    </NeonWrap>
                  </span>
                  {link.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <div className="app-topbar">
          <TopUserChip />
        </div>
        <div key={pathname} className="page-shell">
          {children}
        </div>
      </main>
      <ProfileDrawer />
    </div>
  )
}
