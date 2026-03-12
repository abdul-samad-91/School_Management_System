import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  BookCopy,
  Calendar,
  ClipboardCheck,
  Coins,
  FileText,
  LogOut,
  User,
  Bell,
  Settings,
} from 'lucide-react'
import BookLogo1 from '@/assets/BookLogo1.png'
import { useAuthStore } from '@/store/authStore'

const DashboardLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const isWelcomePage = location.pathname === '/'

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    {
      name: 'Admissions',
      icon: FileText,
      children: [
        { name: 'Admission Form', href: '/students/add' },
        { name: 'Admissions List', href: '/students' },
      ],
    },
    { name: 'Students', href: 'students', icon: Users },
    { name: 'Teachers', href: 'teachers', icon: GraduationCap },
    {
      name: 'Academic',
      icon: BookCopy,
      children: [
        { name: 'Sessions', href: '/academic/sessions' },
        { name: 'Classes', href: '/academic/classes' },
        { name: 'Subjects', href: '/academic/subjects' },
        { name: 'Timetables', href: '/academic/timetables' },
      ],
    },
    {
      name: 'Attendence',
      icon: ClipboardCheck,
      children: [
        { name: 'Student', href: '/attendance/students' },
        { name: 'Teacher', href: '/attendance/teachers' },
        { name: 'Reports', href: '/attendance/report' },
      ],
    },
    {
      name: 'Exams',
      href: '/exams',
      icon: FileText,
      children: [{ name: 'Exams', href: '/exams' }, { name: 'Results', href: '/exams/results' }],
    },
    {
      name: 'Fees',
      icon: Coins,
      children: [
        { name: 'Fee Structure', href: '/fees/structures' },
        { name: 'Payments', href: '/fees/payments' },
      ],
    },
  ]

  const fullName =
    [user?.profile?.firstName, user?.profile?.lastName].filter(Boolean).join(' ') || 'Admin User'
  const roleLabel = user?.role?.replace('_', ' ') || 'Admin'

  const isRouteActive = (href) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/'
    }
    return location.pathname === href
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const NavLink = ({ item }) => {
    const isActive = isRouteActive(item.href)

    if (item.children) {
      const parentActive = item.children.some((child) => isRouteActive(child.href))

      return (
        <div className="space-y-2">
          <div
            className={`flex items-center px-3 py-2 text-sm font-semibold ${
              parentActive ? 'text-gray-900' : 'text-gray-700'
            }`}
          >
            {item.icon && (
              <item.icon
                className={`mr-3.5 h-6 w-6 shrink-0 ${parentActive ? 'text-blue-700' : 'text-gray-900'}`}
              />
            )}
            <span>{item.name}</span>
          </div>
          <div className="space-y-2.5 pl-12">
            {item.children.map((child) => {
              const childActive = isRouteActive(child.href)
              return (
                <Link
                  key={child.name}
                  to={child.href}
                  className={`block rounded-lg px-2 py-1.5 text-sm ${
                    childActive
                      ? 'bg-blue-100 font-semibold text-blue-700'
                      : 'text-gray-800 hover:text-gray-900'
                  }`}
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
        className={`flex items-center rounded-lg px-3 py-2 text-base font-semibold ${
          isActive
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-900 hover:text-gray-950'
        }`}
      >
        {item.icon && (
          <item.icon className={`mr-3.5 h-6 w-6 shrink-0 ${isActive ? 'text-blue-700' : 'text-gray-900'}`} />
        )}
        <span>{item.name}</span>
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-[#ececec]">
      {isWelcomePage ? (
        <main className="h-screen overflow-auto p-6">
          <Outlet />
        </main>
      ) : (
        <>
          {/* Top navbar */}
          <header className="fixed inset-x-0 top-0 z-40 h-[68px] border-b border-gray-300 bg-white">
            <div className="flex h-full items-center justify-between px-10">
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className="flex items-center gap-3">
                  <BookOpen className="h-7 w-7 text-gray-900" />
                  <span className="text-2xl font-bold leading-none text-gray-900">SMS</span>
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                  <Bell className="h-6 w-6" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                </button>

                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{fullName}</p>
                  <p className="text-xs font-semibold capitalize text-gray-500">{roleLabel}</p>
                </div>

                <Link to="/settings/profile" className="rounded-lg p-2 text-gray-900 hover:bg-gray-100" title="Profile">
                  <User className="h-6 w-6" />
                </Link>
                <button onClick={handleLogout} className="rounded-lg p-2 text-gray-900 hover:bg-gray-100" title="Logout">
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            </div>
          </header>

          {/* Desktop sidebar */}
          <aside className="fixed bottom-0 left-0 top-[68px] flex w-[240px] flex-col border-r border-gray-300 bg-[#f5f5f5]">
            <nav className="flex-1 space-y-2 overflow-y-auto px-5 py-4">
              {navigation.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
            </nav>
            <div className="border-t border-gray-300 p-4">
              <Link
                to="/settings/profile"
                className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50"
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <div className="pt-[68px] pl-[240px]">
            <main className="h-[calc(100vh-68px)] overflow-auto p-5">
              <Outlet />
            </main>
          </div>
        </>
      )}
    </div>
  )
}

export default DashboardLayout
