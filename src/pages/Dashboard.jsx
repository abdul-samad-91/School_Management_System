import { useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  GraduationCap,
  BookOpen,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  PlusSquare,
  Clock3,
  BellRing,
  CalendarCheck2,
  FileText,
  ClipboardList,
  Leaf,
} from 'lucide-react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { dashboardAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

const FEE_CHART_DATA = [
  { quarter: 'Q1-24', totalFee: 54, collectedFee: 43 },
  { quarter: 'Q2-24', totalFee: 56, collectedFee: 50 },
  { quarter: 'Q3-24', totalFee: 55, collectedFee: 48 },
  { quarter: 'Q4-24', totalFee: 57, collectedFee: 50 },
  { quarter: 'Q1-25', totalFee: 54, collectedFee: 47 },
  { quarter: 'Q2-25', totalFee: 52, collectedFee: 41 },
  { quarter: 'Q3-25', totalFee: 50, collectedFee: 37 },
  { quarter: 'Q4-25', totalFee: 56, collectedFee: 44 },
]

const FEE_TICKS = [0, 10, 20, 30, 40, 50, 60]
const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const CALENDAR_HIGHLIGHT_DATES = ['2024-07-06', '2024-07-07', '2024-07-12', '2024-07-27']

const ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'New Syllabus Instructions',
    date: '11 Mar 2025',
    daysLeft: '20 Days',
    icon: FileText,
    iconStyles: 'bg-blue-100 text-blue-600',
  },
  {
    id: 2,
    title: 'Exam Preparation Notification!',
    date: '13 Mar 2025',
    daysLeft: '12 Days',
    icon: BellRing,
    iconStyles: 'bg-rose-100 text-rose-500',
  },
  {
    id: 3,
    title: 'Exam Time Table Release',
    date: '24 May 2025',
    daysLeft: '06 Days',
    icon: BookOpen,
    iconStyles: 'bg-amber-100 text-amber-600',
  },
  {
    id: 4,
    title: 'Classes Attendence Discussion',
    date: '24 May 2025',
    icon: ClipboardList,
    iconStyles: 'bg-sky-100 text-sky-600',
  },
  {
    id: 5,
    title: 'World Environment Day',
    date: '21 Apr 2025',
    icon: Leaf,
    iconStyles: 'bg-green-100 text-green-600',
  },
]

const UPCOMING_EVENTS = [
  {
    id: 1,
    title: 'Parents, Teacher Meet',
    date: '15 Nov 2025',
    time: '09:10 AM - 10:50 PM',
    accent: 'border-cyan-500',
    icon: Users,
    iconStyles: 'bg-sky-100 text-sky-600',
    attendees: ['AR', 'NS', 'MK'],
  },
  {
    id: 2,
    title: 'Staff Meeting',
    date: '10 Nov 2025',
    accent: 'border-blue-500',
    icon: GraduationCap,
    iconStyles: 'bg-indigo-100 text-indigo-600',
    attendees: [],
  },
  {
    id: 3,
    title: 'Winter Vacation Meeting',
    date: '07 Dec 2025 - 07 Jan 2026',
    time: '09:10 AM - 10:50 PM',
    accent: 'border-rose-500',
    icon: BellRing,
    iconStyles: 'bg-rose-100 text-rose-500',
    attendees: ['RM', 'AT'],
  },
]

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 6, 1))
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 6, 6))
  const [attendanceTab, setAttendanceTab] = useState('students')
  const [feeTooltip, setFeeTooltip] = useState({
    visible: false,
    x: 12,
    y: 12,
    label: '',
    totalFee: 0,
    collectedFee: 0,
  })
  const feeChartRef = useRef(null)

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await dashboardAPI.getStats()
      return response.data.data
    },
  })

  const fullName = [user?.profile?.firstName, user?.profile?.lastName].filter(Boolean).join(' ') || 'Admin'
  const studentsCount = stats?.students?.total ?? 400
  const teachersCount = stats?.teachers?.total ?? 400
  const classesCount = stats?.classes?.total ?? 400
  const newStudents = stats?.students?.newAdmissions ?? 10

  const studentAttendance = {
    present: stats?.attendance?.today?.present ?? 28,
    absent: stats?.attendance?.today?.absent ?? 1,
    late: stats?.attendance?.today?.late ?? 1,
  }

  const teacherAttendance = {
    present: stats?.teachers?.today?.present ?? 24,
    absent: stats?.teachers?.today?.absent ?? 2,
    late: stats?.teachers?.today?.late ?? 1,
  }

  const attendancePanelData = useMemo(() => {
    const formatSmallValue = (value) => String(value ?? 0).padStart(2, '0')

    return {
      students: {
        stats: [
          { label: 'Emergency', value: formatSmallValue(studentAttendance.present) },
          { label: 'Absent', value: formatSmallValue(studentAttendance.absent) },
          { label: 'Late', value: formatSmallValue(studentAttendance.late) },
        ],
        presentTotal: stats?.students?.total ?? 3610,
        absentTotal: Math.max(studentAttendance.absent, 44),
      },
      teachers: {
        stats: [
          { label: 'Emergency', value: formatSmallValue(teacherAttendance.present) },
          { label: 'Absent', value: formatSmallValue(teacherAttendance.absent) },
          { label: 'Late', value: formatSmallValue(teacherAttendance.late) },
        ],
        presentTotal: stats?.teachers?.total ?? 540,
        absentTotal: Math.max(teacherAttendance.absent, 12),
      },
    }
  }, [stats, studentAttendance, teacherAttendance])

  const activeAttendanceData = attendancePanelData[attendanceTab]
  const donutTotal = activeAttendanceData.presentTotal + activeAttendanceData.absentTotal
  const presentRingAngle = donutTotal > 0 ? (activeAttendanceData.presentTotal / donutTotal) * 360 : 0

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 })
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  const eventDateSet = useMemo(() => new Set(CALENDAR_HIGHLIGHT_DATES), [])

  const handleFeeChartMouseMove = (chartState) => {
    if (!chartState?.activePayload?.length || !chartState?.activeCoordinate) {
      setFeeTooltip((prev) => ({ ...prev, visible: false }))
      return
    }

    const totalEntry = chartState.activePayload.find((item) => item.dataKey === 'totalFee')
    const collectedEntry = chartState.activePayload.find((item) => item.dataKey === 'collectedFee')
    const containerWidth = feeChartRef.current?.clientWidth ?? 0
    const containerHeight = feeChartRef.current?.clientHeight ?? 0
    const pointX = Number(chartState.activeCoordinate?.x ?? 12)
    const pointY = Number(chartState.activeCoordinate?.y ?? 12)

    const nextX = Math.min(Math.max(12, pointX + 14), Math.max(12, containerWidth - 170))
    const nextY = Math.min(Math.max(12, pointY - 88), Math.max(12, containerHeight - 92))

    setFeeTooltip({
      visible: true,
      x: nextX,
      y: nextY,
      label: chartState.activeLabel ?? '',
      totalFee: Number(totalEntry?.value ?? totalEntry?.payload?.totalFee ?? 0),
      collectedFee: Number(collectedEntry?.value ?? collectedEntry?.payload?.collectedFee ?? 0),
    })
  }

  const handleFeeChartMouseLeave = () => {
    setFeeTooltip((prev) => ({ ...prev, visible: false }))
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto space-y-4 pr-1">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-300"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      <section className="rounded-lg bg-[#112b98] px-4 py-3 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Welcome Back, Mr. {fullName}</h2>
            <p className="mt-1 text-sm text-blue-100">Have a Good day at work</p>
          </div>
          <p className="flex items-center gap-2 text-xs text-blue-100 sm:text-sm">
            <RefreshCw className="h-4 w-4" />
            Updated Recently on{' '}
            {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-xl border border-gray-300 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Total Students</h3>
              <p className="mt-1 text-2xl font-bold text-gray-900">{studentsCount}</p>
              <p className="text-sm text-gray-700">{newStudents} this month</p>
            </div>
            <div className="rounded-lg bg-blue-500 p-2.5">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-gray-300 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Total Teachers</h3>
              <p className="mt-1 text-2xl font-bold text-gray-900">{teachersCount}</p>
              <p className="text-sm text-gray-700">10 this month</p>
            </div>
            <div className="rounded-lg bg-green-500 p-2.5">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-gray-300 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Total Classes</h3>
              <p className="mt-1 text-2xl font-bold text-gray-900">{classesCount}</p>
              <p className="text-sm text-gray-700">Active Classes</p>
            </div>
            <div className="rounded-lg bg-indigo-700 p-2.5">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
        </article>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="space-y-4">
          <section className="flex min-h-[340px] flex-col rounded-2xl border border-slate-300 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h3 className="text-base font-semibold text-slate-800">Fees Collection</h3>
              <button className="inline-flex items-center gap-1 text-xs text-slate-600" >
              
                Last 8 Quarter
              </button>
            </div>
            <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
              <div ref={feeChartRef} className="relative h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={FEE_CHART_DATA}
                    margin={{ top: 8, right: 10, left: 4, bottom: 0 }}
                    barGap={-40}
                    barCategoryGap={24}
                    onMouseMove={handleFeeChartMouseMove}
                    onMouseLeave={handleFeeChartMouseLeave}
                  >
                    <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="quarter"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#64748b' }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      width={42}
                      ticks={FEE_TICKS}
                      domain={[0, 60]}
                      tickFormatter={(value) => `${value}L`}
                      tick={{ fontSize: 11, fill: '#64748b' }}
                    />
                    <Tooltip cursor={false} content={() => null} />
                    <Bar dataKey="totalFee" fill="#cbd5e1" radius={[6, 6, 0, 0]} barSize={40} />
                    <Bar dataKey="collectedFee" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
                <div
                  className={`pointer-events-none absolute left-0 top-0 z-20 min-w-[160px] rounded-lg border border-slate-200 bg-white/95 p-2 shadow-lg shadow-slate-300/50 backdrop-blur-sm transition-all duration-200 ease-out ${
                    feeTooltip.visible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    transform: `translate(${feeTooltip.x}px, ${feeTooltip.y}px) scale(${feeTooltip.visible ? 1 : 0.96})`,
                  }}
                >
                  <p className="text-[11px] font-semibold text-slate-800">{feeTooltip.label}</p>
                  <div className="mt-1 space-y-1">
                    <p className="flex items-center justify-between gap-3 text-[11px] text-slate-700">
                      <span className="inline-flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-slate-300" />
                        Total
                      </span>
                      <span className="font-semibold">{feeTooltip.totalFee}L</span>
                    </p>
                    <p className="flex items-center justify-between gap-3 text-[11px] text-slate-700">
                      <span className="inline-flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                        Collected
                      </span>
                      <span className="font-semibold">{feeTooltip.collectedFee}L</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <section className="rounded-2xl border border-slate-200 bg-[#f4f5f8] shadow-sm">
              <div className="border-b border-slate-300 px-4 pt-3">
                <div className="flex items-center gap-5 text-sm font-semibold">
                  <button
                    onClick={() => setAttendanceTab('students')}
                    className={`border-b-[3px] pb-2 transition ${
                      attendanceTab === 'students' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-700'
                    }`}
                  >
                    Students
                  </button>
                  <button
                    onClick={() => setAttendanceTab('teachers')}
                    className={`border-b-[3px] pb-2 transition ${
                      attendanceTab === 'teachers' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-700'
                    }`}
                  >
                    Teachers/Staff
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-3 gap-3">
                  {activeAttendanceData.stats.map((item) => (
                    <article key={`${attendanceTab}-${item.label}`} className="rounded-md bg-[#e9ebf0] px-3 py-4 text-center">
                      <p className="text-3xl font-semibold leading-none text-slate-800">{item.value}</p>
                      <p className="mt-1 text-lg text-slate-600">{item.label}</p>
                    </article>
                  ))}
                </div>

                <div className="relative mx-auto mt-7 h-64 w-64">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(#415fd5 0deg ${presentRingAngle}deg, #72ccd8 ${presentRingAngle}deg 360deg)`,
                    }}
                  />
                  <div className="absolute inset-[62px] rounded-full bg-[#f4f5f8]" />

                  <div className="absolute -left-5 top-3 rounded-full bg-white px-3 py-2 text-center shadow-lg shadow-slate-300/60">
                    <p className="text-3xl font-bold leading-none text-slate-800">{activeAttendanceData.presentTotal}</p>
                    <p className="mt-1 text-2xl text-slate-600">Present</p>
                  </div>

                  <div className="absolute -right-6 top-1/2 -translate-y-1/2 rounded-full bg-white px-3 py-2 text-center shadow-lg shadow-slate-300/60">
                    <p className="text-3xl font-bold leading-none text-slate-800">{activeAttendanceData.absentTotal}</p>
                    <p className="mt-1 text-2xl text-slate-600">Absent</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/attendance/report')}
                  className="mx-auto mt-2 flex w-fit items-center gap-2 rounded-md bg-[#dfe4ee] px-4 py-2 text-base font-medium text-slate-700 transition hover:bg-[#d6dce8]"
                >
                  <CalendarCheck2 className="h-4 w-4" />
                  View All
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-300 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <h3 className="text-xl font-semibold text-slate-800">Announcements</h3>
                <button
                  onClick={() => navigate('/communication/announcements')}
                  className="text-sm font-semibold text-blue-600"
                >
                  View All
                </button>
              </div>
              <div className="divide-y divide-slate-200 px-4">
                {ANNOUNCEMENTS.map((item) => {
                  const Icon = item.icon

                  return (
                    <article key={item.id} className="flex items-center gap-3 py-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.iconStyles}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-lg font-semibold leading-snug text-slate-800">{item.title}</h4>
                        <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Added on : {item.date}
                        </p>
                      </div>
                      {item.daysLeft ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                          <Clock3 className="h-3.5 w-3.5" />
                          {item.daysLeft}
                        </span>
                      ) : (
                        <ChevronRight className="h-4 w-4 text-slate-500" />
                      )}
                    </article>
                  )
                })}
              </div>
            </section>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-300 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h3 className="text-xl font-semibold text-slate-800">Schedules</h3>
            <button
              onClick={() => navigate('/attendance/report')}
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600"
            >
              <PlusSquare className="h-4 w-4" />
              Add New
            </button>
          </div>

          <div className="space-y-5 p-5">
            <div className="flex items-center justify-between">
              <h4 className="text-3xl font-semibold text-slate-800">{format(currentMonth, 'MMMM yyyy')}</h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
                  className="rounded-full border border-slate-300 p-1.5"
                >
                  <ChevronLeft className="h-4 w-4 text-slate-500" />
                </button>
                <button
                  onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
                  className="rounded-full bg-slate-900 p-1.5"
                >
                  <ChevronRight className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-y-3 text-center">
              {WEEK_DAYS.map((day, index) => (
                <span key={`${day}-${index}`} className="text-sm font-semibold text-slate-700">
                  {day}
                </span>
              ))}

              {calendarDays.map((day) => {
                const dayKey = format(day, 'yyyy-MM-dd')
                const selected = isSameDay(day, selectedDate)
                const hasEvent = eventDateSet.has(dayKey)
                const outsideCurrentMonth = !isSameMonth(day, currentMonth)

                return (
                  <button
                    key={dayKey}
                    onClick={() => setSelectedDate(day)}
                    className={`mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-base font-medium transition ${
                      selected
                        ? 'bg-blue-600 text-white'
                        : outsideCurrentMonth
                          ? 'text-slate-300'
                          : hasEvent
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {format(day, 'd')}
                  </button>
                )
              })}
            </div>

            <div>
              <h5 className="text-3xl font-semibold text-slate-800">Upcoming Events</h5>
              <div className="mt-3 space-y-3">
                {UPCOMING_EVENTS.map((event) => {
                  const EventIcon = event.icon

                  return (
                    <article key={event.id} className={`border-l-4 ${event.accent} rounded-r-xl bg-white px-4 py-3 shadow-sm`}>
                      <div className="flex items-center gap-3">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${event.iconStyles}`}>
                          <EventIcon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h6 className="text-2xl font-semibold text-slate-800">{event.title}</h6>
                          <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {event.date}
                          </p>
                        </div>
                      </div>

                      {event.time && (
                        <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
                          <p className="flex items-center gap-1 text-sm text-slate-500">
                            <Clock3 className="h-3.5 w-3.5" />
                            {event.time}
                          </p>
                          {event.attendees.length > 0 && (
                            <div className="flex -space-x-2">
                              {event.attendees.map((name) => (
                                <span
                                  key={`${event.id}-${name}`}
                                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[10px] font-semibold text-slate-700"
                                >
                                  {name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard
