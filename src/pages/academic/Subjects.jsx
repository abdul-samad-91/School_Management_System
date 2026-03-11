import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownUp,
  BookOpen,
  Download,
  Filter,
  Pencil,
  PlusCircle,
  Printer,
  Search,
  Trash2,
  X,
} from 'lucide-react'

const SUBJECT_TEMPLATES = [
  { id: 'SU128394', name: 'English', code: '101', type: 'Theory', status: 'Active' },
  { id: 'SU128393', name: 'Math', code: '102', type: 'Theory', status: 'Active' },
  { id: 'SU128392', name: 'Physics', code: '103', type: 'Practical', status: 'Active' },
  { id: 'SU128391', name: 'Chemistry', code: '104', type: 'Practical', status: 'Active' },
  { id: 'SU128390', name: 'Biology', code: '105', type: 'Practical', status: 'Active' },
  { id: 'SU128389', name: 'Urdu', code: '106', type: 'Theory', status: 'Active' },
  { id: 'SU128388', name: 'Higher Math', code: '107', type: 'Theory', status: 'Active' },
  { id: 'SU128387', name: 'Islamiyat', code: '108', type: 'Theory', status: 'Active' },
  { id: 'SU128386', name: 'Science', code: '109', type: 'Theory', status: 'Active' },
  { id: 'SU128385', name: 'Pakistan Studies', code: '110', type: 'Theory', status: 'Active' },
]

const INITIAL_SUBJECTS = Array.from({ length: 200 }, (_, index) => {
  const template = SUBJECT_TEMPLATES[index % SUBJECT_TEMPLATES.length]
  return {
    ...template,
    id: `SU${String(128394 - index)}`,
    code: String(101 + (index % 10)),
  }
})

const ROWS_PER_PAGE = 10

const createEmptyForm = () => ({
  id: '',
  name: '',
  type: '',
  code: '',
})

const Subjects = () => {
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('az')
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [isEditEnabled, setIsEditEnabled] = useState(true)
  const [formData, setFormData] = useState(createEmptyForm())
  const [formError, setFormError] = useState('')

  const filteredSubjects = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const filtered = subjects.filter((subject) => {
      if (!normalizedSearch) return true
      return (
        subject.id.toLowerCase().includes(normalizedSearch) ||
        subject.name.toLowerCase().includes(normalizedSearch) ||
        subject.code.toLowerCase().includes(normalizedSearch) ||
        subject.type.toLowerCase().includes(normalizedSearch)
      )
    })

    return filtered.sort((first, second) => {
      if (sortOrder === 'za') {
        return second.name.localeCompare(first.name, undefined, { numeric: true })
      }
      return first.name.localeCompare(second.name, undefined, { numeric: true })
    })
  }, [subjects, searchTerm, sortOrder])

  const totalPages = Math.max(1, Math.ceil(filteredSubjects.length / ROWS_PER_PAGE))

  const paginationItems = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    const items = [1]

    if (page > 3) {
      items.push('left-ellipsis')
    }

    const startPage = Math.max(2, page - 1)
    const endPage = Math.min(totalPages - 1, page + 1)

    for (let current = startPage; current <= endPage; current += 1) {
      items.push(current)
    }

    if (page < totalPages - 2) {
      items.push('right-ellipsis')
    }

    items.push(totalPages)
    return items
  }, [page, totalPages])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const paginatedSubjects = useMemo(() => {
    const startIndex = (page - 1) * ROWS_PER_PAGE
    return filteredSubjects.slice(startIndex, startIndex + ROWS_PER_PAGE)
  }, [filteredSubjects, page])

  const resetFormState = () => {
    setFormData(createEmptyForm())
    setFormError('')
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalMode('add')
    setIsEditEnabled(true)
    resetFormState()
  }

  const openAddSubjectModal = () => {
    setModalMode('add')
    setIsEditEnabled(true)
    setFormData({
      ...createEmptyForm(),
      id: `SU${Math.floor(100000 + Math.random() * 900000)}`,
    })
    setFormError('')
    setIsModalOpen(true)
  }

  const openSubjectDetailsModal = (subject) => {
    setModalMode('details')
    setIsEditEnabled(false)
    setFormData({
      id: subject.id,
      name: subject.name,
      type: subject.type,
      code: subject.code,
    })
    setFormError('')
    setIsModalOpen(true)
  }

  const handleInputChange = (field, value) => {
    if (field === 'code') {
      const numberOnlyValue = value.replace(/\D/g, '')
      setFormData((previous) => ({ ...previous, [field]: numberOnlyValue }))
      return
    }

    setFormData((previous) => ({ ...previous, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.name.trim() || !formData.type.trim() || !formData.id.trim() || !formData.code.trim()) {
      setFormError('Please fill all subject details.')
      return false
    }

    setFormError('')
    return true
  }

  const handleAddSubject = () => {
    if (!validateForm()) return

    const newSubject = {
      id: formData.id.trim().toUpperCase(),
      name: formData.name.trim(),
      code: formData.code.trim(),
      type: formData.type.trim(),
      status: 'Active',
    }

    setSubjects((previous) => [newSubject, ...previous])
    setPage(1)
    closeModal()
  }

  const handleSaveSubject = () => {
    if (!isEditEnabled) return
    if (!validateForm()) return

    setSubjects((previous) =>
      previous.map((subject) =>
        subject.id === formData.id
          ? {
              ...subject,
              name: formData.name.trim(),
              code: formData.code.trim(),
              type: formData.type.trim(),
            }
          : subject
      )
    )

    closeModal()
  }

  const handleDeleteSubject = (id) => {
    setSubjects((previous) => previous.filter((subject) => subject.id !== id))
  }

  const handleSortToggle = () => {
    setSortOrder((previous) => (previous === 'az' ? 'za' : 'az'))
  }

  const isReadOnly = modalMode === 'details' && !isEditEnabled
  const modalTitle = modalMode === 'add' ? 'Add New Subject' : 'Subject Details'

  return (
    <div className="h-full space-y-4 overflow-y-auto pr-1">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#253256]">Subject</h1>
          <p className="mt-1 text-sm text-[#65708a]">Academic / Subject</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d4d9e4] bg-white text-[#55637f] transition hover:bg-slate-50"
            aria-label="Print subjects"
          >
            <Printer className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-[#dce1eb] px-4 py-2 text-sm font-semibold text-[#475372] transition hover:bg-[#ced5e4]"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            type="button"
            onClick={openAddSubjectModal}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            <PlusCircle className="h-4 w-4" />
            Add Subject
          </button>
        </div>
      </div>

      <section className="rounded-xl border border-[#d9dde7] bg-[#f2f3f5]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d9dde7] px-5 py-4">
          <h2 className="text-2xl font-bold text-[#263355]">Subject List</h2>

          <div className="flex flex-wrap items-center gap-2">
            <label className="relative min-w-[230px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search"
                className="h-10 w-full rounded-lg border border-[#d4d8e3] bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary-400"
              />
            </label>

            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#d4d8e3] bg-white px-4 text-sm font-medium text-[#55637f] transition hover:bg-slate-50"
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>

            <button
              type="button"
              onClick={handleSortToggle}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#d4d8e3] bg-white px-4 text-sm font-medium text-[#55637f] transition hover:bg-slate-50"
            >
              <ArrowDownUp className="h-4 w-4" />
              Sort By {sortOrder === 'az' ? 'A-Z' : 'Z-A'}
            </button>
          </div>
        </div>

        <div className="border-b border-[#d9dde7] px-5 py-3 text-sm text-[#55637f]">
          <span className="font-medium">Row Per Page</span>{' '}
          <span className="mx-1 rounded-md border border-[#d4d8e3] bg-white px-2 py-0.5">10</span>
          Entries
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#e6e9ef]">
              <tr>
                <th className="w-12 px-4 py-3 text-left">
                  <input type="checkbox" className="h-4 w-4 rounded border-[#d5dbe7]" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Code</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {paginatedSubjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">
                    No subjects found.
                  </td>
                </tr>
              ) : (
                paginatedSubjects.map((subject) => (
                  <tr key={subject.id} className="border-b border-[#e3e7ef] hover:bg-[#fafbfe]">
                    <td className="px-4 py-4">
                      <input type="checkbox" className="h-4 w-4 rounded border-[#d5dbe7]" />
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-primary-600">{subject.id}</td>
                    <td className="px-4 py-4 text-sm text-[#4c5877]">{subject.name}</td>
                    <td className="px-4 py-4 text-sm text-[#4c5877]">{subject.code}</td>
                    <td className="px-4 py-4 text-sm text-[#4c5877]">{subject.type}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 rounded-md bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        {subject.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteSubject(subject.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#d5dbe7] bg-white text-[#5d6883] transition hover:bg-slate-50"
                          aria-label={`Delete subject ${subject.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openSubjectDetailsModal(subject)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#d5dbe7] bg-white text-[#5d6883] transition hover:bg-slate-50"
                          aria-label={`View subject ${subject.name}`}
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

            <h3 className="mt-4 text-center text-2xl font-bold text-[#0f1524] sm:text-3xl">{modalTitle}</h3>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-base font-medium text-[#0f1524]">Name</span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => handleInputChange('name', event.target.value)}
                  readOnly={isReadOnly}
                  className={`h-10 w-full rounded-xl border border-[#1f2937] px-3 text-sm text-[#0f1524] outline-none ${
                    isReadOnly ? 'cursor-default bg-[#e8e9eb]' : 'bg-white/80 focus:border-primary-500'
                  }`}
                />
              </label>

              <label className="space-y-1">
                <span className="text-base font-medium text-[#0f1524]">Type</span>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(event) => handleInputChange('type', event.target.value)}
                  readOnly={isReadOnly}
                  className={`h-10 w-full rounded-xl border border-[#1f2937] px-3 text-sm text-[#0f1524] outline-none ${
                    isReadOnly ? 'cursor-default bg-[#e8e9eb]' : 'bg-white/80 focus:border-primary-500'
                  }`}
                />
              </label>

              <label className="space-y-1">
                <span className="text-base font-medium text-[#0f1524]">ID</span>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(event) => handleInputChange('id', event.target.value)}
                  readOnly={modalMode === 'details'}
                  className={`h-10 w-full rounded-xl border border-[#1f2937] px-3 text-sm text-[#0f1524] outline-none ${
                    modalMode === 'details'
                      ? 'cursor-default bg-[#e8e9eb]'
                      : 'bg-white/80 focus:border-primary-500'
                  }`}
                />
              </label>

              <label className="space-y-1">
                <span className="text-base font-medium text-[#0f1524]">Code</span>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(event) => handleInputChange('code', event.target.value)}
                  readOnly={isReadOnly}
                  className={`h-10 w-full rounded-xl border border-[#1f2937] px-3 text-sm text-[#0f1524] outline-none ${
                    isReadOnly ? 'cursor-default bg-[#e8e9eb]' : 'bg-white/80 focus:border-primary-500'
                  }`}
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

              {modalMode === 'add' ? (
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
                >
                  Add Subject
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditEnabled(true)}
                    className="rounded-lg border border-[#1f2937] bg-white/70 px-6 py-2 text-sm font-semibold text-[#131a2a] transition hover:bg-white"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSubject}
                    className={`rounded-lg px-6 py-2 text-sm font-semibold text-white transition ${
                      isEditEnabled
                        ? 'bg-primary-600 hover:bg-primary-700'
                        : 'cursor-not-allowed bg-primary-300'
                    }`}
                  >
                    Save
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Subjects
