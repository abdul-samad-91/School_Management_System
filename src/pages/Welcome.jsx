import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Users,
  GraduationCap,
  MessageSquare,
  DollarSign,
  ClipboardCheck,
  FileText,
} from 'lucide-react'
import { dashboardAPI } from '@/lib/api'
import Book from '@/assets/Book.svg'
import userLogo from '@/assets/users.svg'
import messageLogo from '@/assets/messageLogo.svg'
import certificateIcon from '@/assets/certificateIcon.svg'
import StackofCoins from '@/assets/StackofCoins.svg'

const MetricBox = ({ icon, value, label, color = 'bg-blue-500' }) => (
  <div className="rounded-[9px] border-2 border-gray-400 bg-[#F0FDF4] p-2 shadow-[0_4px_10px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center gap-2 py-3 px-10">
    <div className="mb-1.5 flex justify-center">
      <div className={`rounded-lg py-4 px-6 ${color}`}>
        {typeof icon === 'string' ? (
          <img src={icon} alt={label} className="h-7 w-7" />
        ) : (
          <icon className="h-5 w-5 text-white" />
        )}
      </div>
    </div>
    <p className="text-center text-3xl font-medium text-gray-900">{value}</p>
    <p className="text-center text-lg font-semibold leading-tight text-gray-800">{label}</p>
  </div>
)

const ProgressRow = ({ label, value }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-[1.05rem] font-semibold text-gray-900">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-1.5 rounded-full bg-gray-300">
      <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${value}%` }} />
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
    <div className="relative min-h-full w-full bg-[linear-gradient(180deg,#ececec_0%,#d8dceb_42%,#3b4ea1_100%)] text-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.72),transparent_38%)]" />

      <div className="relative grid min-h-full grid-rows-[auto_1fr] gap-3 px-10 py-3 lg:px-14 lg:py-4">
        <header className="welcome-rise flex flex-col items-center justify-center">
          <h1 className="text-center text-5xl font-semibold leading-[1.05] text-black lg:text-[3rem] mb-5">
            Welcome To
            <span className="mt-2 block">School Management System</span>
          </h1>
        </header>

        <div className="mx-auto grid min-h-0 w-full max-w-[82rem] grid-cols-2 grid-rows-2 gap-7">
          <section className="welcome-panel welcome-rise flex min-h-0 flex-col overflow-hidden rounded-lg border-4 border-[#5670db] bg-[#d7deea]/95 p-3 [animation-delay:100ms]">
            <h2 className="mb-2 text-center text-[1.65rem] font-bold text-black">Dashboard</h2>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-[9px] border-2 border-gray-400 bg-white p-3.5 shadow-[0_4px_10px_rgba(0,0,0,0.18)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-black">Total Students</p>
                    <p className="mt-0.5 text-4xl font-medium text-black">{students}</p>
                    <p className="mt-0.5 text-lg text-black/80">10 this month</p>
                  </div>
                  <div className="rounded-xl bg-[#4281eb] p-2.5">
                    {/* <Users className="h-5.5 w-5.5 text-white" /> */}
                    <img src={userLogo} alt="Users" />
                  </div>
                </div>
              </div>
              <div className="rounded-lg w-[304px] h-[155px] border-2 border-gray-400 bg-white p-5 shadow-[0_4px_10px_rgba(0,0,0,0.18)]">
                <div className="flex items-center justify-between">
                  <div >
                    <p className="text-2xl font-semibold text-black">Total Classes</p>
                    <p className="mt-0.5 text-4xl font-medium text-black">{classes}</p>
                    <p className="mt-0.5 text-lg text-black/80">Active Classses</p>
                  </div>
                  <div className="rounded-xl bg-[#3d50ab] p-2.5">
                    {/* <BookOpen className="h-5.5 w-5.5 text-white" /> */}
                    <img src={Book} alt="Book" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-2.5 w-[304px] h-[155px] rounded-[9px] border-2 border-black/10 bg-white p-3.5 shadow-[0_4px_10px_rgba(0,0,0,0.18)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold text-black">Total Teachers</p>
                  <p className="mt-0.5 text-4xl font-medium text-black">{teachers}</p>
                  <p className="mt-0.5 text-lg text-black/80">10 this month</p>
                </div>
                <div className="rounded-xl bg-[#28c85c] p-2.5">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            <div className="mt-auto flex shrink-0 justify-end pt-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="rounded-lg bg-[#4281eb] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#306fe0]"
              >
                See Details
              </button>
            </div>
          </section>

          <section className="welcome-panel welcome-rise flex min-h-0 flex-col overflow-hidden rounded-lg border-4 border-[#2cc763] bg-[#dce9df]/95 p-3 [animation-delay:180ms]">
            <h2 className="mb-2 text-center text-[1.65rem] font-bold text-black">Whatsapp</h2>
            <div className="rounded-[9px] border-2 border-gray-400 bg-white/65 p-2.5 shadow-[0_4px_10px_rgba(0,0,0,0.12)]">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[0.95rem] font-semibold text-black lg:text-xl">Last Sent Announcement</p>
                <span className="text-base font-semibold text-black">9:00am</span>
              </div>
              <p className="mb-2.5 text-lg text-black/85">Fee reminder sent to Class 9</p>
              <div className="flex justify-end">
                <button
                  onClick={() => navigate('/communication/announcements')}
                  className="rounded-lg bg-[#4281eb] px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#306fe0]"
                >
                  View Details
                </button>
              </div>
            </div>

            <div className="mt-2.5 grid grid-cols-3 gap-2">
              <MetricBox icon={messageLogo} value="01" label="Messages Sent today" color="bg-green-500"  />
              <MetricBox icon={messageLogo} value="02" label="Message Scheduled" color="bg-indigo-700" />
              <MetricBox icon={userLogo} value={students} label="Parents Connected" />
            </div>

            <div className="mt-auto flex shrink-0 justify-end pt-2">
              <button
                onClick={() => navigate('/communication/announcements')}
                className="rounded-lg bg-[#4281eb] px- py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#306fe0]"
              >
                Send Message
              </button>
            </div>
          </section>

          <section className="welcome-panel welcome-rise flex min-h-0 flex-col overflow-hidden rounded-lg border-4 border-[#c9891d] bg-[#FEFCE8] p-3 [animation-delay:260ms]">
            <h2 className="mb-2 text-center text-[1.65rem] font-bold text-black">Fees</h2>
            <div className="space-y-3 rounded-[9px] border-2 border-black/10 bg-white/65 p-2.5 shadow-[0_4px_10px_rgba(0,0,0,0.12)]">
              <ProgressRow label="Collected" value={collectedPercent} />
              <ProgressRow label="Pending" value={pendingPercent} />
            </div>

            <div className="mt-2.5 grid grid-cols-3 gap-2">
              <MetricBox icon={StackofCoins} value="20L" label="Total Revenue" color="bg-green-500" />
              <MetricBox icon={StackofCoins} value="2L" label="Pending Fees" color="bg-slate-600" />
              <MetricBox icon={userLogo} value="50" label="Defaulters" />
            </div>

            <div className="mt-auto flex shrink-0 justify-end pt-2">
              <button
                onClick={() => navigate('/fees/payments', { state: { fromWelcome: true } })}
                className="rounded-lg bg-[#4281eb] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#306fe0]"
              >
                View Details
              </button>
            </div>
          </section>

          <section className="welcome-panel welcome-rise flex min-h-0 flex-col overflow-hidden rounded-lg border-4 border-[#4a88ef] bg-[#d7deea]/95 p-3 [animation-delay:340ms]">
            <h2 className="mb-2 text-center text-[1.65rem] font-bold text-black">Certificates</h2>
            <div className="grid grid-cols-2 gap-2">
              <MetricBox icon={certificateIcon} value="340" label="Certificates Issued" color="bg-green-500" />
              <MetricBox icon={certificateIcon} value="12" label="Certificates Pending" color="bg-indigo-700" />
            </div>

            <div className="mt-8 flex items-center justify-between text-center  px-8">
              <div className="flex w-[7.5rem] h-[7.5rem] items-center justify-center rounded-full border border-gray-400 bg-[#f0e5e5] px-2 text-sm font-semibold text-gray-900">
                Bonafide
                <br />
                Certificate
              </div>
              <div className="flex w-[7.5rem] h-[7.5rem] items-center justify-center rounded-full border border-gray-400 bg-[#e4efe5] px-2 text-sm font-semibold text-gray-900">
                Leaving
                <br />
                Certificate
              </div>
              <div className="flex w-[7.5rem] h-[7.5rem] items-center justify-center rounded-full border border-gray-400 bg-[#ece8d0] px-2 text-sm font-semibold text-gray-900">
                Character
                <br />
                Certificate
              </div>
            </div>

            <div className="mt-auto flex shrink-0 justify-end gap-4  pt-6">
              <button
                onClick={() => navigate('/certificates', { state: { fromWelcome: true } })}
                className="rounded-lg bg-[#4281eb] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#306fe0]"
              >
                View Details
              </button>
              <button
                onClick={() =>
                  navigate('/certificates', { state: { fromWelcome: true, openGenerate: true } })
                }
                className="rounded-lg bg-[#4281eb] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#306fe0]"
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
