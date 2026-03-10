import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Users,
  GraduationCap,
  BookOpen,
  MessageSquare,
  DollarSign,
  ClipboardCheck,
  FileText,
} from 'lucide-react'
import { dashboardAPI } from '@/lib/api'

const MetricBox = ({ icon: Icon, value, label, color = 'bg-blue-500' }) => (
  <div className="rounded-xl border border-gray-300 bg-white p-3 shadow-sm">
    <div className="mb-2 flex justify-center">
      <div className={`rounded-lg p-2.5 ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </div>
    <p className="text-center text-xl font-bold text-gray-900 lg:text-2xl">{value}</p>
    <p className="text-center text-xs font-semibold leading-tight text-gray-800 lg:text-sm">{label}</p>
  </div>
)

const ProgressRow = ({ label, value }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2.5 rounded-full bg-gray-200">
      <div className="h-2.5 rounded-full bg-blue-500" style={{ width: `${value}%` }} />
    </div>
  </div>
)

const Welcome = () => {
  const navigate = useNavigate()

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await dashboardAPI.getStats()
      return response.data.data
    },
  })

  const students = stats?.students?.total ?? 400
  const teachers = stats?.teachers?.total ?? 100
  const classes = stats?.classes?.total ?? 100
  const paidFees = stats?.fees?.collection?.paid ?? 80
  const pendingFees = stats?.fees?.collection?.pending ?? 20
  const feeTotal = paidFees + pendingFees || 1
  const collectedPercent = Math.round((paidFees / feeTotal) * 100)
  const pendingPercent = 100 - collectedPercent

  return (
    <div className="h-100vh w-full">
      <div className="h-full w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#eef2f9] via-[#b4bfd9] to-[#2c3f8f] p-10">
        <h1 className="mb-6 text-center text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
          Welcome To
          <br />
          School Management System
        </h1>

        <div className="mx-auto grid h-[calc(100%-96px)] w-[80%] grid-cols-2 gap-10">
          <section className="flex min-h-0 flex-col rounded-xl border-2 border-blue-500 bg-[#dbe4f5]/75 p-4 ">
            <h2 className="mb-3 text-center text-2xl font-bold text-gray-900">Dashboard</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-gray-300 bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Total Students</p>
                    <p className="text-3xl font-bold text-gray-900">{students}</p>
                    <p className="text-sm text-gray-700">10 this month</p>
                  </div>
                  <div className="rounded-xl bg-blue-500 p-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-gray-300 bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Total Classes</p>
                    <p className="text-3xl font-bold text-gray-900">{classes}</p>
                    <p className="text-sm text-gray-700">Active Classes</p>
                  </div>
                  <div className="rounded-xl bg-indigo-700 p-3">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-3 w-full max-w-sm rounded-xl border border-gray-300 bg-white p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Total Teachers</p>
                  <p className="text-3xl font-bold text-gray-900">{teachers}</p>
                  <p className="text-sm text-gray-700">10 this month</p>
                </div>
                <div className="rounded-xl bg-green-500 p-3">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="mt-auto flex justify-end pt-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="rounded-xl bg-blue-500 px-5 py-2 text-base font-semibold text-white hover:bg-blue-600"
              >
                See Details
              </button>
            </div>
          </section>

          <section className="flex min-h-0 flex-col rounded-xl border-2 border-green-500 bg-[#dcece5]/75 p-4">
            <h2 className="mb-3 text-center text-2xl font-bold text-gray-900">Whatsapp</h2>
            <div className="rounded-xl border border-gray-300 bg-white p-3 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xl font-semibold text-gray-900">Last Sent Announcement</p>
                <span className="text-lg font-semibold text-gray-900">9:00am</span>
              </div>
              <p className="mb-2 text-base text-gray-800">Fee reminder sent to Class 9</p>
              <div className="flex justify-end">
                <button
                  onClick={() => navigate('/communication/announcements')}
                  className="rounded-xl bg-blue-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-600"
                >
                  View Details
                </button>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3">
              <MetricBox icon={MessageSquare} value="01" label="Messages Sent today" color="bg-green-500" />
              <MetricBox icon={ClipboardCheck} value="02" label="Message Scheduled" color="bg-indigo-700" />
              <MetricBox icon={Users} value={students} label="Parents Connected" />
            </div>

            <div className="mt-auto flex justify-end pt-3">
              <button
                onClick={() => navigate('/communication/announcements')}
                className="rounded-xl bg-blue-500 px-5 py-2 text-base font-semibold text-white hover:bg-blue-600"
              >
                Send Message
              </button>
            </div>
          </section>

          <section className="flex min-h-0 flex-col rounded-xl border-2 border-amber-500 bg-[#f3eecf]/75 p-4">
            <h2 className="mb-3 text-center text-2xl font-bold text-gray-900">Fees</h2>
            <div className="space-y-3 rounded-xl border border-gray-300 bg-white p-3 shadow-sm">
              <ProgressRow label="Collected" value={collectedPercent} />
              <ProgressRow label="Pending" value={pendingPercent} />
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3">
              <MetricBox icon={DollarSign} value="20L" label="Total Revenue" color="bg-green-500" />
              <MetricBox icon={DollarSign} value="2L" label="Pending Fees" color="bg-slate-600" />
              <MetricBox icon={Users} value="50" label="Defaulters" />
            </div>

            <div className="mt-auto flex justify-end pt-3">
              <button
                onClick={() => navigate('/fees/payments')}
                className="rounded-xl bg-blue-500 px-5 py-2 text-base font-semibold text-white hover:bg-blue-600"
              >
                View Details
              </button>
            </div>
          </section>

          <section className="flex min-h-0 flex-col rounded-xl border-2 border-blue-500 bg-[#dbe4f5]/75 p-4">
            <h2 className="mb-3 text-center text-2xl font-bold text-gray-900">Certificates</h2>
            <div className="grid grid-cols-2 gap-3">
              <MetricBox icon={FileText} value="340" label="Certificates Issued" color="bg-green-500" />
              <MetricBox icon={FileText} value="12" label="Certificates Pending" color="bg-indigo-700" />
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              <div className="flex h-24 items-center justify-center rounded-full border border-gray-300 bg-rose-100 px-2 text-sm font-semibold text-gray-900">
                Bonafide
                <br />
                Certificate
              </div>
              <div className="flex h-24 items-center justify-center rounded-full border border-gray-300 bg-emerald-100 px-2 text-sm font-semibold text-gray-900">
                Leaving
                <br />
                Certificate
              </div>
              <div className="flex h-24 items-center justify-center rounded-full border border-gray-300 bg-amber-100 px-2 text-sm font-semibold text-gray-900">
                Character
                <br />
                Certificate
              </div>
            </div>

            <div className="mt-auto flex justify-end gap-3 pt-3">
              <button
                onClick={() => navigate('/exams/results')}
                className="rounded-xl bg-blue-500 px-5 py-2 text-base font-semibold text-white hover:bg-blue-600"
              >
                View Details
              </button>
              <button
                onClick={() => navigate('/exams/results')}
                className="rounded-xl bg-blue-500 px-5 py-2 text-base font-semibold text-white hover:bg-blue-600"
              >
                Generate
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Welcome
