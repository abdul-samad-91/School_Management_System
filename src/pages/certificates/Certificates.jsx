import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowUpDown,
  ClipboardCheck,
  Edit3,
  FileBadge2,
  Filter,
  Pencil,
  PlusCircle,
  Printer,
  Search,
  Trash2,
  Upload,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const SESSION_OPTIONS = ['2025-2026', '2024-2025', '2023-2024']
const ROWS_OPTIONS = [10, 20, 30]

const TEMPLATE_OPTIONS = [
  {
    id: 'template-classic',
    className: 'border-[#d6c7a0] bg-[linear-gradient(135deg,#fefcf6,#f4e6bf)]',
  },
  {
    id: 'template-blue',
    className: 'border-[#8fb1da] bg-[linear-gradient(135deg,#f7fbff,#d7e6f8)]',
  },
  {
    id: 'template-gold',
    className: 'border-[#d7b27b] bg-[linear-gradient(135deg,#fffdf4,#f7e7c6)]',
  },
]

const INITIAL_CERTIFICATES = [
  {
    id: 'cert-1',
    admNo: 'SU128394',
    name: 'Ali Ahmad',
    type: 'Academic',
    title: 'Academic Excellence Certificate',
    className: '9-A',
    section: 'A',
    session: '2025-2026',
    issuedDate: '12-12-2025',
    signatory: 'Principal',
    templateId: 'template-classic',
    status: 'Issued',
  },
  {
    id: 'cert-2',
    admNo: 'SU128395',
    name: 'Sadia Iqbal',
    type: 'Completion',
    title: 'Course Completion Certificate',
    className: '10-A',
    section: 'A',
    session: '2025-2026',
    issuedDate: '12-12-2025',
    signatory: 'Principal',
    templateId: 'template-blue',
    status: 'Issued',
  },
  {
    id: 'cert-3',
    admNo: 'SU128396',
    name: 'Amna Ali',
    type: 'Participation',
    title: 'Participation Certificate',
    className: '8-A',
    section: 'A',
    session: '2024-2025',
    issuedDate: '12-12-2025',
    signatory: 'Coordinator',
    templateId: 'template-gold',
    status: 'Issued',
  },
  {
    id: 'cert-4',
    admNo: 'SU128397',
    name: 'Zaib Hassan',
    type: 'Sports',
    title: 'Sports Excellence Certificate',
    className: '7-A',
    section: 'A',
    session: '2024-2025',
    issuedDate: '12-12-2025',
    signatory: 'Coordinator',
    templateId: 'template-classic',
    status: 'Issued',
  },
  {
    id: 'cert-5',
    admNo: 'SU128398',
    name: 'Sanan Khan',
    type: 'Academic',
    title: 'Academic Excellence Certificate',
    className: '9-A',
    section: 'A',
    session: '2023-2024',
    issuedDate: '',
    signatory: 'Principal',
    templateId: 'template-blue',
    status: 'Draft',
  },
  {
    id: 'cert-6',
    admNo: 'SU128399',
    name: 'Iqbal Ahmad',
    type: 'Academic',
    title: 'Academic Excellence Certificate',
    className: '9-A',
    section: 'A',
    session: '2023-2024',
    issuedDate: '',
    signatory: 'Principal',
    templateId: 'template-gold',
    status: 'Draft',
  },
]

const EMPTY_CERTIFICATE = {
  admNo: '',
  name: '',
  className: '',
  section: '',
  type: '',
  title: '',
  session: '',
  issuedDate: '',
  signatory: '',
  templateId: TEMPLATE_OPTIONS[0].id,
}

const buildPaginationItems = (currentPage, totalPages) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const items = [1]

  if (currentPage > 3) {
    items.push('left-ellipsis')
  }

  const startPage = Math.max(2, currentPage - 1)
  const endPage = Math.min(totalPages - 1, currentPage + 1)

  for (let page = startPage; page <= endPage; page += 1) {
    items.push(page)
  }

  if (currentPage < totalPages - 2) {
    items.push('right-ellipsis')
  }

  items.push(totalPages)
  return items
}

const StatCard = ({ title, value, subtitle, icon: Icon, iconClass }) => (
  <article className="rounded-2xl border border-[#d7dbe5] bg-white px-6 py-5 shadow-[0_2px_6px_rgba(30,41,59,0.15)]">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-lg font-semibold text-[#141b34]">{title}</p>
        <p className="mt-2 text-3xl font-semibold text-[#0f172a]">{value}</p>
        <p className="mt-2 text-base text-[#505a74]">{subtitle}</p>
      </div>
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconClass}`}>
        <Icon className="h-7 w-7 text-white" />
      </div>
    </div>
  </article>
)

const InputField = ({ label, placeholder }) => (
  <label className="space-y-1">
    <span className="text-sm font-semibold text-[#111827]">{label}</span>
    <input
      type="text"
      placeholder={placeholder}
      className="h-10 w-full rounded-lg bg-[#f2f2f2] px-3 text-sm text-[#111827] outline-none transition focus:ring-2 focus:ring-primary-300"
    />
  </label>
)

const Certificates = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isFromWelcome = Boolean(location.state?.fromWelcome)

  const [isGenerateOpen, setIsGenerateOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSession, setSelectedSession] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (location.state?.openGenerate) {
      setIsGenerateOpen(true)
    }
  }, [location.state])

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate('/')
  }

  const filteredRows = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase()
    if (!normalized) return CERTIFICATE_ROWS
    return CERTIFICATE_ROWS.filter(
      (item) =>
        item.name.toLowerCase().includes(normalized) ||
        item.admNo.toLowerCase().includes(normalized)
    )
  }, [searchTerm])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage))

  const paginatedRows = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage
    return filteredRows.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredRows, page, rowsPerPage])

  const paginationItems = useMemo(
    () => buildPaginationItems(page, totalPages),
    [page, totalPages]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {isFromWelcome && (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#d9dde7] bg-white text-[#475372] transition hover:bg-[#eef1f6]"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#253256]">Certificates</h1>
            <p className="mt-1 text-sm text-[#65708a]">
              Generate and manage student certificates
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsGenerateOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
        >
          <PlusCircle className="h-4 w-4" />
          Generate Certificate
        </button>
      </div>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <StatCard
          title="Total Certificates"
          value="20"
          subtitle="10 this month"
          icon={FileBadge2}
          iconClass="bg-[#3f7bf5]"
        />
        <StatCard
          title="Issued"
          value="2"
          subtitle="10 this month"
          icon={ClipboardCheck}
          iconClass="bg-[#22c55e]"
        />
        <StatCard
          title="Drafts"
          value="2"
          subtitle="Pending"
          icon={Edit3}
          iconClass="bg-[#1e3a8a]"
        />
      </section>

      <section className="rounded-xl border border-[#d9dde7] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e3e7ef] px-5 py-4">
          <h2 className="text-lg font-semibold text-[#273355]">Students List</h2>

          <div className="flex flex-wrap items-center gap-2">
            <label className="relative min-w-[210px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value)
                  setPage(1)
                }}
                placeholder="Search"
                className="h-9 w-full rounded-lg border border-[#d4d8e3] bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-primary-400"
              />
            </label>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-[#d4d8e3] bg-white px-3 py-2 text-sm font-semibold text-[#4c5877] transition hover:bg-[#f5f7fb]"
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-[#d4d8e3] bg-white px-3 py-2 text-sm font-semibold text-[#4c5877] transition hover:bg-[#f5f7fb]"
            >
              <ArrowUpDown className="h-4 w-4" />
              Sort By A-Z
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e3e7ef] px-5 py-3 text-sm text-[#55637f]">
          <div className="flex items-center gap-2">
            <span className="font-medium">Row Per Page</span>
            <label className="relative">
              <select
                value={rowsPerPage}
                onChange={(event) => {
                  setRowsPerPage(Number(event.target.value))
                  setPage(1)
                }}
                className="h-8 min-w-[70px] appearance-none rounded-md border border-[#d4d8e3] bg-white px-2.5 pr-7 text-sm text-[#4c5877] outline-none transition focus:border-primary-400"
              >
                {ROWS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <span>Entries</span>
          </div>

          <label className="relative">
            <select
              value={selectedSession}
              onChange={(event) => setSelectedSession(event.target.value)}
              className="h-9 min-w-[180px] appearance-none rounded-lg border border-[#d4d8e3] bg-white px-3 pr-8 text-sm font-medium text-[#55637f] outline-none transition focus:border-primary-400"
            >
              <option value="">Select Session</option>
              {SESSION_OPTIONS.map((session) => (
                <option key={session} value={session}>
                  {session}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#eef2f7]">
              <tr>
                <th className="w-12 px-4 py-3 text-left">
                  <input type="checkbox" className="h-4 w-4 rounded border-[#d5dbe7]" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Adm No.</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Class</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Issued date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {paginatedRows.map((row) => (
                <tr key={row.id} className="border-b border-[#e3e7ef]">
                  <td className="px-4 py-4">
                    <input type="checkbox" className="h-4 w-4 rounded border-[#d5dbe7]" />
                  </td>
                  <td className="px-4 py-4 text-sm text-[#3b45b2]">{row.admNo}</td>
                  <td className="px-4 py-4 text-sm text-[#4c5877]">{row.name}</td>
                  <td className="px-4 py-4 text-sm text-[#4c5877]">{row.type}</td>
                  <td className="px-4 py-4 text-sm text-[#4c5877]">{row.title}</td>
                  <td className="px-4 py-4 text-sm text-[#4c5877]">{row.className}</td>
                  <td className="px-4 py-4 text-sm text-[#4c5877]">{row.issuedDate}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1 rounded-md bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#d5dbe7] bg-white text-[#5d6883] transition hover:bg-slate-50"
                        aria-label="Print certificate"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#d5dbe7] bg-white text-[#5d6883] transition hover:bg-slate-50"
                        aria-label="Delete certificate"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#d5dbe7] bg-white text-[#5d6883] transition hover:bg-slate-50"
                        aria-label="Edit certificate"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div className="flex-1" />
          <div className="flex items-center gap-1 text-sm text-[#4c5877]">
            <button
              type="button"
              onClick={() => setPage((previous) => Math.max(1, previous - 1))}
              className="rounded-md px-2 py-1 transition hover:bg-[#e8ecf4] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={page === 1}
            >
              Pre
            </button>

            {paginationItems.map((item, index) => {
              if (typeof item !== 'number') {
                return (
                  <span key={`${item}-${index}`} className="px-2 py-1 text-[#65708a]">
                    ....
                  </span>
                )
              }

              const isActivePage = item === page
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPage(item)}
                  className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 transition ${
                    isActivePage
                      ? 'bg-primary-600 text-white'
                      : 'text-[#4c5877] hover:bg-[#e8ecf4]'
                  }`}
                >
                  {item}
                </button>
              )
            })}

            <button
              type="button"
              onClick={() => setPage((previous) => Math.min(totalPages, previous + 1))}
              className="rounded-md px-2 py-1 transition hover:bg-[#e8ecf4] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {isGenerateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-10 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl border-2 border-[#9e9e9e] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.25)]">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-[#223055]">Generate Certificates</h2>
              <p className="text-sm text-[#7b869f]">Create a new certificate for student</p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputField label="Enter Student Name*" placeholder="" />
              <InputField label="Student Admission No." placeholder="" />
              <InputField label="Class" placeholder="" />
              <InputField label="Section" placeholder="" />
              <InputField label="Certificate Type*" placeholder="" />
              <InputField label="Certificate Title*" placeholder="" />
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#111827]">Choose Template</p>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-700"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Import
                </button>
              </div>
              <div className="rounded-xl bg-[#f3f3f3] p-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-20 rounded-md border border-[#d6c7a0] bg-[linear-gradient(135deg,#fefcf6,#f4e6bf)]" />
                  <div className="h-20 rounded-md border border-[#8fb1da] bg-[linear-gradient(135deg,#f7fbff,#d7e6f8)]" />
                  <div className="h-20 rounded-md border border-[#d7b27b] bg-[linear-gradient(135deg,#fffdf4,#f7e7c6)]" />
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputField label="Select Academic Session*" placeholder="" />
              <InputField label="Issued Date*" placeholder="" />
            </div>

            <div className="mt-4">
              <InputField label="Authorized Signatory*" placeholder="" />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsGenerateOpen(false)}
                className="rounded-lg border border-[#a7acb8] bg-white px-4 py-2 text-sm font-semibold text-[#1f2937] transition hover:bg-[#f3f4f6]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setIsGenerateOpen(false)}
                className="rounded-lg border border-[#a7acb8] bg-white px-4 py-2 text-sm font-semibold text-[#1f2937] transition hover:bg-[#f3f4f6]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setIsGenerateOpen(false)}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Certificates
