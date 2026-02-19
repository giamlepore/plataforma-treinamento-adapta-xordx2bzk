/* Main App Component */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import CourseDetails from './pages/CourseDetails'
import LessonPlayer from './pages/LessonPlayer'
import Login from './pages/Login'
import Layout from './components/Layout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCourseEdit from './pages/admin/AdminCourseEdit'
import { AuthProvider } from './hooks/use-auth'
import { OrganizationProvider } from './context/OrganizationContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'

const App = () => (
  <AuthProvider>
    <OrganizationProvider>
      <BrowserRouter
        future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/course/:courseId" element={<CourseDetails />} />
                <Route
                  path="/course/:courseId/lesson/:lessonId"
                  element={<LessonPlayer />}
                />

                {/* Admin Routes - Nested inside Layout to keep header, or could be separate layout */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route
                    path="/admin/courses/:courseId"
                    element={<AdminCourseEdit />}
                  />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </OrganizationProvider>
  </AuthProvider>
)

export default App
