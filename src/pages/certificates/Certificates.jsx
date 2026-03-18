import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowUpDown,
  ClipboardCheck,
  Edit3,
  FileBadge2,
  Filter,
  Pencil,
  Plus,
  Printer,
  Search,
  Trash2,
  Upload,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import filterIcon from '@/assets/filterIcon.svg'
import sortVector from '@/assets/sortVector.svg'
import Trash from '@/assets/Trash.svg'
import printer from '@/assets/printer.svg'
import edit from '@/assets/edit.svg'
import certificateIcon from '@/assets/certificateIcon.svg'
import edit3 from '@/assets/edit3.svg'
import notesIcon from '@/assets/notesIcon.svg'

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
  {
    id: 'cert-7',
    admNo: 'SU128400',
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
  {
    id: 'cert-8',
    admNo: 'SU128401',
    name: 'Iqbal Awan',
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
  {
    id: 'cert-9',
    admNo: 'SU128402',
    name: 'Iqbal Awan',
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

const StatCard = ({ title, value, subtitle, icon: Icon, iconClass, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full text-left"
  >
    <div
      className={`rounded-2xl border-[3px] bg-white px-6 py-10  shadow-lg border-gray-200 transition `}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-2xl font-semibold text-[#141b34]">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-[#0f172a]">{value}</p>
          <p className="mt-2 text-xl text-[#505a74]">{subtitle}</p>
        </div>
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconClass}`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
      </div>
    </div>
  </button>
)

const InputField = ({ label, placeholder, value, onChange, type = 'text' }) => (
  <label className="space-y-1">
    <span className="text-xl font-medium text-[#111827]">{label}</span>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="h-10 w-full rounded-xl bg-[#f2f2f2] px-3 text-sm text-[#111827] outline-none transition focus:ring-2 focus:ring-primary-300"
    />
  </label>
)

const Certificates = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isFromWelcome = Boolean(location.state?.fromWelcome)

  const [isLoading, setIsLoading] = useState(true)
  const [certificates, setCertificates] = useState(INITIAL_CERTIFICATES)
  const [activeStatus, setActiveStatus] = useState('all')
  const [isGenerateOpen, setIsGenerateOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formValues, setFormValues] = useState(EMPTY_CERTIFICATE)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSession, setSelectedSession] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterClass, setFilterClass] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 450)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (location.state?.openGenerate) {
      setEditingId(null)
      setFormValues(EMPTY_CERTIFICATE)
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

  const handleOpenGenerate = () => {
    setEditingId(null)
    setFormValues(EMPTY_CERTIFICATE)
    setIsGenerateOpen(true)
  }

  const handleCloseGenerate = () => {
    setIsGenerateOpen(false)
    setEditingId(null)
  }

  const handleEdit = (record) => {
    setEditingId(record.id)
    setFormValues({
      admNo: record.admNo ?? '',
      name: record.name ?? '',
      className: record.className ?? '',
      section: record.section ?? '',
      type: record.type ?? '',
      title: record.title ?? '',
      session: record.session ?? '',
      issuedDate: record.issuedDate ?? '',
      signatory: record.signatory ?? '',
      templateId: record.templateId ?? TEMPLATE_OPTIONS[0].id,
    })
    setIsGenerateOpen(true)
  }

  const handleDelete = (id) => {
    setCertificates((prev) => prev.filter((item) => item.id !== id))
    toast.success('Certificate removed successfully.')
  }

  const handlePrint = (record) => {
    const printWindow = window.open('', '_blank', 'width=900,height=650')
    if (!printWindow) {
      toast.error('Please allow pop-ups to print the certificate.')
      return
    }

    const issuedDate = record.issuedDate || 'Not Issued'
    const html = `
      <html>
        <head>
          <title>Certificate</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #1f2937; }
            .card { border: 2px solid #1f2937; border-radius: 16px; padding: 32px; }
            h1 { margin: 0 0 8px; font-size: 28px; }
            h2 { margin: 0 0 24px; font-size: 18px; font-weight: 500; color: #6b7280; }
            .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
            .label { font-weight: 600; }
            .footer { margin-top: 36px; display: flex; justify-content: space-between; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>${record.title || 'Certificate'}</h1>
            <h2>Presented to ${record.name || 'Student'}</h2>
            <div class="row"><span class="label">Admission No.</span><span>${record.admNo || '-'}</span></div>
            <div class="row"><span class="label">Class</span><span>${record.className || '-'}</span></div>
            <div class="row"><span class="label">Type</span><span>${record.type || '-'}</span></div>
            <div class="row"><span class="label">Session</span><span>${record.session || '-'}</span></div>
            <div class="row"><span class="label">Issued Date</span><span>${issuedDate}</span></div>
            <div class="footer">
              <span>Authorized By: ${record.signatory || 'Authorized Signatory'}</span>
              <span>Status: ${record.status || 'Draft'}</span>
            </div>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  const handleSave = () => {
    const trimmedName = formValues.name.trim()
    const trimmedType = formValues.type.trim()

    if (!trimmedName || !trimmedType) {
      toast.error('Student name and certificate type are required.')
      return
    }

    const status = formValues.issuedDate ? 'Issued' : 'Draft'
    const nextRecord = {
      id: editingId || `cert-${Date.now()}`,
      admNo: formValues.admNo || `SU${Math.floor(Math.random() * 900000 + 100000)}`,
      name: formValues.name,
      className: formValues.className || 'N/A',
      section: formValues.section || '',
      type: formValues.type,
      title: formValues.title || 'Certificate',
      session: formValues.session || SESSION_OPTIONS[0],
      issuedDate: formValues.issuedDate,
      signatory: formValues.signatory || 'Principal',
      templateId: formValues.templateId,
      status,
    }

    setCertificates((prev) => {
      if (editingId) {
        return prev.map((item) => (item.id === editingId ? nextRecord : item))
      }
      return [nextRecord, ...prev]
    })
    toast.success(editingId ? 'Certificate updated successfully.' : 'Certificate created successfully.')
    handleCloseGenerate()
  }

  const handleStatusFilter = (nextStatus) => {
    setActiveStatus(nextStatus)
    setPage(1)
  }

  const handleClearFilters = () => {
    setFilterType('')
    setFilterClass('')
    setPage(1)
  }

  const filteredRows = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase()

    return certificates.filter((item) => {
      if (activeStatus === 'issued' && item.status !== 'Issued') return false
      if (activeStatus === 'draft' && item.status !== 'Draft') return false
      if (selectedSession && item.session !== selectedSession) return false
      if (filterType && item.type !== filterType) return false
      if (filterClass && item.className !== filterClass) return false

      if (
        normalized &&
        !item.name.toLowerCase().includes(normalized) &&
        !item.admNo.toLowerCase().includes(normalized)
      ) {
        return false
      }

      return true
    })
  }, [activeStatus, certificates, searchTerm, selectedSession, filterClass, filterType])

  const sortedRows = useMemo(() => {
    const data = [...filteredRows]
    data.sort((a, b) => {
      const direction = sortOrder === 'asc' ? 1 : -1
      return a.name.localeCompare(b.name) * direction
    })
    return data
  }, [filteredRows, sortOrder])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage))

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const paginatedRows = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage
    return sortedRows.slice(startIndex, startIndex + rowsPerPage)
  }, [sortedRows, page, rowsPerPage])

  const paginationItems = useMemo(
    () => buildPaginationItems(page, totalPages),
    [page, totalPages]
  )

  const issuedCount = certificates.filter((item) => item.status === 'Issued').length
  const draftCount = certificates.filter((item) => item.status === 'Draft').length
  const totalCount = certificates.length
  const isEditing = Boolean(editingId)
  const typeOptions = useMemo(
    () => Array.from(new Set(certificates.map((item) => item.type).filter(Boolean))),
    [certificates]
  )
  const classOptions = useMemo(
    () => Array.from(new Set(certificates.map((item) => item.className).filter(Boolean))),
    [certificates]
  )

  const handleFormChange = (field) => (event) => {
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }))
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div className="scrollbar-hide h-full space-y-6 overflow-y-auto pr-1">
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
            <h1 className="text-3xl font-semibold tracking-tight text-[#253256]">Certificates</h1>
            <p className="mt-1 text-lg text-gray-700">
              Generate and manage student certificates
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenGenerate}
          className="inline-flex items-center gap-2 rounded bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
        >
          <Plus className="h-3 w-3 bg-white rounded text-primary-500" />
          Generate Certificate
        </button>
      </div>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <StatCard
          title="Total Certificates"
          value={String(totalCount)}
          subtitle="10 this month"
          icon={()=> <img src={certificateIcon} alt="Total Certificates" className="h-7 w-7 text-white" />}
          iconClass="bg-[#3f7bf5]"
          isActive={activeStatus === 'all'}
          onClick={() => handleStatusFilter('all')}
        />
        <StatCard
          title="Issued"
          value={String(issuedCount)}
          subtitle="10 this month"
          icon={() => <img src={notesIcon} alt="Issued Certificates" className="h-7 w-7 text-white" />}
          iconClass="bg-[#22c55e]"
          isActive={activeStatus === 'issued'}
          onClick={() => handleStatusFilter('issued')}
        />
        <StatCard
          title="Drafts"
          value={String(draftCount)}
          subtitle="Pending"
          icon={() => <img src={edit3} alt="Drafts" className="h-7 w-7" />}
          iconClass="bg-[#1e3a8a]"
          isActive={activeStatus === 'draft'}
          onClick={() => handleStatusFilter('draft')}
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

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsFilterOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-lg border border-[#d4d8e3] bg-white px-3 py-2 text-sm font-semibold text-[#4c5877] transition hover:bg-[#f5f7fb]"
              >
                {/* <Filter className="h-4 w-4" /> */}
                <img src={filterIcon} alt="Filter Icon" className="w-4 h-4"/>
                Filter
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 z-20 mt-2 w-60 rounded-lg border border-[#d4d8e3] bg-white p-3 shadow-lg">
                  <label className="block text-xs font-semibold text-[#6b7280]">Type</label>
                  <select
                    value={filterType}
                    onChange={(event) => {
                      setFilterType(event.target.value)
                      setPage(1)
                    }}
                    className="mt-1 h-9 w-full rounded-md border border-[#d4d8e3] bg-white px-2 text-sm text-[#4c5877] outline-none"
                  >
                    <option value="">All Types</option>
                    {typeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>

                  <label className="mt-3 block text-xs font-semibold text-[#6b7280]">Class</label>
                  <select
                    value={filterClass}
                    onChange={(event) => {
                      setFilterClass(event.target.value)
                      setPage(1)
                    }}
                    className="mt-1 h-9 w-full rounded-md border border-[#d4d8e3] bg-white px-2 text-sm text-[#4c5877] outline-none"
                  >
                    <option value="">All Classes</option>
                    {classOptions.map((className) => (
                      <option key={className} value={className}>
                        {className}
                      </option>
                    ))}
                  </select>

                  <div className="mt-3 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="rounded-md border border-[#d4d8e3] px-2.5 py-1 text-xs font-semibold text-[#4c5877] hover:bg-[#f5f7fb]"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsFilterOpen(false)}
                      className="rounded-md bg-primary-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-primary-700"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                setPage(1)
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-[#d4d8e3] bg-white px-3 py-2 text-sm font-semibold text-[#4c5877] transition hover:bg-[#f5f7fb]"
            >
              {/* <ArrowUpDown className="h-4 w-4" /> */}
              <img src={sortVector} className="w-4 h-4" />
              {sortOrder === 'asc' ? 'Sort By A-Z' : 'Sort By Z-A'}
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
                onChange={(event) => {
                  setSelectedSession(event.target.value)
                  setPage(1)
                }}
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
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-sm text-[#6b7280]">
                    No certificates found.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row) => (
                  <tr key={row.id} className="border-b border-[#e3e7ef]">
                    <td className="px-4 py-4">
                      <input type="checkbox" className="h-4 w-4 rounded border-[#d5dbe7]" />
                    </td>
                    <td className="px-4 py-4 text-sm text-[#3b45b2]">{row.admNo}</td>
                    <td className="px-4 py-4 text-sm text-[#4c5877]">{row.name}</td>
                    <td className="px-4 py-4 text-sm text-[#4c5877]">{row.type}</td>
                    <td className="px-4 py-4 text-sm text-[#4c5877]">{row.title}</td>
                    <td className="px-4 py-4 text-sm text-[#4c5877]">{row.className}</td>
                    <td className="px-4 py-4 text-sm text-[#4c5877]">
                      {row.issuedDate || '-'}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-3 py-1 text-xs font-semibold ${
                          row.status === 'Issued'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            row.status === 'Issued' ? 'bg-[#1ABE17]' : 'bg-amber-500'
                          }`}
                        />
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handlePrint(row)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#d5dbe7] bg-white text-[#5d6883] transition hover:bg-slate-50"
                          aria-label="Print certificate"
                        >
                          {/* <Printer className="h-4 w-4" /> */}
                         < img src={printer}  className="w-4 h-4"/>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#d5dbe7] bg-white text-[#5d6883] transition hover:bg-slate-50"
                          aria-label="Delete certificate"
                        >
                          {/* <Trash2 className="h-4 w-4" /> */}
                          < img src={Trash}  className="w-4 h-4"/>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(row)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#d5dbe7] bg-white text-[#5d6883] transition hover:bg-slate-50"
                          aria-label="Edit certificate"
                        >
                          {/* <Pencil className="h-4 w-4" /> */}
                          < img src={edit}  className="w-4 h-4"/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
        <div className="fixed inset-x-0 bottom-0 top-[45px] z-50 flex items-start justify-center overflow-y-auto bg-white/30 px-4 py-10 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-lg border-[3px]  border-gray-400 bg-white py-6 px-12 shadow-2xl shadow-black-500/50  max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="space-y-1">
              <h2 className="text-[32px] font-semibold text-[#223055]">
                {isEditing ? 'Edit Certificate' : 'Generate Certificates'}
              </h2>
              <p className="text-lg text-gray-800 pb-4 ">
                {isEditing ? 'Update the certificate details' : 'Create a new certificate for student'}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputField
                label="Enter Student Name*"
                value={formValues.name}
                onChange={handleFormChange('name')}
        
              />
              <InputField
                label="Student Admission No."
                value={formValues.admNo}
                onChange={handleFormChange('admNo')}
              />
              <InputField
                label="Class"
                value={formValues.className}
                onChange={handleFormChange('className')}
              />
              <InputField
                label="Section"
                value={formValues.section}
                onChange={handleFormChange('section')}
              />
              <InputField
                label="Certificate Type*"
                value={formValues.type}
                onChange={handleFormChange('type')}
              />
              <InputField
                label="Certificate Title*"
                value={formValues.title}
                onChange={handleFormChange('title')}
              />
            </div>

            <div className="mt-5 space-y-3 ">
              <div className="flex items-center justify-between">
                <p className="text-xl font-semibold text-[#111827]">Choose Template</p>
                <button
                  type="button"
                  onClick={() => toast.info('Template import will be added next.')}
                  className="inline-flex items-center gap-2 rounded-md bg-primary-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-700"
                >
                  {/* <Upload className="h-3.5 w-3.5" /> */}
                  Import
                </button>
              </div>
              <div className="rounded-xl bg-[#f3f3f3] p-5">
                <div className="grid grid-cols-3 gap-3">
                  {TEMPLATE_OPTIONS.map((template) => {
                    const isSelected = formValues.templateId === template.id
                    return (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() =>
                          setFormValues((prev) => ({ ...prev, templateId: template.id }))
                        }
                        className={`h-20 rounded-md border ${template.className} transition ${
                          isSelected ? 'ring-2 ring-primary-400' : 'ring-0'
                        }`}
                        aria-label="Select certificate template"
                      />
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputField
                label="Select Academic Session*"
                value={formValues.session}
                onChange={handleFormChange('session')}
              />
              <InputField
                label="Issued Date*"
                value={formValues.issuedDate}
                onChange={handleFormChange('issuedDate')}
              />
            </div>

            <div className="mt-4">
              <InputField
                label="Authorized Signatory*"
                value={formValues.signatory}
                onChange={handleFormChange('signatory')}
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseGenerate}
                className="rounded border-2 border-gray-500 bg-white px-6 py-3 mt-4 mb-4 text-sm font-semibold text-[#1f2937] transition hover:bg-[#f3f4f6]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCloseGenerate}
                className="rounded border-2 border-gray-500 bg-white px-6 py-3 mt-4 mb-4 text-sm font-semibold text-[#1f2937] transition hover:bg-[#f3f4f6]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-lg bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
              >
                {isEditing ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Certificates
