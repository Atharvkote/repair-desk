// App.jsx
// Dependencies
import React, { Fragment } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useAdminAuth } from './contexts/admin-auth-context'

// Layouts
import Footer from './components/layout/client/blended-footer'

// Auth Components
import ProtectedRoute from './components/auth/protected-routes'
import PublicRoute from './components/auth/public-routes'

// Pages
import NotFound from './pages/not-found-page'
import Login from './pages/auth/admin-login-page'
import Register from './pages/auth/client-register-page'
import AdminLayout from './components/layout/admin/admin-layout'
import ActiveServices from './pages/admin/active-services-page'
import ServiceHistory from './pages/admin/service-history-page'
import ServiceCatalog from './pages/admin/service-catalog-page'
import PartsCatalog from './pages/admin/parts-catalog-page'
import AdminManagement from './pages/admin/teams-page'
import SettingsPage from './pages/admin/settings-page'
import Overview from './pages/admin/overview-page'
import ServiceFormPage from './pages/admin/create-service-page'

// Loader
import Loader from './components/shared/loader'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path='/login'
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path='/register'
        element={
          <Register />
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path='service' element={<ServiceFormPage />} />
        <Route path='service/list' element={<ActiveServices />} />
        <Route path='history' element={<ServiceHistory />} />
        <Route path='catalog/services' element={<ServiceCatalog />} />
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
  const { isLoading } = useAdminAuth();
  const NoNavbarRoutes = [];
  const NoFooterRoutes = [];
  const pathname = useLocation().pathname;
  const isAdminRoute = pathname.startsWith('/admin');

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Fragment>
      <AppRoutes />
    </Fragment>
  )
}

export default App