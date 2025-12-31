import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useAuthStore } from './store/authStore'

// Layouts
import DashboardLayout from './layouts/DashboardLayout'
import AuthLayout from './layouts/AuthLayout'

// Pages
import Login from './pages/auth/Login'
import Dashboard from './pages/Dashboard'
import Students from './pages/students/Students'
import StudentDetails from './pages/students/StudentDetails'
import AddStudent from './pages/students/AddStudent'
import Teachers from './pages/teachers/Teachers'
import TeacherDetails from './pages/teachers/TeacherDetails'
import AddTeacher from './pages/teachers/AddTeacher'
import Classes from './pages/academic/Classes'
import Subjects from './pages/academic/Subjects'
import Timetables from './pages/academic/Timetables'
import Sessions from './pages/academic/Sessions'
import Attendance from './pages/attendance/Attendance'
import AttendanceReport from './pages/attendance/AttendanceReport'
import Exams from './pages/exams/Exams'
import Results from './pages/exams/Results'
import FeeStructures from './pages/fees/FeeStructures'
import FeePayments from './pages/fees/FeePayments'
import Announcements from './pages/communication/Announcements'
import Users from './pages/users/Users'
import SchoolProfile from './pages/settings/SchoolProfile'
import Profile from './pages/settings/Profile'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore()
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Dashboard Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          
          {/* Students */}
          <Route path="students" element={<Students />} />
          <Route path="students/add" element={<AddStudent />} />
          <Route path="students/:id" element={<StudentDetails />} />
          
          {/* Teachers */}
          <Route path="teachers" element={<Teachers />} />
          <Route path="teachers/add" element={<AddTeacher />} />
          <Route path="teachers/:id" element={<TeacherDetails />} />
          
          {/* Academic */}
          <Route path="academic/sessions" element={<Sessions />} />
          <Route path="academic/classes" element={<Classes />} />
          <Route path="academic/subjects" element={<Subjects />} />
          <Route path="academic/timetables" element={<Timetables />} />
          
          {/* Attendance */}
          <Route path="attendance" element={<Attendance />} />
          <Route path="attendance/report" element={<AttendanceReport />} />
          
          {/* Exams */}
          <Route path="exams" element={<Exams />} />
          <Route path="exams/results" element={<Results />} />
          
          {/* Fees */}
          <Route path="fees/structures" element={<FeeStructures />} />
          <Route path="fees/payments" element={<FeePayments />} />
          
          {/* Communication */}
          <Route path="communication/announcements" element={<Announcements />} />
          
          {/* Users */}
          <Route path="users" element={<Users />} />
          
          {/* Settings */}
          <Route path="settings/school" element={<SchoolProfile />} />
          <Route path="settings/profile" element={<Profile />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App

