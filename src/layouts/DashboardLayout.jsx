import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar,
  ClipboardCheck,
  FileText,
  DollarSign,
  MessageSquare,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Bell
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import Button from '@/components/ui/Button'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Students', href: '/students', icon: Users },
    { name: 'Teachers', href: '/teachers', icon: GraduationCap },
    {
      name: 'Academic',
      icon: BookOpen,
      children: [
        { name: 'Sessions', href: '/academic/sessions' },
        { name: 'Classes', href: '/academic/classes' },
        { name: 'Subjects', href: '/academic/subjects' },
        { name: 'Timetables', href: '/academic/timetables' },
      ]
    },
    { 
      name: 'Attendance', 
      icon: ClipboardCheck,
      children: [
        { name: 'Mark Attendance', href: '/attendance' },
        { name: 'Reports', href: '/attendance/report' },
      ]
    },
    { 
      name: 'Exams', 
      href: '/exams', 
      icon: FileText,
      children: [
        { name: 'Exams', href: '/exams' },
        { name: 'Results', href: '/exams/results' },
      ]
    },
    {
      name: 'Fees',
      icon: DollarSign,
      children: [
        { name: 'Fee Structures', href: '/fees/structures' },
        { name: 'Payments', href: '/fees/payments' },
      ]
    },
    { name: 'Communication', href: '/communication/announcements', icon: MessageSquare },
    ...(user?.role === 'super_admin' ? [{ name: 'Users', href: '/users', icon: User }] : []),
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const NavLink = ({ item, mobile = false }) => {
    const isActive = location.pathname === item.href
    
    if (item.children) {
      return (
        <div className="space-y-1">
          <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-600">
            {item.icon && <item.icon className="mr-3 h-5 w-5" />}
            {item.name}
          </div>
          <div className="pl-11 space-y-1">
            {item.children.map((child) => {
              const childActive = location.pathname === child.href
              return (
                <Link
                  key={child.name}
                  to={child.href}
                  className={`block px-3 py-2 text-sm rounded-lg ${
                    childActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => mobile && setSidebarOpen(false)}
                >
                  {child.name}
                </Link>
              )
            })}
          </div>
        </div>
      )
    }

    return (
      <Link
        to={item.href}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
          isActive
            ? 'bg-primary-50 text-primary-700'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        onClick={() => mobile && setSidebarOpen(false)}
      >
        {item.icon && <item.icon className="mr-3 h-5 w-5" />}
        {item.name}
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white">
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <span className="text-xl font-bold text-primary-600">SMS</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-1">
              {navigation.map((item) => (
                <NavLink key={item.name} item={item} mobile />
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r">
          <div className="flex items-center h-16 px-4 border-b">
            <span className="text-xl font-bold text-primary-600">School Management</span>
          </div>
          <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-1">
            {navigation.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </nav>
          <div className="p-4 border-t">
            <Link
              to="/settings/school"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top navbar */}
        <header className="sticky top-0 z-10 flex h-16 bg-white border-b shadow-sm">
          <div className="flex items-center justify-between w-full px-4">
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center ml-auto space-x-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.profile?.firstName} {user?.profile?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to="/settings/profile"
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <User className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout

