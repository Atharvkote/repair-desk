// App.jsx
// Dependencies
import React, { Fragment } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

// Layouts
import Navabr from './components/layout/client/blended-navabr'
import Footer from './components/layout/client/blended-footer'

// Pages
import Home from './pages/home-page'
import NotFound from './pages/not-found-page'
import Login from './pages/auth/login-page'
import Register from './pages/auth/register-page'
import Loader from './components/utils/loader'
import ServiceForm from './components/admin/service-management/step-form'
import AdminLayout from './components/layout/admin-layout'
import ActiveServices from './pages/active-services-page'
import ServiceHistory from './pages/service-history-page'
import ServiceCatalog from './pages/service-catalog-page'
import PartsCatalog from './pages/parts-catalog-page'
import AdminManagement from './pages/teams-page'
import SettingsPage from './pages/settings-page'

// // Protected Route Component
// const ProtectedRoute = ({ children }) => {

//   // const { isLoggedIn, isLoading } = useAuth()
//   const isLoggedIn = true
//   const isLoading = false

//   if (isLoading) { return (<Loader />) }
//   if (!isLoggedIn) { return <Navigate to="/login" replace /> }
//   return children
// }

// const PublicRoute = ({ children }) => {

//   // const { isLoggedIn, isLoading } = useAuth()
//   const isLoggedIn = true
//   const isLoading = false

//   if (isLoading) { return (<Loader />) }
//   if (isLoggedIn) { return <Navigate to="/dashboard" replace /> }
//   return children
// }

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path='/'
        element={
          <ServiceForm />
        }
      />
      <Route
        path='/login'
        element={
          <Login />
        }
      />
      <Route
        path='/register'
        element={
          <Register />
        }
      />

      {/* Protected  Routes */}
      {/* Root Route */}
      <Route exact path="/admin" element={<AdminLayout />}>
        <Route path='service' element={<ServiceForm />} />
        <Route path='service/list' element={<ActiveServices />} />
        <Route path='history' element={<ServiceHistory />} />
        <Route path='catalog/services' element={<ServiceCatalog />} />
        <Route path='catalog/parts' element={<PartsCatalog />} />
        <Route path='catalog/parts' element={<PartsCatalog />} />
        <Route path='teams' element={<AdminManagement />} />
        <Route path='settings' element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Global 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

const App = () => {

  const NoNavbarRoutes = [];
  const NoFooterRoutes = [];
  const pathname = useLocation().pathname;

  return (
    <Fragment>
      {!NoNavbarRoutes.includes(pathname) && <Navabr />}
      <AppRoutes />
      {!NoFooterRoutes.includes(pathname) && <Footer />}
    </Fragment>
  )
}

export default App