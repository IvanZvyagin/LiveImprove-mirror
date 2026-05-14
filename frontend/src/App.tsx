import { Navigate, Route, Routes } from 'react-router-dom'
import RequireAuth from './auth/RequireAuth'
import AppLayout from './layout/AppLayout'
import Analytics from './pages/Analytics'
import Auth from './pages/Auth'
import Calendar from './pages/Calendar'
import Goals from './pages/Goals'
import Habits from './pages/Habits'
import Home from './pages/Home'
import NewGoal from './pages/NewGoal'

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/goals/new" element={<NewGoal />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/habits" element={<Habits />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </AppLayout>
          </RequireAuth>
        }
      />
    </Routes>
  )
}
