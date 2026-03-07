import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownUp,
  BookOpen,
  ChevronDown,
  Download,
  Pencil,
  PlusCircle,
  Printer,
  Trash2,
  X,
} from 'lucide-react'
import { toast } from 'sonner'

const CLASS_OPTIONS = ['4', '5', '6', '7', '8', '9', '10', '11', '12']
const SESSION_OPTIONS = ['2025-2026', '2024-2025', '2023-2024']
const MONTH_OPTIONS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const FEE_TYPE_OPTIONS = ['Annual Fee', 'Monthly Fee', 'Exam Fee', 'Transport Fee']
const ROWS_OPTIONS = [10, 20, 30]

const INITIAL_STRUCTURES = Array.from({ length: 200 }, (_, index) => {
  const className = CLASS_OPTIONS[index % CLASS_OPTIONS.length]
  const session = SESSION_OPTIONS[index % SESSION_OPTIONS.length]
  const feeType = index % 4 === 0 ? 'Monthly Fee' : 'Annual Fee'
  const year = session.split('-')[0]
  const monthLabel = MONTH_OPTIONS[index % MONTH_OPTIONS.length]

  return {
    id: `fee-structure-${index + 1}`,
    className,
    feeType,
    amount: feeType === 'Annual Fee' ? '10k/-' : '6k/-',
    monthYear: feeType === 'Annual Fee' ? year : `${monthLabel} ${year}`,
    session,
    fineAfterDue: '10/- per day',
    status: 'Active',
  }
})

const createFormState = (initialValues = {}) => ({
  className: '',
  session: SESSION_OPTIONS[0],
  feeType: FEE_TYPE_OPTIONS[0],
  monthYear: '',
  amount: '',
  ...initialValues,
})

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

const FeeStructures = () => {
  const [structures, setStructures] = useState(INITIAL_STRUCTURES)
  const [selectedSession, setSelectedSession] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [sortOrder, setSortOrder] = useState('az')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [editingId, setEditingId] = useState('')
  const [formData, setFormData] = useState(createFormState())
  const [formError, setFormError] = useState('')

  const filteredStructures = useMemo(() => {
    const filtered = structures.filter((item) => {
      if (selectedSession && item.session !== selectedSession) return false
      if (selectedClass && item.className !== selectedClass) return false
      if (selectedMonth && !item.monthYear.toLowerCase().includes(selectedMonth.toLowerCase())) {
        return false
      }
      return true
    })

    return filtered.sort((first, second) => {
      const classCompare = first.className.localeCompare(second.className, undefined, {
        numeric: true,
      })

      if (classCompare !== 0) {
        return sortOrder === 'az' ? classCompare : -classCompare
      }

      return first.feeType.localeCompare(second.feeType)
    })
  }, [selectedClass, selectedMonth, selectedSession, sortOrder, structures])

  const totalPages = Math.max(1, Math.ceil(filteredStructures.length / rowsPerPage))

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const paginatedStructures = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage
    return filteredStructures.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredStructures, page, rowsPerPage])

  const paginationItems = useMemo(
    () => buildPaginationItems(page, totalPages),
    [page, totalPages]
  )

  const closeModal = () => {
    setIsModalOpen(false)
    setModalMode('add')
    setEditingId('')
    setFormData(createFormState())
    setFormError('')
  }

  const openAddModal = () => {
    setModalMode('add')
    setEditingId('')
    setFormData(createFormState())
    setFormError('')
    setIsModalOpen(true)
  }

  const openEditModal = (item) => {
    setModalMode('edit')
    setEditingId(item.id)
    setFormData(
      createFormState({
        className: item.className,
        session: item.session,
        feeType: item.feeType,
        monthYear: item.monthYear,
        amount: item.amount,
      })
    )
    setFormError('')
    setIsModalOpen(true)
  }

  const handleFormChange = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.className || !formData.session || !formData.feeType) {
      setFormError('Please select class, session, and fee type.')
      return false
    }

    if (!formData.monthYear.trim() || !formData.amount.trim()) {
      setFormError('Please enter month/year and amount.')
      return false
    }

    setFormError('')
    return true
  }

  const handleSaveFee = () => {
    if (!validateForm()) return

    const payload = {
      className: formData.className,
      session: formData.session,
      feeType: formData.feeType,
      amount: formData.amount.trim(),
      monthYear: formData.monthYear.trim(),
      fineAfterDue: '10/- per day',
      status: 'Active',
    }

    if (modalMode === 'add') {
      setStructures((previous) => [
        { ...payload, id: `fee-structure-${Date.now()}` },
        ...previous,
      ])
      setPage(1)
      toast.success('Fee added successfully.')
    } else {
      setStructures((previous) =>
        previous.map((item) => (item.id === editingId ? { ...item, ...payload } : item))
      )
      toast.success('Fee updated successfully.')
    }

    closeModal()
  }

  const handleDeleteFee = (id) => {
    setStructures((previous) => previous.filter((item) => item.id !== id))
    toast.success('Fee removed successfully.')
  }

  const handleExport = () => {
    toast.info('Export will be available in the next step.')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="h-full space-y-4 overflow-y-auto pr-1">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#253256]">Fees Structure</h1>
          <p className="mt-1 text-sm text-[#65708a]">Fees / Fees Structure</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#748098] transition hover:bg-[#e9ecf1]"
            aria-label="Print fee structures"
          >
            <Printer className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg bg-[#dce1eb] px-4 py-2 text-sm font-semibold text-[#475372] transition hover:bg-[#ced5e4]"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            <PlusCircle className="h-4 w-4" />
            Add Fee
          </button>
        </div>
      </div>

      <section className="rounded-xl border border-[#d9dde7] bg-[#f2f3f5]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d9dde7] px-5 py-4">
          <h2 className="text-2xl font-bold text-[#263355]">List</h2>

          <div className="flex flex-wrap items-center gap-2">
            <label className="relative">
              <select
                value={selectedSession}
                onChange={(event) => {
                  setSelectedSession(event.target.value)
                  setPage(1)
                }}
                className="h-10 min-w-[140px] appearance-none rounded-lg border border-[#d4d8e3] bg-white px-3 pr-9 text-sm font-medium text-[#55637f] outline-none transition focus:border-primary-400"
              >
                <option value="">Select Session</option>
                {SESSION_OPTIONS.map((session) => (
                  <option key={session} value={session}>
                    {session}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b869f]" />
            </label>

            <label className="relative">
              <select
                value={selectedMonth}
                onChange={(event) => {
                  setSelectedMonth(event.target.value)
                  setPage(1)
                }}
                className="h-10 min-w-[140px] appearance-none rounded-lg border border-[#d4d8e3] bg-white px-3 pr-9 text-sm font-medium text-[#55637f] outline-none transition focus:border-primary-400"
              >
                <option value="">Select Month</option>
                {MONTH_OPTIONS.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b869f]" />
            </label>

            <button
              type="button"
              onClick={() => setSortOrder((previous) => (previous === 'az' ? 'za' : 'az'))}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#d4d8e3] bg-white px-4 text-sm font-medium text-[#55637f] transition hover:bg-slate-50"
            >
              <ArrowDownUp className="h-4 w-4" />
              Sort By {sortOrder === 'az' ? 'A-Z' : 'Z-A'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d9dde7] px-5 py-3 text-sm text-[#55637f]">
          <div className="flex items-center gap-2">
            <span className="font-medium">Row Per Page</span>
            <label className="relative">
              <select
                value={rowsPerPage}
                onChange={(event) => {
                  setRowsPerPage(Number(event.target.value))
                  setPage(1)
                }}
                className="h-9 min-w-[76px] appearance-none rounded-md border border-[#d4d8e3] bg-white px-3 pr-8 text-sm text-[#4c5877] outline-none transition focus:border-primary-400"
              >
                {ROWS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b869f]" />
            </label>
            <span>Entries</span>
          </div>

          <label className="relative">
            <select
              value={selectedClass}
              onChange={(event) => {
                setSelectedClass(event.target.value)
                setPage(1)
              }}
              className="h-10 min-w-[190px] appearance-none rounded-lg border border-[#d4d8e3] bg-white px-3 pr-9 text-sm font-medium text-[#55637f] outline-none transition focus:border-primary-400"
            >
              <option value="">Select Class</option>
              {CLASS_OPTIONS.map((className) => (
                <option key={className} value={className}>
                  Class {className}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b869f]" />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#e6e9ef]">
              <tr>
                <th className="w-12 px-4 py-3 text-left">
                  <input type="checkbox" className="h-4 w-4 rounded border-[#d5dbe7]" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Class</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Fee Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">M/Y</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">
                  Fine After Due Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {paginatedStructures.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-500">
                    No fee structures found.
                  </td>
                </tr>
              ) : (
                paginatedStructures.map((item) => (
                  <tr key={item.id} className="border-b border-[#e3e7ef] hover:bg-[#fafbfe]">
                    <td className="px-4 py-4">
                      <input type="checkbox" className="h-4 w-4 rounded border-[#d5dbe7]" />
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-primary-600">{item.className}</td>
                    <td className="px-4 py-4 text-sm text-[#4c5877]">{item.feeType}</td>
                    <td className="px-4 py-4 text-sm text-[#4c5877]">{item.amount}</td>
                    <td className="px-4 py-4 text-sm text-[#4c5877]">{item.monthYear}</td>
                    <td className="px-4 py-4 text-sm text-[#4c5877]">{item.fineAfterDue}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 rounded-md bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteFee(item.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#d5dbe7] bg-white text-[#5d6883] transition hover:bg-slate-50"
                          aria-label={`Delete fee for class ${item.className}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#d5dbe7] bg-white text-[#5d6883] transition hover:bg-slate-50"
                          aria-label={`Edit fee for class ${item.className}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-1 px-5 py-4 text-sm text-[#4c5877]">
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
                  isActivePage ? 'bg-primary-600 text-white' : 'text-[#4c5877] hover:bg-[#e8ecf4]'
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
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4 backdrop-blur-[2px]">
          <div className="relative w-full max-w-[560px] rounded-xl border-[3px] border-[#8e8f93] bg-[#efeff1] px-8 py-7 shadow-[0_8px_24px_rgba(15,23,42,0.25)]">
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-3 top-3 rounded-full p-1 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center justify-center gap-3">
              <BookOpen className="h-10 w-10 text-[#0f1524]" />
              <p className="font-serif text-4xl font-bold text-[#0f1524]">SMS</p>
            </div>

            <h3 className="mt-4 text-center text-2xl font-bold text-[#0f1524] sm:text-3xl">
              {modalMode === 'add' ? 'Add Fee' : 'Edit Fee'}
            </h3>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-base font-medium text-[#0f1524]">Class</span>
                <select
                  value={formData.className}
                  onChange={(event) => handleFormChange('className', event.target.value)}
                  className="h-10 w-full rounded-xl border border-[#1f2937] bg-white/80 px-3 text-sm text-[#0f1524] outline-none focus:border-primary-500"
                >
                  <option value="">Select Class</option>
                  {CLASS_OPTIONS.map((className) => (
                    <option key={className} value={className}>
                      Class {className}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-base font-medium text-[#0f1524]">Session</span>
                <select
                  value={formData.session}
                  onChange={(event) => handleFormChange('session', event.target.value)}
                  className="h-10 w-full rounded-xl border border-[#1f2937] bg-white/80 px-3 text-sm text-[#0f1524] outline-none focus:border-primary-500"
                >
                  {SESSION_OPTIONS.map((session) => (
                    <option key={session} value={session}>
                      {session}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-base font-medium text-[#0f1524]">Fee Type</span>
                <select
                  value={formData.feeType}
                  onChange={(event) => handleFormChange('feeType', event.target.value)}
                  className="h-10 w-full rounded-xl border border-[#1f2937] bg-white/80 px-3 text-sm text-[#0f1524] outline-none focus:border-primary-500"
                >
                  {FEE_TYPE_OPTIONS.map((feeType) => (
                    <option key={feeType} value={feeType}>
                      {feeType}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-base font-medium text-[#0f1524]">Month/Year</span>
                <input
                  type="text"
                  value={formData.monthYear}
                  onChange={(event) => handleFormChange('monthYear', event.target.value)}
                  placeholder="e.g. January 2026"
                  className="h-10 w-full rounded-xl border border-[#1f2937] bg-white/80 px-3 text-sm text-[#0f1524] outline-none placeholder:text-slate-400 focus:border-primary-500"
                />
              </label>

              <label className="space-y-1 sm:col-span-2">
                <span className="text-base font-medium text-[#0f1524]">Amount</span>
                <input
                  type="text"
                  value={formData.amount}
                  onChange={(event) => handleFormChange('amount', event.target.value)}
                  placeholder="e.g. 10k/-"
                  className="h-10 w-full rounded-xl border border-[#1f2937] bg-white/80 px-3 text-sm text-[#0f1524] outline-none placeholder:text-slate-400 focus:border-primary-500"
                />
              </label>
            </div>

            {formError && <p className="mt-3 text-sm font-medium text-rose-600">{formError}</p>}

            <div className="mt-8 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-[#1f2937] bg-white/70 px-6 py-2 text-sm font-semibold text-[#131a2a] transition hover:bg-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveFee}
                className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
              >
                {modalMode === 'add' ? 'Add Fee' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeeStructures
