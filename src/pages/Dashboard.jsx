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
} from 'lucide-react'
import {
  addDays,
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
import { communicationAPI, dashboardAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import edit2 from '@/assets/edit2.svg'
import users from '@/assets/users.svg'
import book from '@/assets/book.svg'
import collectedFee from '@/assets/collectedFee.svg'
import totalFee from '@/assets/totalFee.svg'

const FEE_CHART_MONTHS = 8
const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const buildEmptyFeeChart = (months) => {
  const now = new Date()
  return Array.from({ length: months }, (_, index) => {
    const date = subMonths(now, months - 1 - index)
    return {
      label: format(date, 'MMM yy'),
      collectedFee: 0,
    }
  })
}

const buildDummyFeeChart = (months) => {
  const now = new Date()
  const sampleValues = [3.4, 4.1, 3.8, 4.6, 5.2, 4.8, 5.6, 6.1]

  return Array.from({ length: months }, (_, index) => {
    const date = subMonths(now, months - 1 - index)
    const value = sampleValues[index % sampleValues.length]

    return {
      _id: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
      },
      totalCollected: Math.round(value * 100000),
    }
  })
}

const buildYAxisTicks = (maxValue) => {
  const safeMax = Math.max(1, maxValue)
  const roundedMax = Math.ceil(safeMax / 10) * 10
  const step = Math.max(1, Math.round(roundedMax / 5))
  return Array.from({ length: 6 }, (_, index) => index * step)
}

const buildDummyAnnouncements = () => {
  const today = new Date()

  return [
    {
      _id: 'ann-fee-deadline',
      title: 'Fee submission closes Friday',
      publishDate: addDays(today, -2).toISOString(),
      expiryDate: addDays(today, 4).toISOString(),
      priority: 'urgent',
      type: 'fee',
    },
    {
      _id: 'ann-science-fair',
      title: 'Science fair registrations open',
      publishDate: addDays(today, -5).toISOString(),
      expiryDate: addDays(today, 12).toISOString(),
      priority: 'high',
      type: 'event',
    },
    {
      _id: 'ann-ptm',
      title: 'Parent-teacher meeting schedule',
      publishDate: addDays(today, -1).toISOString(),
      expiryDate: addDays(today, 3).toISOString(),
      priority: 'general',
      type: 'general',
    },
    {
      _id: 'ann-exams',
      title: 'Midterm exam timetable released',
      publishDate: addDays(today, -7).toISOString(),
      expiryDate: addDays(today, 20).toISOString(),
      priority: 'exam',
      type: 'exam',
    },
  ]
}

const buildDummyStats = () => {
  const today = new Date()
  const examStart = addDays(today, 6)
  const examEnd = addDays(today, 8)
  const quizDate = addDays(today, 13)

  return {
    students: {
      total: 1240,
      newAdmissions: 28,
    },
    teachers: {
      total: 86,
    },
    classes: {
      total: 44,
    },
    attendance: {
      date: today.toISOString(),
      today: {
        present: 1182,
        absent: 46,
        late: 12,
      },
      teachers: {
        present: 73,
        absent: 4,
        late: 2,
      },
    },
    upcomingExams: [
      {
        _id: 'exam-midterm',
        name: 'Midterm Exams',
        startDate: examStart.toISOString(),
        endDate: examEnd.toISOString(),
        schedule: [{ startTime: '09:00 AM', endTime: '12:00 PM' }],
      },
      {
        _id: 'quiz-math',
        name: 'Math Quiz',
        startDate: quizDate.toISOString(),
        endDate: quizDate.toISOString(),
        schedule: [{ startTime: '10:30 AM', endTime: '11:30 AM' }],
      },
    ],
  }
}

const ANNOUNCEMENT_ICON_MAP = {
  urgent: { icon: BellRing, iconStyles: 'bg-rose-100 text-rose-500' },
  high: { icon: BellRing, iconStyles: 'bg-amber-100 text-amber-600' },
  exam: { icon: FileText, iconStyles: 'bg-blue-100 text-blue-600' },
  holiday: { icon: CalendarDays, iconStyles: 'bg-green-100 text-green-600' },
  event: { icon: CalendarDays, iconStyles: 'bg-sky-100 text-sky-600' },
  fee: { icon: FileText, iconStyles: 'bg-amber-100 text-amber-600' },
  general: { icon: ClipboardList, iconStyles: 'bg-slate-100 text-slate-600' },
}

const DUMMY_FEE_CHART = buildDummyFeeChart(FEE_CHART_MONTHS)
const DUMMY_ANNOUNCEMENTS = buildDummyAnnouncements()
const DUMMY_STATS = buildDummyStats()

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
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

  const { data: statsRaw, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await dashboardAPI.getStats()
      return response.data.data
    },
  })

  const { data: feeChartRaw } = useQuery({
    queryKey: ['dashboard-fee-chart', FEE_CHART_MONTHS],
    queryFn: async () => {
      const response = await dashboardAPI.getFeeChart({ months: FEE_CHART_MONTHS })
      return response.data.data || []
    },
  })

  const { data: announcementsRaw } = useQuery({
    queryKey: ['dashboard-announcements'],
    queryFn: async () => {
      const response = await communicationAPI.getAnnouncements({ isPublished: true })
      return response.data.data || []
    },
  })

  const shouldUseDummyStats = !statsRaw || Object.keys(statsRaw).length === 0
  const stats = shouldUseDummyStats ? DUMMY_STATS : statsRaw
  const feeChartSource = feeChartRaw?.length ? feeChartRaw : DUMMY_FEE_CHART
  const announcementsSource = announcementsRaw?.length ? announcementsRaw : DUMMY_ANNOUNCEMENTS

  const fullName = [user?.profile?.firstName, user?.profile?.lastName].filter(Boolean).join(' ') || 'Admin'
  const rawName = user?.profile?.firstName || fullName
  const displayName = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : rawName
  const studentsCount = stats?.students?.total ?? 0
  const teachersCount = stats?.teachers?.total ?? 0
  const classesCount = stats?.classes?.total ?? 0
  const newStudents = stats?.students?.newAdmissions ?? 0
  const updatedDate = stats?.attendance?.date ? new Date(stats.attendance.date) : new Date()

  const studentAttendance = {
    present: stats?.attendance?.today?.present ?? 0,
    absent: stats?.attendance?.today?.absent ?? 0,
    late: stats?.attendance?.today?.late ?? 0,
  }

  const teacherAttendance = {
    present: stats?.attendance?.teachers?.present ?? 0,
    absent: stats?.attendance?.teachers?.absent ?? 0,
    late: stats?.attendance?.teachers?.late ?? 0,
  }

  const attendancePanelData = useMemo(() => {
    const formatSmallValue = (value) => String(value ?? 0).padStart(2, '0')

    return {
      students: {
        stats: [
          { label: 'Present', value: formatSmallValue(studentAttendance.present) },
          { label: 'Absent', value: formatSmallValue(studentAttendance.absent) },
          { label: 'Late', value: formatSmallValue(studentAttendance.late) },
        ],
        presentTotal: studentAttendance.present,
        absentTotal: studentAttendance.absent,
      },
      teachers: {
        stats: [
          { label: 'Present', value: formatSmallValue(teacherAttendance.present) },
          { label: 'Absent', value: formatSmallValue(teacherAttendance.absent) },
          { label: 'Late', value: formatSmallValue(teacherAttendance.late) },
        ],
        presentTotal: teacherAttendance.present,
        absentTotal: teacherAttendance.absent,
      },
    }
  }, [studentAttendance, teacherAttendance])

  const activeAttendanceData = attendancePanelData[attendanceTab]
  const donutTotal = activeAttendanceData.presentTotal + activeAttendanceData.absentTotal
  const presentRingAngle = donutTotal > 0 ? (activeAttendanceData.presentTotal / donutTotal) * 360 : 0

  const feeChartData = useMemo(() => {
    const baseline = buildEmptyFeeChart(FEE_CHART_MONTHS)
    if (!feeChartSource.length) {
      return baseline
    }

    const valueMap = new Map()
    feeChartSource.forEach((entry) => {
      let date = null

      if (entry?._id?.year && entry?._id?.month) {
        date = new Date(entry._id.year, entry._id.month - 1, 1)
      } else if (typeof entry?.month === 'string') {
        const [yearString, monthString] = entry.month.split('-')
        const year = Number.parseInt(yearString, 10)
        const month = Number.parseInt(monthString, 10)

        if (!Number.isNaN(year) && !Number.isNaN(month)) {
          date = new Date(year, month - 1, 1)
        }
      }

      if (!date || Number.isNaN(date.getTime())) {
        return
      }

      const key = format(date, 'MMM yy')
      const collectedInLakh = Number((entry.totalCollected / 100000).toFixed(1))
      valueMap.set(key, collectedInLakh)
    })

    return baseline.map((item) => ({
      ...item,
      collectedFee: valueMap.get(item.label) ?? 0,
    }))
  }, [feeChartSource])

  const feeChartMax = useMemo(
    () => Math.max(...feeChartData.map((item) => item.collectedFee), 1),
    [feeChartData]
  )
  const feeTicks = useMemo(() => buildYAxisTicks(feeChartMax), [feeChartMax])

  const announcements = useMemo(() => {
    if (!announcementsSource.length) return []

    return announcementsSource.slice(0, 4).map((item) => {
      const priorityKey = item.priority === 'urgent' ? 'urgent' : item.priority
      const typeKey = item.type || 'general'
      const styleKey = ANNOUNCEMENT_ICON_MAP[priorityKey] ? priorityKey : typeKey
      const { icon, iconStyles } = ANNOUNCEMENT_ICON_MAP[styleKey] || ANNOUNCEMENT_ICON_MAP.general
      const publishDate = item.publishDate ? new Date(item.publishDate) : new Date()
      const expiryDate = item.expiryDate ? new Date(item.expiryDate) : null
      const daysLeft = expiryDate
        ? `${Math.max(1, Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24)))} Days`
        : null

      return {
        id: item._id || item.id,
        title: item.title,
        date: format(publishDate, 'dd MMM yyyy'),
        daysLeft,
        icon,
        iconStyles,
      }
    })
  }, [announcementsSource])

  const upcomingEvents = useMemo(() => {
    const exams = stats?.upcomingExams ?? []
    if (!exams.length) return []

    const accents = ['border-cyan-500', 'border-blue-500', 'border-rose-500', 'border-emerald-500']
    const iconStyles = ['bg-sky-100 text-sky-600', 'bg-indigo-100 text-indigo-600', 'bg-rose-100 text-rose-500']

    return exams.map((exam, index) => {
      const startDate = exam.startDate ? new Date(exam.startDate) : new Date()
      const endDate = exam.endDate ? new Date(exam.endDate) : startDate
      const sameDay = isSameDay(startDate, endDate)
      const dateLabel = sameDay
        ? format(startDate, 'dd MMM yyyy')
        : `${format(startDate, 'dd MMM yyyy')} - ${format(endDate, 'dd MMM yyyy')}`

      const firstSchedule = exam.schedule?.[0]
      const timeLabel = firstSchedule?.startTime
        ? `${firstSchedule.startTime}${firstSchedule.endTime ? ` - ${firstSchedule.endTime}` : ''}`
        : null

      return {
        id: exam._id || `${exam.name}-${index}`,
        title: exam.name || 'Exam Schedule',
        date: dateLabel,
        time: timeLabel,
        rawDateKey: format(startDate, 'yyyy-MM-dd'),
        accent: accents[index % accents.length],
        icon: FileText,
        iconStyles: iconStyles[index % iconStyles.length],
        attendees: [],
      }
    })
  }, [stats])

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 })
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  const eventDateSet = useMemo(() => {
    return new Set(upcomingEvents.map((event) => event.rawDateKey))
  }, [upcomingEvents])

  const handleFeeChartMouseMove = (chartState) => {
    if (!chartState?.activePayload?.length || !chartState?.activeCoordinate) {
      setFeeTooltip((prev) => ({ ...prev, visible: false }))
      return
    }

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
      totalFee: 0,
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
        <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded bg-gray-300 px-6 py-2 text-sm font-medium text-slate-600 hover:bg-slate-300"
        >
         <span className="border rounded-full border-black"> <ChevronLeft className="h-4 w-4 text-black" /></span>
          Back
        </button>
      </div>

      <section className="rounded bg-[#112b98] px-4 py-3 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold flex items-center justify-center gap-3">Welcome Back, Mr. {displayName} 
              <span className="bg-gray-800 p-1 rounded "><img src={edit2} alt="image for edit" className="cursor-pointer" /></span>
            </h2>
            <p className="mt-1 text-sm text-white">Have a Good day at work</p>
          </div>
          <p className="flex items-center gap-2 text-xs text-white sm:text-sm">
            <RefreshCw className="h-4 w-4" />
            Updated Recently on{' '}
            {format(updatedDate, 'dd MMM yyyy')}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-xl border border-gray-300 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between py-4 px-6">
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-semibold text-gray-900">Total Students</h3>
              <p className="mt-1 text-2xl font-bold text-gray-900">{studentsCount}</p>
              <p className="text-base text-gray-700">{newStudents} this month</p>
            </div>
            <div className="rounded-lg bg-blue-500 p-2.5">
              {/* <Users className="h-6 w-6 text-white" /> */}
              <img src={users} alt="Users Icon" />
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-gray-300 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between py-4 px-6">
            <div className="flex flex-col gap-3">
              <h3 className="text-base font-semibold text-gray-900">Total Teachers</h3>
              <p className="mt-1 text-2xl font-bold text-gray-900">{teachersCount}</p>
              <p className="text-sm text-gray-700">Active Teachers</p>
            </div>
            <div className="rounded-lg bg-green-500 p-2.5">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-gray-300 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between py-4 px-6">
            <div className="flex flex-col gap-3">
              <h3 className="text-base font-semibold text-gray-900">Total Classes</h3>
              <p className="mt-1 text-2xl font-bold text-gray-900">{classesCount}</p>
              <p className="text-sm text-gray-700">Active Classes</p>
            </div>
            <div className="rounded-lg bg-indigo-700 p-2.5">
              {/* <BookOpen className="h-6 w-6 text-white" /> */}
              <img src={book} alt="" />
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
                Last {FEE_CHART_MONTHS} Months 
              </button>

                        </div>

                    <div className="flex items-center justify-cente gap-3 ml-4  py-2">
                      
                      <p className="flex  items-center justify-center gap-2"> <img src={totalFee} alt="fee collected icon" className="text-gray-400" /> Total Fee</p>
                      <p className="flex  items-center justify-center gap-2"> <img src={collectedFee} alt="fee collected icon" className="text-gray-400" /> Collected Fee</p>
                    </div>
            <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
              <div ref={feeChartRef} className="relative h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={feeChartData}
                    margin={{ top: 8, right: 10, left: 4, bottom: 0 }}
                    barGap={-40}
                    barCategoryGap={24}
                    onMouseMove={handleFeeChartMouseMove}
                    onMouseLeave={handleFeeChartMouseLeave}
                  >
                    <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#64748b' }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      width={42}
                      ticks={feeTicks}
                      domain={[0, feeTicks[feeTicks.length - 1]]}
                      tickFormatter={(value) => `${value}L`}
                      tick={{ fontSize: 11, fill: '#64748b' }}
                    />
                    <Tooltip cursor={false} content={() => null} />
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
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
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

                  <div className="absolute -left-8 top-3 rounded-full bg-white px-3 py-4 text-center shadow-lg shadow-slate-300/60 w-[6rem] h-[6rem]">
                    <p className="text-2xl font-bold leading-none text-slate-800">{activeAttendanceData.presentTotal}</p>
                    <p className="mt-1 text-xl text-slate-600">Present</p>
                  </div>

                  <div className="absolute -right-16 top-1/2 -translate-y-1/2 rounded-full bg-white px-3 py-4 text-center shadow-lg shadow-slate-300/60 w-[6rem] h-[6rem]">
                    <p className="text-2xl font-bold leading-none text-slate-800">{activeAttendanceData.absentTotal}</p>
                    <p className="mt-1 text-xl text-slate-600">Absent</p>
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
                {announcements.length === 0 ? (
                  <div className="py-6 text-center text-sm text-slate-500">
                    No announcements available.
                  </div>
                ) : (
                  announcements.map((item) => {
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
                  })
                )}
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
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="text-2xl font-semibold text-slate-800 sm:text-3xl">{format(currentMonth, 'MMMM yyyy')}</h4>
              <div className="ml-auto flex shrink-0 items-center gap-2">
                <button
                  onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300"
                >
                  <ChevronLeft className="h-4 w-4 text-slate-500" />
                </button>
                <button
                  onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900"
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
              <h5 className="text-2xl font-semibold text-slate-800">Upcoming Events</h5>
              <div className="mt-3 space-y-3">
                {upcomingEvents.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                    No upcoming events available.
                  </div>
                ) : (
                  upcomingEvents.map((event) => {
                    const EventIcon = event.icon

                    return (
                      <article key={event.id} className={`border-l-4 ${event.accent} rounded-r-xl bg-white px-4 py-3 shadow-sm`}>
                        <div className="flex items-center gap-3">
                          <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${event.iconStyles}`}>
                            <EventIcon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h6 className="text-xl font-semibold text-slate-800">{event.title}</h6>
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
                  })
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard
