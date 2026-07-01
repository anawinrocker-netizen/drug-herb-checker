import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './auth/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Checker from './pages/Checker.jsx'
import Interactions from './pages/Interactions.jsx'
import Help from './pages/Help.jsx'

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
    <div className="flex min-h-screen flex-col">
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
  )
}
