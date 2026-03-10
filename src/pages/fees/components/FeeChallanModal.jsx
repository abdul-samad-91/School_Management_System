import { BookOpen, X } from 'lucide-react'

const DESCRIPTIONS = [
  'Registration Fee',
  'Market Fee',
  'Late Fee',
  'Security',
  'Rent',
  'Other Dues',
  'Arrears',
]

const sanitizeAmount = (amount) => {
  if (!amount) return '-'
  const value = String(amount).replace(/[^0-9]/g, '')
  if (!value) return String(amount)
  return `${value}/-`
}

const ChallanCopy = ({ label, record }) => {
  const mainAmount = sanitizeAmount(record?.amount)
  const rows = DESCRIPTIONS.map((description, index) => ({
    description,
    amount: index === 0 ? mainAmount : '',
  }))

  return (
    <article className="rounded border border-[#858b96] bg-white p-2 text-[11px] text-[#111827]">
      <header className="space-y-0.5 border-b border-[#6b7280] pb-1 text-center">
        <div className="flex items-center justify-center gap-1">
          <BookOpen className="h-3.5 w-3.5" />
          <p className="text-[10px] font-semibold">BOP G.C. UNIVERSITY BRANCH (ONLY)</p>
        </div>
        <p className="text-[10px] font-semibold">CHALLAN FORM M-01 FOR</p>
        <p className="text-[10px] font-semibold">SCHOOL MANAGEMENT SYSTEM</p>
      </header>

      <div className="space-y-1 pt-1.5">
        <p className="border-b border-[#9ca3af] pb-0.5">
          Account Title: <span className="font-medium">School Management Fee Account</span>
        </p>
        <p className="flex items-end gap-2 border-b border-[#9ca3af] pb-0.5">
          <span>Account No.</span>
          <span className="font-medium">65800068357000018</span>
          <span className="ml-auto">Date: {record?.dueDate || '-'}</span>
        </p>
        <p className="border-b border-[#9ca3af] pb-0.5">Name: {record?.studentName || '-'}</p>
        <p className="border-b border-[#9ca3af] pb-0.5">S/O: {record?.guardianName || '-'}</p>
        <p className="border-b border-[#9ca3af] pb-0.5">CNIC: {record?.cnic || '-'}</p>
        <p className="border-b border-[#9ca3af] pb-0.5">Firm / Company: School Management System</p>
        <p className="border-b border-[#9ca3af] pb-0.5">Name of Market: Campus Fees</p>
      </div>

      <table className="mt-1.5 w-full border border-[#6b7280] text-[11px]">
        <thead>
          <tr className="border-b border-[#6b7280]">
            <th className="border-r border-[#6b7280] px-1 py-0.5 text-left font-semibold">
              Description
            </th>
            <th className="px-1 py-0.5 text-left font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.description} className="border-b border-[#d1d5db] last:border-b-0">
              <td className="border-r border-[#d1d5db] px-1 py-0.5">{row.description}</td>
              <td className="px-1 py-0.5">{row.amount}</td>
            </tr>
          ))}
          <tr>
            <td className="border-r border-[#6b7280] px-1 py-0.5 font-semibold">Total</td>
            <td className="px-1 py-0.5 font-semibold">{mainAmount}</td>
          </tr>
        </tbody>
      </table>

      <p className="mt-1 border-b border-[#9ca3af] pb-2">Amount in words: ____________________________</p>

      <div className="mt-10 flex items-end justify-between text-[11px] font-semibold">
        <span>{label}</span>
        <span>Depositor&apos;s Signature</span>
      </div>
    </article>
  )
}

const FeeChallanModal = ({ isOpen, onClose, record }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-6">
      <div className="w-full max-w-[1200px] rounded-xl border border-[#d7dbe6] bg-[#f6f7fb] shadow-[0_10px_30px_rgba(15,23,42,0.25)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d7dbe6] px-4 py-3">
          <h3 className="text-lg font-semibold text-[#253256]">Fee Challan Preview</h3>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              Print Challan
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d4d8e3] bg-white text-[#55637f] transition hover:bg-slate-50"
              aria-label="Close challan preview"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-4">
          <div className="grid gap-3 md:grid-cols-3">
            <ChallanCopy label="Bank Copy" record={record} />
            <ChallanCopy label="Market Committee Copy" record={record} />
            <ChallanCopy label="Depositor Copy" record={record} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeeChallanModal
