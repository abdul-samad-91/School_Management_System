import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  // BookOpen,
  // BookCopy,
  // Calendar,
  // ClipboardCheck,
  // Coins,
  FileText,
  LogOut,
  User,
  // Bell,
  // Settings,
  Menu,
  X,
  // SettingsIcon,
} from 'lucide-react'
import BookLogo1 from '@/assets/BookLogo1.png'
import Admission from '@/assets/Admission.svg'
import bookIcon from '@/assets/bookIcon.svg'
import notes2 from '@/assets/notes2.svg'
import settingIcon from '@/assets/settingIcon.svg'
import whatsappIcon from '@/assets/whatsappIcon.svg'
import BellIcon from '@/assets/BellIcon.svg'
import StackofCoins2 from '@/assets/StackofCoins2.svg'
import examIcon from '@/assets/examIcon.svg'
import { useAuthStore } from '@/store/authStore'


const DashboardLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const isWelcomePage = location.pathname === '/'
  const hideSidebar =
    location.pathname === '/students/add' ||
    location.pathname.startsWith('/students/') ||
    location.pathname === '/teachers/add' ||
    location.pathname.startsWith('/teachers/')

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    {
      name: 'Admissions',
      icon: Admission,
      children: [
        { name: 'Admission Form', href: 'admissions/form' },
        { name: 'Admissions List', href: 'admissions/list' },
      ],
    },

    { name: 'Students', href: 'students', icon: Users },
    { name: 'Teachers', href: 'teachers', icon: GraduationCap },
    {
      name: 'Academic',
      icon: bookIcon,
      children: [
        { name: 'Sessions', href: '/academic/sessions' },
        { name: 'Classes', href: '/academic/classes' },
        { name: 'Subjects', href: '/academic/subjects' },
        { name: 'Timetables', href: '/academic/timetables' },
      ],
    },
    {
      name: 'Attendence',
      icon: notes2,
      children: [
        { name: 'Student', href: '/attendance/students' },
        { name: 'Teacher', href: '/attendance/teachers' },
        { name: 'Reports', href: '/attendance/report' },
      ],
    },
    {
      name: 'Exams',
      href: '/exams',
      icon: examIcon,
      children: [{ name: 'Exams', href: '/exams' }, { name: 'Results', href: '/exams/results' }],
    },
    {
      name: 'Fees',
      icon: StackofCoins2,
      children: [
        { name: 'Fee Structure', href: '/fees/structures' },
        { name: 'Payments', href: '/fees/payments' },
      ],
    },
    { name: 'Certificates', href: '/certificates', icon: FileText },
    { name: 'Whatsapp', href: '/communication/announcements', icon: whatsappIcon },
    { name: 'Users', href: '/users', icon: User },
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

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false)
  }

  const NavLink = ({ item }) => {
    const isActive = isRouteActive(item.href)

    if (item.children) {
      const parentActive = item.children.some((child) => isRouteActive(child.href))

      return (
        <div className="space-y-2">
          <div
            className={`flex items-center px-3 py-2 text-sm font-semibold ${parentActive ? 'text-gray-900' : 'text-gray-700'
              }`}
          >
            {item.icon &&
              (typeof item.icon === 'string' ? (
                <img
                  src={item.icon}
                  alt=""
                  className="mr-3.5 h-6 w-6 shrink-0"
                />
              ) : (
                <item.icon
                  className={`mr-3.5 h-6 w-6 shrink-0 ${parentActive ? 'text-blue-700' : 'text-gray-900'}`}
                />
              ))}
            <span>{item.name}</span>
          </div>
          <div className="space-y-2.5 pl-12">
            {item.children.map((child) => {
              const childActive = isRouteActive(child.href)
              return (
                <Link
                  key={child.name}
                  to={child.href}
                  className={`block rounded-lg px-2 py-1.5 text-sm ${childActive
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
        className={`flex items-center rounded-lg px-3 py-2 text-base font-semibold ${isActive
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-900 hover:text-gray-950'
          }`}
      >
        {item.icon &&
          (typeof item.icon === 'string' ? (
            <img
              src={item.icon}
              alt=""
              className="mr-3.5 h-6 w-6 shrink-0"
            />
          ) : (
            <item.icon className={`mr-3.5 h-6 w-6 shrink-0 ${isActive ? 'text-blue-700' : 'text-gray-900'}`} />
          ))}
        <span>{item.name}</span>
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-white">
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
                {!hideSidebar && (
                  <button
                    type="button"
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="inline-flex items-center justify-center rounded-lg p-2 text-gray-900 transition hover:bg-gray-100 lg:hidden"
                    aria-label="Open sidebar"
                  >
                    <Menu className="h-6 w-6" />
                  </button>
                )}
                <Link to="/dashboard" className="hidden items-center gap-3 md:flex">
                  {/* <BookOpen className="h-7 w-7 text-gray-900" /> */}
                  <img src={BookLogo1} alt="Book Logo" className='w-14 h-12' />
                  <span className="text-xl font-semibold leading-tight text-gray-900  ">School Management
                    <br /> System</span>
                </Link>
              </div>

              <div className="flex items-center gap-1">
                <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                  <img src={BellIcon} alt="" className="h-6 w-6" />

                  {/* Notification dot */}
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500
                   ring-4 ring-red-200
                   shadow-md shadow-red-400/50" />
                </button>

                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{fullName}</p>
                  <p className="text-xs font-semibold capitalize text-gray-500">{roleLabel}</p>
                </div>

                <Link to="/settings/profile" className="rounded-lg p-2 text-gray-900 hover:bg-gray-100" title="Profile">
                  {/* <User className="h-6 w-6" /> */}
                  <User className="h-7 w-7 " />
                </Link>
                <button onClick={handleLogout} className="rounded-lg p-2 text-gray-900 hover:bg-gray-100" title="Logout">
                  <LogOut className="h-7 w-7" />
                </button>
              </div>
            </div>
          </header>

          {/* Mobile sidebar */}
          {!hideSidebar && (
            <div
              className={`fixed inset-0 z-50 bg-black/40 transition-opacity lg:hidden ${isMobileSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              onClick={closeMobileSidebar}
            >
              <aside
                className={`absolute left-0 top-0 flex h-full w-[260px] flex-col bg-white transition-transform ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                  }`}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex h-[68px] items-center justify-between border-b border-gray-300 px-4">
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <img src={BookLogo1} alt="Book Logo" className='w-10 h-9' />
                    <span className="text-base font-semibold text-gray-900">School Management</span>
                  </Link>
                  <button
                    type="button"
                    onClick={closeMobileSidebar}
                    className="rounded-lg p-2 text-gray-900 hover:bg-gray-100"
                    aria-label="Close sidebar"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <nav className="flex-1 min-h-0 space-y-2 overflow-y-auto px-4 py-4 pb-6">
                  {navigation.map((item) => (
                    <NavLink key={item.name} item={item} />
                  ))}
                </nav>
                <div className="border-t border-gray-300 bg-white p-4 flex items-center">
                  {/* <Settings className="h-6 w-6" /> */}
                  <img src={settingIcon} alt="" className='w-6 h-6' />
                  <Link
                    to="/settings/school"
                    onClick={closeMobileSidebar}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-lg font-semibold text-gray-900 hover:bg-gray-50 focus:text-primary-500"
                  >
                    Settings
                  </Link>
                </div>
              </aside>
            </div>
          )}

          {/* Desktop sidebar */}
          {!hideSidebar && (
            <aside className="fixed bottom-0 left-0 top-[68px] hidden w-[240px] flex-col border-r border-gray-300 bg-white lg:flex">
              <nav className="flex-1 min-h-0 space-y-2 overflow-y-auto px-5 py-4 pb-6">
                {navigation.map((item) => (
                  <NavLink key={item.name} item={item} />
                ))}
              </nav>
              <div className="border-t border-gray-300 bg-white p-4 flex items-center">
                {/* <Settings className="h-6 w-6" /> */}
                <img src={settingIcon} alt="" className='w-6 h-6' />
                <Link
                  to="/settings/school"
                  className="flex items-center gap-3 rounded-lg   px-4 py-3 text-2xl font-semibold text-gray-900 hover:bg-gray-50 focus:text-primary-500"
                >
                  Settings
                </Link>
              </div>
            </aside>
          )}

          {/* Main content */}
          <div className={`pt-[68px] ${hideSidebar ? 'pl-0' : 'lg:pl-[240px]'}`}>
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
