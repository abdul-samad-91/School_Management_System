import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownUp,
  BookOpen,
  Download,
  Filter,
  Pencil,
  PlusCircle,
  Search,
  Trash2,
  X,
} from 'lucide-react'

const INITIAL_CLASSES = [
  { id: 'C138038', name: 'I', section: 'A', students: 30, subjects: 3, status: 'Active' },
  { id: 'C138039', name: 'II', section: 'A', students: 31, subjects: 4, status: 'Active' },
  { id: 'C138040', name: 'III', section: 'B', students: 29, subjects: 4, status: 'Active' },
  { id: 'C138041', name: 'IV', section: 'A', students: 28, subjects: 5, status: 'Active' },
  { id: 'C138042', name: 'V', section: 'B', students: 30, subjects: 5, status: 'Active' },
  { id: 'C138043', name: 'VI', section: 'A', students: 32, subjects: 6, status: 'Active' },
  { id: 'C138044', name: 'VII', section: 'A', students: 30, subjects: 6, status: 'Active' },
  { id: 'C138045', name: 'VIII', section: 'B', students: 27, subjects: 7, status: 'Active' },
  { id: 'C138046', name: 'IX', section: 'A', students: 26, subjects: 7, status: 'Active' },
  { id: 'C138047', name: 'X', section: 'A', students: 25, subjects: 8, status: 'Active' },
]

const ROWS_PER_PAGE = 10

const createEmptyForm = () => ({
  id: '',
  name: '',
  section: '',
  students: '',
  subjects: '',
})

const Classes = () => {
  const [classes, setClasses] = useState(INITIAL_CLASSES)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('az')
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [isEditEnabled, setIsEditEnabled] = useState(true)
  const [formData, setFormData] = useState(createEmptyForm())
  const [formError, setFormError] = useState('')

  const filteredClasses = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const filtered = classes.filter((classItem) => {
      if (!normalizedSearch) return true
      return (
        classItem.id.toLowerCase().includes(normalizedSearch) ||
        classItem.name.toLowerCase().includes(normalizedSearch) ||
        classItem.section.toLowerCase().includes(normalizedSearch)
      )
    })

    return filtered.sort((first, second) => {
      if (sortOrder === 'za') {
        return second.name.localeCompare(first.name, undefined, { numeric: true })
      }
      return first.name.localeCompare(second.name, undefined, { numeric: true })
    })
  }, [classes, searchTerm, sortOrder])

  const totalPages = Math.max(1, Math.ceil(filteredClasses.length / ROWS_PER_PAGE))

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const paginatedClasses = useMemo(() => {
    const startIndex = (page - 1) * ROWS_PER_PAGE
    return filteredClasses.slice(startIndex, startIndex + ROWS_PER_PAGE)
  }, [filteredClasses, page])

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

  const openAddClassModal = () => {
    setModalMode('add')
    setIsEditEnabled(true)
    setFormData({
      ...createEmptyForm(),
      id: `C${Math.floor(100000 + Math.random() * 900000)}`,
    })
    setFormError('')
    setIsModalOpen(true)
  }

  const openClassDetailsModal = (classItem) => {
    setModalMode('details')
    setIsEditEnabled(false)
    setFormData({
      id: classItem.id,
      name: classItem.name,
      section: classItem.section,
      students: String(classItem.students),
      subjects: String(classItem.subjects),
    })
    setFormError('')
    setIsModalOpen(true)
  }

  const handleInputChange = (field, value) => {
    if (field === 'students' || field === 'subjects') {
      const numberOnlyValue = value.replace(/\D/g, '')
      setFormData((previous) => ({ ...previous, [field]: numberOnlyValue }))
      return
    }

    setFormData((previous) => ({ ...previous, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.id.trim() || !formData.name.trim() || !formData.section.trim()) {
      setFormError('Please fill ID, class and section.')
      return false
    }

    if (!formData.students || !formData.subjects) {
      setFormError('Please enter number of students and subjects.')
      return false
    }

    setFormError('')
    return true
  }

  const handleAddClass = () => {
    if (!validateForm()) return

    const newClass = {
      id: formData.id.trim().toUpperCase(),
      name: formData.name.trim(),
      section: formData.section.trim().toUpperCase(),
      students: Number(formData.students),
      subjects: Number(formData.subjects),
      status: 'Active',
    }

    setClasses((previous) => [newClass, ...previous])
    setPage(1)
    closeModal()
  }

  const handleSaveClass = () => {
    if (!isEditEnabled) return
    if (!validateForm()) return

    setClasses((previous) =>
      previous.map((classItem) =>
        classItem.id === formData.id
          ? {
              ...classItem,
              name: formData.name.trim(),
              section: formData.section.trim().toUpperCase(),
              students: Number(formData.students),
              subjects: Number(formData.subjects),
            }
          : classItem
      )
    )

    closeModal()
  }

  const handleDeleteClass = (id) => {
    setClasses((previous) => previous.filter((classItem) => classItem.id !== id))
  }

  const handleSortToggle = () => {
    setSortOrder((previous) => (previous === 'az' ? 'za' : 'az'))
  }

  const isReadOnly = modalMode === 'details' && !isEditEnabled
  const modalTitle = modalMode === 'add' ? 'Add New Class' : 'Class Details'

  return (
    <div className="h-full space-y-4 overflow-y-auto pr-1">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#253256]">Classes</h1>
          <p className="mt-1 text-sm text-[#65708a]">Academic / Classes</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-[#dce1eb] px-4 py-2 text-sm font-semibold text-[#475372] transition hover:bg-[#ced5e4]"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            type="button"
            onClick={openAddClassModal}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            <PlusCircle className="h-4 w-4" />
            Add Class
          </button>
        </div>
      </div>

      <section className="rounded-xl border border-[#d9dde7] bg-[#f2f3f5]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d9dde7] px-5 py-4">
          <h2 className="text-2xl font-bold text-[#263355]">Class List</h2>

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
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Class</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Section</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">No of Students</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">No of Subjects</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#273355]">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {paginatedClasses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-500">
                    No classes found.
                  </td>
                </tr>
              ) : (
                paginatedClasses.map((classItem) => (
                  <tr key={classItem.id} className="border-b border-[#e3e7ef] hover:bg-[#fafbfe]">
                    <td className="px-4 py-4">
                      <input type="checkbox" className="h-4 w-4 rounded border-[#d5dbe7]" />
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-primary-600">{classItem.id}</td>
                    <td className="px-4 py-4 text-sm text-[#4c5877]">{classItem.name}</td>
                    <td className="px-4 py-4 text-sm text-[#4c5877]">{classItem.section}</td>
                    <td className="px-4 py-4 text-sm text-[#4c5877]">{String(classItem.students).padStart(2, '0')}</td>
                    <td className="px-4 py-4 text-sm text-[#4c5877]">{String(classItem.subjects).padStart(2, '0')}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 rounded-md bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        {classItem.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteClass(classItem.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#d5dbe7] bg-white text-[#5d6883] transition hover:bg-slate-50"
                          aria-label={`Delete class ${classItem.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openClassDetailsModal(classItem)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#d5dbe7] bg-white text-[#5d6883] transition hover:bg-slate-50"
                          aria-label={`View class ${classItem.name}`}
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

        <div className="flex items-center justify-end gap-2 px-5 py-4 text-sm text-[#4c5877]">
          <button
            type="button"
            onClick={() => setPage((previous) => Math.max(1, previous - 1))}
            className="rounded-md px-2 py-1 transition hover:bg-[#e8ecf4]"
            disabled={page === 1}
          >
            Pre
          </button>
          <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-primary-600 px-2 text-white">
            {page}
          </span>
          <button
            type="button"
            onClick={() => setPage((previous) => Math.min(totalPages, previous + 1))}
            className="rounded-md px-2 py-1 transition hover:bg-[#e8ecf4]"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4 backdrop-blur-[2px]">
          <div className="relative w-full max-w-[590px] rounded-xl border-[3px] border-[#8e8f93] bg-[#efeff1] px-8 py-7 shadow-[0_8px_24px_rgba(15,23,42,0.25)]">
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
                <span className="text-base font-medium text-[#0f1524]">Class</span>
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
                <span className="text-base font-medium text-[#0f1524]">Section</span>
                <input
                  type="text"
                  value={formData.section}
                  onChange={(event) => handleInputChange('section', event.target.value)}
                  readOnly={isReadOnly}
                  className={`h-10 w-full rounded-xl border border-[#1f2937] px-3 text-sm text-[#0f1524] outline-none ${
                    isReadOnly ? 'cursor-default bg-[#e8e9eb]' : 'bg-white/80 focus:border-primary-500'
                  }`}
                />
              </label>

              <label className="space-y-1">
                <span className="text-base font-medium text-[#0f1524]">No. of Students</span>
                <input
                  type="text"
                  value={formData.students}
                  onChange={(event) => handleInputChange('students', event.target.value)}
                  readOnly={isReadOnly}
                  className={`h-10 w-full rounded-xl border border-[#1f2937] px-3 text-sm text-[#0f1524] outline-none ${
                    isReadOnly ? 'cursor-default bg-[#e8e9eb]' : 'bg-white/80 focus:border-primary-500'
                  }`}
                />
              </label>

              <label className="space-y-1 sm:col-span-2">
                <span className="text-base font-medium text-[#0f1524]">No. of Subjects</span>
                <input
                  type="text"
                  value={formData.subjects}
                  onChange={(event) => handleInputChange('subjects', event.target.value)}
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
                  onClick={handleAddClass}
                  className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
                >
                  Add Class
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
                    onClick={handleSaveClass}
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

export default Classes
