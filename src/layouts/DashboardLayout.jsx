import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar,
  ClipboardCheck,
  Coins,
  FileText,
  Settings,
  LogOut,
  User,
  Bell,
  MessageSquare,
  Menu,
  X,
} from 'lucide-react'
import BookLogo1 from '@/assets/BookLogo1.png'
import { useAuthStore } from '@/store/authStore'

const DashboardLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const isWelcomePage = location.pathname === '/'
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [logoutMenuOpen, setLogoutMenuOpen] = useState(false)

  const displayName =
    [user?.profile?.firstName, user?.profile?.lastName].filter(Boolean).join(' ') ||
    user?.name ||
    'User'
  const roleLabel = user?.role?.replace(/_/g, ' ') || 'User'

  const isRouteActive = (href) => location.pathname === href
  const hideSidebar =
    location.pathname === '/students/add' ||
    (location.pathname.startsWith('/students/') && location.pathname !== '/students/add')

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Admission',
       icon: Calendar,
       children: [
         { name: 'Admission Form', href: 'admissions/form' },
         { name: 'Admission List', href: 'admissions/list' },
       ]
    },
    { name: 'Students', href: 'students', icon: Users },
    { name: 'Teachers', href: 'teachers', icon: GraduationCap },
    {
      name: 'Academic',
      icon: BookOpen,
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
        { name: 'Fees Structure', href: '/fees/structures' },
        { name: 'Payments', href: '/fees/payments' },
      ]
    },
    { name: 'Communication', href: '/communication/announcements', icon: MessageSquare },
    ...(user?.role === 'super_admin' ? [{ name: 'Users', href: '/users', icon: User }] : []),
  ]

  const handleLogout = () => {
    setLogoutMenuOpen(false)
    logout()
    navigate('/login')
  }

  const HeaderRight = ({ compact = false }) => (
    <div className={`flex items-center ${compact ? 'gap-2' : 'gap-4'}`}>
      <button
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
      </button>
      <div className="flex items-center gap-2">
        <div className="text-right leading-tight">
          <div className="text-sm font-semibold text-gray-900">
            {displayName}
          </div>
          <div className="text-xs text-gray-500 capitalize">{roleLabel}</div>
        </div>
        <User className="h-5 w-5 text-gray-700" />
      </div>
      <div className="relative">
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
          onClick={() => setLogoutMenuOpen((open) => !open)}
          aria-label="Log out"
        >
          <LogOut className="h-5 w-5" />
        </button>
        {logoutMenuOpen && (
          <div className="absolute right-0 mt-2 w-36 rounded-md border border-gray-200 bg-white shadow-lg">
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={handleLogout}
            >
              {/* <LogOut className="h-4 w-4" /> */}
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  )

  const NavLink = ({ item }) => {
    const isActive = isRouteActive(item.href)

    if (item.children) {
      const parentActive = item.children.some((child) => isRouteActive(child.href))

      return (
        <div className="space-y-2 ">
          <div
            className={`flex items-center px-3 py-2 text-sm font-semibold  ${
              parentActive ? 'text-gray-900' : 'text-gray-700'
            }`}
          >
            {item.icon && <item.icon className="mr-3 h-5 w-5 text-gray-900" />}
            {item.name}
          </div>
          <div className="pl-11 space-y-1">
            {item.children.map((child) => {
              const childActive = isRouteActive(child.href)
              return (
                <Link
                  key={child.name}
                  to={child.href}
                  className={`block rounded-lg px-3 py-1.5 text-sm ${
                    childActive
                      ? 'bg-primary-50 font-medium text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
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
        className={`flex items-center rounded-lg px-3 py-2 text-sm font-semibold ${
          isActive
            ? 'bg-primary-50 text-primary-700'
            : 'text-gray-900 hover:bg-gray-100'
        }`}
      >
        {item.icon && <item.icon className="mr-3 h-5 w-5" />}
        {item.name}
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 ">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <span className="text-xl font-bold text-primary-600">SMS</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            
            </div>
            <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
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
      )}

      {/* Desktop sidebar */}
      {!hideSidebar && (
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col ">
          <div className="flex flex-col flex-1 min-h-0 bg-white border-r ">
            <div className="flex items-center justify-center h-16 px-4 border-b font-serif">
              <img src={BookLogo1} alt="" className='w-14 h-12'/>
              <span className="text-4xl font-bold ">SMS</span>
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
      )}

      {/* Desktop header */}
      <div
        className={`fixed top-0 right-0 z-30 hidden h-[64px] items-center justify-between border-b bg-white px-6 lg:flex ${
          hideSidebar ? 'lg:left-0' : 'lg:left-[240px]'
        }`}
      >
        {hideSidebar ? (
          <div className="flex items-center gap-2 font-serif">
            <img src={BookLogo1} alt="" className="h-14 w-16" />
            <span className="text-3xl font-bold">SMS</span>
          </div>
        ) : (
          <div />
        )}
        <HeaderRight />
      </div>

      {/* Mobile header */}
      <div className="flex items-center justify-between h-16 px-4 bg-white border-b lg:hidden">
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2 font-serif">
          <img src={BookLogo1} alt="" className="h-7 w-7" />
          <span className="text-lg font-semibold text-gray-900">SMS</span>
        </div>
        <HeaderRight compact />
      </div>

      {/* Main content */}
      <div className={`pt-16 lg:pt-[68px] ${hideSidebar ? 'lg:pl-0' : 'lg:pl-[240px]'}`}>
        <main className="h-[calc(100vh-68px)] overflow-auto px-10">
          <Outlet/>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
