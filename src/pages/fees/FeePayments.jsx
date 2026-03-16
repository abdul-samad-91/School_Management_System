import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ChevronDown,
  Download,
  MoreVertical,
  Pencil,
  PlusCircle,
  Printer,
  Search,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import FeeChallanModal from './components/FeeChallanModal'
import fileExport from "@/assets/fileExport.svg"
import printer from "@/assets/printer.svg"
import edit from "@/assets/edit.svg"
import Trash from "@/assets/Trash.svg"
import dotsVertical from "@/assets/dotsVertical.svg"

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
const CLASS_OPTIONS = ['4', '5', '6', '7', '8', '9', '10', '11', '12']
const ROWS_OPTIONS = [10, 20, 30]

const STUDENT_NAMES = ['Ali', 'Asia', 'Amnai', 'Aliya', 'Bilal', 'Beenish', 'Fatima', 'Hania']

const INITIAL_PAYMENTS = Array.from({ length: 200 }, (_, index) => {
  const totalAmount = 6000
  const isPaid = index % 3 !== 0
  const paidAmount = isPaid ? totalAmount : 0
  const pendingAmount = isPaid ? 0 : totalAmount

  return {
    id: `fee-payment-${index + 1}`,
    rollNo: String(index + 1).padStart(4, '0'),
    studentName: STUDENT_NAMES[index % STUDENT_NAMES.length],
    className: CLASS_OPTIONS[index % CLASS_OPTIONS.length],
    session: SESSION_OPTIONS[index % SESSION_OPTIONS.length],
    month: MONTH_OPTIONS[index % MONTH_OPTIONS.length],
    amount: totalAmount,
    paidAmount,
    pendingAmount,
    dueDate: isPaid ? '-' : '12-12-2025',
    fineAfterDue: isPaid ? '-' : '10/- per day',
    status: isPaid ? 'Paid' : 'Unpaid',
  }
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

const formatCompactAmount = (value) => {
  if (value >= 100000) {
    const lakhValue = value / 100000
    const formatted = Number.isInteger(lakhValue) ? lakhValue : lakhValue.toFixed(1)
    return `${formatted}L`
  }


  if (value >= 1000) {
    return `${Math.round(value / 1000)}k`
  }

  return String(value)
}

const FeePayments = () => {
  const navigate = useNavigate()
  const [payments, setPayments] = useState(INITIAL_PAYMENTS)
  const [selectedSession, setSelectedSession] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const [isChallanOpen, setIsChallanOpen] = useState(false)
  const [challanRecord, setChallanRecord] = useState(null)

  const filteredPayments = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return payments.filter((payment) => {
      if (selectedSession && payment.session !== selectedSession) return false
      if (selectedMonth && payment.month !== selectedMonth) return false
      if (selectedClass && payment.className !== selectedClass) return false
      if (
        normalizedSearch &&
        !payment.studentName.toLowerCase().includes(normalizedSearch) &&
        !payment.rollNo.includes(normalizedSearch)
      ) {
        return false
      }

      return true
    })
  }, [payments, searchTerm, selectedClass, selectedMonth, selectedSession])

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / rowsPerPage))

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const paginatedPayments = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage
    return filteredPayments.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredPayments, page, rowsPerPage])

  const paginationItems = useMemo(
    () => buildPaginationItems(page, totalPages),
    [page, totalPages]
  )

  const summary = useMemo(() => {
    const totalRevenue = filteredPayments.reduce((sum, item) => sum + item.paidAmount, 0)
    const pendingAmount = filteredPayments.reduce((sum, item) => sum + item.pendingAmount, 0)
    const paidStudents = filteredPayments.filter((item) => item.status === 'Paid').length
    const defaulters = filteredPayments.length - paidStudents

    return {
      totalRevenue,
      pendingAmount,
      paidStudents,
      defaulters,
      totalStudents: filteredPayments.length,
    }
  }, [filteredPayments])

  const openChallan = (payment) => {
    setChallanRecord(payment)
    setIsChallanOpen(true)
  }

  const closeChallan = () => {
    setIsChallanOpen(false)
    setChallanRecord(null)
  }

  const handleDeletePayment = (id) => {
    setPayments((previous) => previous.filter((item) => item.id !== id))
    toast.success('Payment record removed successfully.')
  }

  const handleToggleStatus = (id) => {
    setPayments((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item

        if (item.status === 'Paid') {
          return {
            ...item,
            paidAmount: 0,
            pendingAmount: item.amount,
            dueDate: '12-12-2025',
            fineAfterDue: '10/- per day',
            status: 'Unpaid',
          }
        }

        return {
          ...item,
          paidAmount: item.amount,
          pendingAmount: 0,
          dueDate: '-',
          fineAfterDue: '-',
          status: 'Paid',
        }
      })
    )
    toast.success('Payment status updated.')
  }

  const handleExport = () => {
    toast.info('Export will be available in the next step.')
  }

  const handleTopPrint = () => {
    if (!paginatedPayments.length) {
      toast.info('No fee payment record available to print.')
      return
    }

    openChallan(paginatedPayments[0])
  }

  const handleAddStudent = () => {
    toast.info('Add student flow will be connected in the next step.')
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate('/')
  }

  const statsCards = [
    {
      title: 'Total Revenue',
      value: formatCompactAmount(summary.totalRevenue),
      subtitle: 'Collected this term',
      panelClass: 'border-[#9da8b7] bg-[#EFF6FF]',
      valueClass: 'text-[#3b82f6]',
    },
    {
      title: 'Pending Amount',
      value: formatCompactAmount(summary.pendingAmount),
      subtitle: 'Yet to Collect',
      panelClass: 'border-[#9daf9f] bg-[#F0FDF4]',
      valueClass: 'text-[#22c55e]',
    },
    {
      title: 'Paid Students',
      value: String(summary.paidStudents),
      subtitle: `Out of ${summary.totalStudents} Students`,
      panelClass: 'border-[#a99da0] bg-[#FEF2F2]',
      valueClass: 'text-[#b91c1c]',
    },
    {
      title: 'Defaulters',
      value: String(summary.defaulters),
      subtitle: `Out of ${summary.totalStudents} Students`,
      panelClass: 'border-[#aaa88f] bg-[#FEFCE8]',
      valueClass: 'text-[#a16207]',
    },
  ]

  return (
    <div className="scrollbar-hide h-full space-y-4 overflow-y-auto pr-1">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* <button
            type="button"
            onClick={handleBack}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#d9dde7] bg-white text-[#475372] transition hover:bg-[#eef1f6]"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button> */}
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#253256]">Fee Payments</h1>
            <p className="mt-1 text-sm text-[#65708a]">Fees / Payments</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleTopPrint}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#748098] transition hover:bg-[#e9ecf1]"
            aria-label="Print fee payment challan"
          >
            {/* <Printer className="h-4 w-4" /> */}
            <img src={printer} alt="Printer Icon"  />
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg bg-[#dce1eb] px-4 py-2 text-sm font-semibold text-[#475372] transition hover:bg-[#ced5e4]"
          >
            {/* <Download className="h-4 w-4" /> */}
            <img src={fileExport} alt ="File Export Icon"/>
            Export
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4 xl:justify-items-center">
        {statsCards.map((card) => (
          <article
            key={card.title}
            className={`w-full xl:max-w-[350px] rounded-2xl border-2 px-5 py-10 shadow-[0_2px_8px_rgba(15,23,42,0.04)] ${card.panelClass}`}
          >
            <h2 className="text-2xl font-semibold leading-none text-[#111827]">{card.title}</h2>
            <p className={`mt-6 text-4xl font-semibold leading-none ${card.valueClass}`}>{card.value}</p>
            <p className="mt-6 text-lg font-medium leading-none text-[#5f6268]">{card.subtitle}</p>
          </article>
        ))}
      </section>

      <section className=" shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d9dde7] px-5 py-4">
          <h2 className="text-2xl font-bold text-[#263355]">Fee Records</h2>

          <div className="flex flex-wrap items-center gap-2">
            <label className="relative">
              <select
                value={selectedSession}
                onChange={(event) => {
                  setSelectedSession(event.target.value)
                  setPage(1)
                }}
                className="h-10 min-w-[140px] appearance-none rounded-lg border-2 border-gray-300 bg-white px-3 pr-9 text-sm font-medium text-[#55637f] outline-none transition focus:border-primary-400"
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
                className="h-10 min-w-[140px] appearance-none rounded-lg border-2 border-gray-300 bg-white px-3 pr-9 text-sm font-medium text-[#55637f] outline-none transition focus:border-primary-400"
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

           <div className="border-2 border-gray-300 rounded-lg p-1">
             <label className="relative">
              <select
                value={selectedClass}
                onChange={(event) => {
                  setSelectedClass(event.target.value)
                  setPage(1)
                }}
                className="h-8 min-w-[190px] appearance-none rounded-lg border border-[#d4d8e3] bg-gray-100 px-3 pr-9 text-sm font-medium text-[#55637f] outline-none transition focus:border-primary-400"
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

          <label className="relative min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value)
                setPage(1)
              }}
              placeholder="Search"
              className="h-10 w-full rounded-lg border border-[#d4d8e3] bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary-400"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#e6e9ef]">
              <tr>
                <th className="w-12 px-4 py-3 text-left">
                  <input type="checkbox" className="h-4 w-4 rounded border-[#d5dbe7]" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Roll No.</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">S.Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Paid</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Pending</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Due Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Fine After Due</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Status</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-[#273355]">
                  <span className="inline-flex items-center gap-3">
                    Action
                    {/* <MoreVertical className="h-4 w-4 text-[#67748f]" /> */}
                    <img src={dotsVertical} alt="More Actions Icon" />
                  </span>
                </th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-sm text-slate-500">
                    No fee payments found.
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-[#e3e7ef] hover:bg-[#fafbfe]">
                    <td className="px-4 py-4">
                      <input type="checkbox" className="h-4 w-4 rounded border-[#d5dbe7]" />
                    </td>
                    <td className="px-4 py-4 text-sm text-[#4c5877]">{payment.rollNo}</td>
                    <td className="px-4 py-4 text-sm text-[#4c5877]">{payment.studentName}</td>
                    <td className="px-4 py-4 text-sm text-[#4c5877]">
                      {formatCompactAmount(payment.amount)}
                    </td>
                    <td className="px-4 py-4 text-sm text-[#4c5877]">
                      {formatCompactAmount(payment.paidAmount)}
                    </td>
                    <td className="px-4 py-4 text-sm text-[#4c5877]">
                      {formatCompactAmount(payment.pendingAmount)}
                    </td>
                    <td className="px-4 py-4 text-sm text-[#4c5877]">{payment.dueDate}</td>
                    <td className="px-4 py-4 text-sm text-[#4c5877]">{payment.fineAfterDue}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-3 py-1 text-xs font-semibold ${
                          payment.status === 'Paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-rose-100 text-rose-600'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            payment.status === 'Paid' ? 'bg-green-500' : 'bg-rose-500'
                          }`}
                        />
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => openChallan(payment)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#d5dbe7] bg-white text-[#5d6883] transition hover:bg-slate-50"
                          aria-label={`Print challan for ${payment.studentName}`}
                        >
                          {/* <Printer className="h-4 w-4" /> */}
                          <img src={printer} alt="" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePayment(payment.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#d5dbe7] bg-white text-[#5d6883] transition hover:bg-slate-50"
                          aria-label={`Delete payment for ${payment.studentName}`}
                        >
                          {/* <Trash2 className="h-4 w-4" /> */}
                          <img src={Trash} alt="Delete Icon" className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(payment.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#d5dbe7] bg-white text-[#5d6883] transition hover:bg-slate-50"
                          aria-label={`Edit payment for ${payment.studentName}`}
                        >
                          {/* <Pencil className="h-4 w-4" /> */}
                          <img src ={edit} alt="" className="w-4 h-4" />
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

          <button
            type="button"
            onClick={handleAddStudent}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            <PlusCircle className="h-4 w-4" />
            Add Student
          </button>
        </div>
      </section>

      <FeeChallanModal isOpen={isChallanOpen} onClose={closeChallan} record={challanRecord} />
    </div>
  )
}

export default FeePayments
