import { Link, useParams } from 'react-router-dom'
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  Mail,
  MapPin,
  PencilLine,
  Phone,
  User,
  UserRound,
  FileText,
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const WORKLOAD_DATA = [
  { month: 'Jul', totalClasses: 72, teachingHours: 30, extraDuties: 28 },
  { month: 'Aug', totalClasses: 74, teachingHours: 34, extraDuties: 34 },
  { month: 'Sep', totalClasses: 75, teachingHours: 21, extraDuties: 26 },
  { month: 'Oct', totalClasses: 102, teachingHours: 29, extraDuties: 22 },
  { month: 'Nov', totalClasses: 84, teachingHours: 39, extraDuties: 20 },
  { month: 'Dec', totalClasses: 85, teachingHours: 30, extraDuties: 22 },
  { month: 'Jan', totalClasses: 79, teachingHours: 30, extraDuties: 35 },
  { month: 'Feb', totalClasses: 88, teachingHours: 38, extraDuties: 22 },
]

const CALENDAR_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const CALENDAR_CELLS = [
  { label: '', muted: true },
  { label: '1' },
  { label: '2' },
  { label: '3' },
  { label: '4' },
  { label: '5' },
  { label: '6' },
  { label: '7' },
  { label: '8' },
  { label: '9', highlight: 'rose' },
  { label: '10', highlight: 'blue' },
  { label: '11', highlight: 'blue' },
  { label: '12', highlight: 'blue' },
  { label: '13', highlight: 'rose' },
  { label: '14' },
  { label: '15' },
  { label: '16' },
  { label: '17' },
  { label: '18' },
  { label: '19' },
  { label: '20' },
  { label: '21' },
  { label: '22' },
  { label: '23' },
  { label: '24' },
  { label: '25' },
  { label: '26' },
  { label: '27' },
  { label: '28' },
  { label: '29' },
  { label: '30' },
  { label: '1', muted: true },
  { label: '2', muted: true },
  { label: '3', muted: true },
  { label: '4', muted: true },
]

const SCHEDULE_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']

const LESSON_BLOCKS = [
  { day: 0, start: 0, end: 2, label: '8C', tone: 'bg-[#bddbe3] text-[#2c4257]' },
  { day: 1, start: 1, end: 3, label: '8C', tone: 'bg-[#bddbe3] text-[#2c4257]' },
  { day: 2, start: 0, end: 2, label: '9A', tone: 'bg-[#1f4d7a] text-white' },
  { day: 2, start: 2, end: 4, label: '8C', tone: 'bg-[#bddbe3] text-[#2c4257]' },
  { day: 3, start: 1, end: 3, label: '9B', tone: 'bg-[#dfb7e3] text-[#5a3562]' },
  { day: 4, start: 0, end: 2, label: '8C', tone: 'bg-[#bddbe3] text-[#2c4257]' },
  { day: 0, start: 5, end: 7, label: '9A', tone: 'bg-[#1f4d7a] text-white' },
  { day: 3, start: 5, end: 7, label: '8C', tone: 'bg-[#bddbe3] text-[#2c4257]' },
  { day: 4, start: 4, end: 6, label: '9B', tone: 'bg-[#dfb7e3] text-[#5a3562]' },
]

const PERFORMANCE_ROWS = Array.from({ length: 6 }).map((_, index) => ({
  id: index + 1,
  date: '12-12-2025',
  note: 'Shows Positive behavior in class',
}))

const TEACHER_DIRECTORY = {
  '0001': { name: 'Tania', classLabel: 'III A', subject: 'Physics' },
  '0002': { name: 'Danial', classLabel: 'II (A)', subject: 'Computer' },
  '0003': { name: 'Hania', classLabel: 'VI (A)', subject: 'English' },
  '0004': { name: 'Ahsan', classLabel: 'VI (B) , V (A)', subject: 'Urdu' },
  '0005': { name: 'Momina', classLabel: 'VIII', subject: 'Science' },
  '0006': { name: 'Ahmad', classLabel: 'I (A)', subject: 'Chemistry' },
  '0007': { name: 'Fariya', classLabel: 'IV', subject: 'Maths' },
  '0008': { name: 'Zeeshan', classLabel: 'IX', subject: 'Biology' },
}

const DEFAULT_TEACHER = {
  name: 'Asif Ali',
  classLabel: '9A - 10A - 11A',
  subject: 'English Language',
}

const workloadTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null

  const classes = payload.find((entry) => entry.dataKey === 'totalClasses')?.value ?? 0
  const teaching = payload.find((entry) => entry.dataKey === 'teachingHours')?.value ?? 0
  const duties = payload.find((entry) => entry.dataKey === 'extraDuties')?.value ?? 0

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-[#30384e]">Month Snapshot</p>
      <div className="mt-2 space-y-1 text-sm text-[#55627e]">
        <p className="flex items-center justify-between gap-4">
          <span>Total Classes</span>
          <span className="font-semibold text-[#1e2434]">{classes} Hours</span>
        </p>
        <p className="flex items-center justify-between gap-4">
          <span>Teaching Hours</span>
          <span className="font-semibold text-[#1e2434]">{teaching} Hours</span>
        </p>
        <p className="flex items-center justify-between gap-4">
          <span>Extra Duties</span>
          <span className="font-semibold text-[#1e2434]">{duties} Hours</span>
        </p>
      </div>
    </div>
  )
}

const TeacherDetails = () => {
  const { id } = useParams()
  const normalizedId = id ? String(id).replace('ID.', '').padStart(4, '0') : ''
  const teacher = TEACHER_DIRECTORY[normalizedId] || DEFAULT_TEACHER
  const teacherIdLabel = normalizedId ? `ID.${normalizedId}` : 'ID.111'

  return (
    <div className="h-full overflow-y-auto pb-4 pr-1">
      <div className="mb-4 flex items-start gap-3">
        <Link
          to="/teachers"
          className="mt-1 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#dee1e8] bg-[#f7f8fa] text-[#3b4661] transition hover:bg-[#eceff4]"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#253256]">Teacher Details</h1>
          <p className="mt-1 text-base text-[#6f7890]">Teachers &nbsp; / &nbsp; Teacher Details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="space-y-3">
          <section className="rounded-2xl border border-[#e0e3ea] bg-[#f3f4f6] p-5">
            <div className="flex justify-end">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d4d9e4] bg-white text-[#55637f] transition hover:bg-slate-50"
                aria-label="Edit teacher profile"
              >
                <PencilLine className="h-4 w-4" />
              </button>
            </div>

            <div className="-mt-2 flex flex-col items-center">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#c7c9cd] text-[#565a64]">
                <UserRound className="h-16 w-16" />
              </div>
              <h2 className="mt-3 text-2xl font-bold leading-none text-[#11131a]">{teacher.name}</h2>
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-md bg-[#e5e7eb] px-3 py-1 text-sm font-semibold text-[#131722]">
                  {teacherIdLabel}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Active
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-[#ebedf1] p-4">
              <p className="text-base text-[#707a90]">Subject</p>
              <p className="text-xl font-medium leading-none text-[#1d2434]">{teacher.subject}</p>
              <p className="mt-3 text-base text-[#707a90]">Class</p>
              <p className="text-xl font-medium leading-none text-[#1d2434]">{teacher.classLabel}</p>
            </div>

            <div className="mt-4 space-y-3 rounded-xl bg-[#ebedf1] p-4">
              <p className="flex items-center gap-3 text-base text-[#3b465f]">
                <User className="h-5 w-5 text-[#868fa2]" />
                <span className="w-24 text-[#7a8294]">Gender</span>
                <span className="font-medium text-[#121826]">Male</span>
              </p>
              <p className="flex items-center gap-3 text-base text-[#3b465f]">
                <CalendarDays className="h-5 w-5 text-[#868fa2]" />
                <span className="w-24 text-[#7a8294]">Date of Birth</span>
                <span className="font-medium text-[#121826]">May 18, 2005</span>
              </p>
              <p className="flex items-center gap-3 text-base text-[#3b465f]">
                <Phone className="h-5 w-5 text-[#868fa2]" />
                <span className="w-24 text-[#7a8294]">Phone Number</span>
                <span className="font-medium text-[#121826]">02687996746</span>
              </p>
              <p className="flex items-center gap-3 text-base text-[#3b465f]">
                <Mail className="h-5 w-5 text-[#868fa2]" />
                <span className="w-24 text-[#7a8294]">Email</span>
                <span className="font-medium text-[#121826]">xyz@gmail.com</span>
              </p>
              <p className="flex items-center gap-3 text-base text-[#3b465f]">
                <MapPin className="h-5 w-5 text-[#868fa2]" />
                <span className="w-24 text-[#7a8294]">Address</span>
                <span className="font-medium text-[#121826]">Peshawar, Pakistan</span>
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-[#e0e3ea] bg-[#f3f4f6] p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold leading-none text-[#11131a]">Documents</h3>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d4d9e4] bg-white text-[#55637f] transition hover:bg-slate-50"
                aria-label="Edit teacher documents"
              >
                <PencilLine className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 divide-y divide-[#d4d9e2] overflow-hidden rounded-xl bg-[#ebedf1]">
              {['CV', 'Cover letter', 'Degrees'].map((document) => (
                <div key={document} className="flex items-center gap-3 px-3 py-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dbe0ea] text-[#6d7892]">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-lg font-medium leading-none text-[#1c2334]">{document}</p>
                    <p className="text-sm text-[#778096]">Pdf</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 2xl:grid-cols-[minmax(0,1fr)_310px]">
            <section className="rounded-2xl border border-[#e0e3ea] bg-[#f3f4f6] p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-2xl font-bold leading-none text-[#11131a]">Workload Summary</h2>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-base font-medium text-white transition hover:bg-primary-700"
                >
                  Last 8 Months
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-[#5f6b84]">
                <p className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-[#b6e2ea]" />
                  Total Classes
                </p>
                <p className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-[#1f4d7a]" />
                  Teaching Hours
                </p>
                <p className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-[#e9bceb]" />
                  Extra Duties
                </p>
              </div>

              <div className="mt-4 h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={WORKLOAD_DATA} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="total-classes-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#b6e2ea" stopOpacity={0.95} />
                        <stop offset="95%" stopColor="#b6e2ea" stopOpacity={0.55} />
                      </linearGradient>
                      <linearGradient id="teaching-hours-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1f4d7a" stopOpacity={0.95} />
                        <stop offset="95%" stopColor="#1f4d7a" stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="extra-duties-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e9bceb" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#e9bceb" stopOpacity={0.55} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#d8dde9" strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6d768d', fontSize: 12 }} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6d768d', fontSize: 12 }}
                      ticks={[0, 40, 80, 120, 160]}
                    />
                    <Tooltip content={workloadTooltip} />
                    <Area
                      type="monotone"
                      dataKey="teachingHours"
                      stackId="teacher-workload"
                      stroke="#1f4d7a"
                      fill="url(#teaching-hours-gradient)"
                      strokeWidth={1.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="totalClasses"
                      stackId="teacher-workload"
                      stroke="#9fd5df"
                      fill="url(#total-classes-gradient)"
                      strokeWidth={1.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="extraDuties"
                      stackId="teacher-workload"
                      stroke="#dca8e1"
                      fill="url(#extra-duties-gradient)"
                      strokeWidth={1.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="rounded-2xl border border-[#d3d8e2] bg-[#f3f4f6] p-4">
              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#3b4661] transition hover:bg-[#e6e9f0]"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex min-w-[84px] items-center justify-between rounded-lg border border-[#d3d8e2] bg-white px-3 py-1.5 text-base font-medium text-[#3f4a65]"
                  >
                    Sep
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex min-w-[84px] items-center justify-between rounded-lg border border-[#d3d8e2] bg-white px-3 py-1.5 text-base font-medium text-[#3f4a65]"
                  >
                    2025
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#3b4661] transition hover:bg-[#e6e9f0]"
                >
                  <ChevronLeft className="h-5 w-5 rotate-180" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {CALENDAR_LABELS.map((label) => (
                  <div key={label} className="py-1 text-center text-sm font-medium text-[#7f889c]">
                    {label}
                  </div>
                ))}
                {CALENDAR_CELLS.map((cell, index) => {
                  const toneClasses = cell.highlight
                    ? cell.highlight === 'blue'
                      ? 'bg-[#e6edf8] text-[#334862]'
                      : 'bg-[#f4e7ea] text-[#3a4050]'
                    : ''

                  return (
                    <div
                      key={`${cell.label}-${index}`}
                      className={`h-10 rounded-lg py-2 text-center text-lg ${
                        cell.muted ? 'text-[#a8aec0]' : 'text-[#2a313f]'
                      } ${toneClasses}`}
                    >
                      {cell.label}
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 flex gap-2">
                <div className="flex-1 rounded-xl border-2 border-primary-500 bg-[#eaf0fc] px-3 py-2">
                  <p className="text-base text-[#3a445f]">Present</p>
                  <p className="text-2xl font-bold leading-none text-[#141922]">3</p>
                </div>
                <div className="flex-1 rounded-xl border-2 border-red-400 bg-[#f9ecec] px-3 py-2">
                  <p className="text-base text-[#3a445f]">Absent</p>
                  <p className="text-2xl font-bold leading-none text-[#141922]">2</p>
                </div>
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 gap-3 2xl:grid-cols-[minmax(0,1fr)_330px]">
            <section className="rounded-2xl border border-[#e0e3ea] bg-[#f3f4f6] p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-2xl font-bold leading-none text-[#11131a]">Schedule</h2>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-base font-medium text-white transition hover:bg-primary-700"
                >
                  Last Week
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 overflow-x-auto">
                <div
                  className="grid min-w-[760px] rounded-xl border border-[#d8dde7] bg-white"
                  style={{
                    gridTemplateColumns: '74px repeat(5, minmax(0, 1fr))',
                    gridTemplateRows: `40px repeat(${TIME_SLOTS.length}, 52px)`,
                  }}
                >
                  <div className="flex items-center justify-center border-b border-[#d8dde7] bg-[#f2f4f8] text-sm font-medium text-[#778198]">
                    Time
                  </div>
                  {SCHEDULE_DAYS.map((day) => (
                    <div
                      key={day}
                      className="flex items-center justify-center border-b border-l border-[#d8dde7] bg-[#f2f4f8] text-sm font-medium text-[#778198]"
                    >
                      {day}
                    </div>
                  ))}

                  {TIME_SLOTS.map((time, rowIndex) => (
                    <div key={time} className="contents">
                      <div className="flex items-start justify-center border-b border-[#e0e4ec] pt-1 text-sm text-[#7e879b]">
                        {time}
                      </div>
                      {SCHEDULE_DAYS.map((day) => (
                        <div
                          key={`${day}-${time}`}
                          className="border-b border-l border-[#edf1f7] bg-white"
                          style={{ gridRow: rowIndex + 2 }}
                        />
                      ))}
                    </div>
                  ))}

                  {LESSON_BLOCKS.map((block, index) => (
                    <div
                      key={`${block.day}-${block.start}-${index}`}
                      className={`z-10 m-1 flex items-center justify-center rounded-lg text-sm font-semibold ${block.tone}`}
                      style={{
                        gridColumn: block.day + 2,
                        gridRow: `${block.start + 2} / ${block.end + 2}`,
                      }}
                    >
                      {block.label}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e0e3ea] bg-[#f3f4f6] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-2xl font-bold leading-none text-[#11131a]">Performance</h2>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d4d9e4] bg-white text-[#55637f] transition hover:bg-slate-50"
                  aria-label="Edit teacher performance"
                >
                  <PencilLine className="h-4 w-4" />
                </button>
              </div>

              <div className="overflow-hidden rounded-xl border border-[#d9dee8]">
                <table className="w-full table-fixed">
                  <thead className="bg-[#e9edf3]">
                    <tr>
                      <th className="w-10 px-3 py-2 text-left">
                        <input type="checkbox" className="h-4 w-4 rounded border-[#b8c1d4]" />
                      </th>
                      <th className="w-28 px-2 py-2 text-left text-sm font-semibold text-[#47536e]">
                        Date
                      </th>
                      <th className="px-2 py-2 text-left text-sm font-semibold text-[#47536e]">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e6ed] bg-white">
                    {PERFORMANCE_ROWS.map((row) => (
                      <tr key={row.id}>
                        <td className="px-3 py-2">
                          <input type="checkbox" className="h-4 w-4 rounded border-[#b8c1d4]" />
                        </td>
                        <td className="px-2 py-2 text-sm text-primary-600">{row.date}</td>
                        <td className="px-2 py-2 text-sm leading-tight text-[#202736]">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherDetails
