import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import FloatingLeaves from './components/FloatingLeaves.jsx'
import ProtectedRoute from './auth/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Checker from './pages/Checker.jsx'
import Interactions from './pages/Interactions.jsx'
import Help from './pages/Help.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'

// Route transition: fade + slight upward slide.
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

function Page({ children }) {
  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-[60vh]"
    >
      {children}
    </motion.main>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen flex-col">
        {/* Ambient falling-leaf layer behind all content */}
        <FloatingLeaves density={14} />
        <Navbar />
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <Page>
                  <Home />
                </Page>
              }
            />
            <Route
              path="/checker"
              element={
                <ProtectedRoute>
                  <Page>
                    <Checker />
                  </Page>
                </ProtectedRoute>
              }
            />
            <Route
              path="/interactions"
              element={
                <Page>
                  <Interactions />
                </Page>
              }
            />
            <Route
              path="/help"
              element={
                <Page>
                  <Help />
                </Page>
              }
            />
            <Route
              path="/login"
              element={
                <Page>
                  <Login />
                </Page>
              }
            />
            <Route
              path="/signup"
              element={
                <Page>
                  <Signup />
                </Page>
              }
            />
            <Route
              path="*"
              element={
                <Page>
                  <Home />
                </Page>
              }
            />
          </Routes>
        </AnimatePresence>
        </div>
        <Footer />
      </div>
    </MotionConfig>
  )
}
