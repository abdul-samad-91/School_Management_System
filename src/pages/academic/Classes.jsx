import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  ArrowDownUp,
  BookOpen,
  Download,
  Filter,
  Pencil,
  PlusCircle,
  Search,
  Trash2,
  Plus
  ,
  X,
  // Trash,
} from 'lucide-react'
import Select from '@/components/ui/Select'
import fileExport from '@/assets/fileExport.svg'
import SortVector from '@/assets/SortVector.svg'
import filterIcon from '@/assets/filterIcon.svg'
import edit from '@/assets/edit.svg'
import Trash from '@/assets/Trash.svg'
import BookLogo1 from '@/assets/BookLogo1.png'
import { academicAPI } from '@/lib/api'




const CLASS_TEMPLATES = [
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

const INITIAL_CLASSES = Array.from({ length: 200 }, (_, index) => {
  const template = CLASS_TEMPLATES[index % CLASS_TEMPLATES.length]
  return {
    ...template,
    id: `C${String(138038 + index)}`,
  }
})

const ROWS_PER_PAGE = 10

const LEVEL_BY_CLASS_NAME = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
  V: 5,
  VI: 6,
  VII: 7,
  VIII: 8,
  IX: 9,
  X: 10,
  XI: 11,
  XII: 12,
}

const resolveClassLevel = (name = '') => {
  const trimmedName = String(name).trim()
  if (!trimmedName) return null

  const upperValue = trimmedName.toUpperCase()
  if (LEVEL_BY_CLASS_NAME[upperValue]) {
    return LEVEL_BY_CLASS_NAME[upperValue]
  }

  const numericLevel = Number.parseInt(trimmedName, 10)
  if (!Number.isNaN(numericLevel) && numericLevel > 0) {
    return numericLevel
  }

  return null
}

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
  const [isCreatingClass, setIsCreatingClass] = useState(false)

  const { data: sessionsRaw } = useQuery({
    queryKey: ['academic-sessions-for-classes-page'],
    queryFn: async () => {
      const response = await academicAPI.getSessions()
      return response.data?.data || []
    },
  })

  const activeSessionId = useMemo(() => {
    const sessions = Array.isArray(sessionsRaw) ? sessionsRaw : []
    return sessions.find((session) => session.isActive)?._id || sessions[0]?._id || null
  }, [sessionsRaw])

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

  const handleAddClass = async () => {
    if (!validateForm()) return

    if (!activeSessionId) {
      setFormError('No academic session found. Create or activate a session first.')
      return
    }

    const resolvedLevel = resolveClassLevel(formData.name)
    if (!resolvedLevel) {
      setFormError('Class must be a valid numeric or roman level (e.g., 1, 2, I, II, X).')
      return
    }

    if (isCreatingClass) return

    setIsCreatingClass(true)

    try {
      const payload = {
        name: formData.name.trim(),
        level: resolvedLevel,
        session: activeSessionId,
        sections: [
          {
            name: formData.section.trim().toUpperCase(),
            capacity: Number(formData.students) || 40,
          },
        ],
      }

      const response = await academicAPI.createClass(payload)
      const createdClass = response?.data?.data

      const createdSection = createdClass?.sections?.[0]
      const newClass = {
        id: createdClass?._id || formData.id.trim().toUpperCase(),
        name: createdClass?.name || formData.name.trim(),
        section: createdSection?.name || formData.section.trim().toUpperCase(),
        students: createdSection?.students?.length || Number(formData.students),
        subjects: Number(formData.subjects),
        status: createdClass?.isActive ? 'Active' : 'Inactive',
      }

      setClasses((previous) => [newClass, ...previous])
      setPage(1)
      toast.success('Class added successfully.')
      closeModal()
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to add class.'
      setFormError(message)
      toast.error(message)
    } finally {
      setIsCreatingClass(false)
    }
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
          <h1 className="text-3xl font-medium tracking-tight ">Classes</h1>
          <p className="mt-1 text-sm text-[#65708a]">Academic / Classes</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-[#dce1eb] px-4 py-2 text-sm font-semibold text-[#475372] transition hover:bg-[#ced5e4]"
          >
            {/* <Download className="h-4 w-4" /> */}
            <img src={fileExport} alt="Export Icon" />
            Export
          </button>
          <button
            type="button"
            onClick={openAddClassModal}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            <Plus  className="h-3 w-3 bg-white text-primary-500 rounded "/>
            {/* <PlusCircle className="h-4 w-4" /> */}
            Add Class
          </button>
        </div>
      </div>

      <section className=" bg-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d9dde7] px-5 py-4">
          <h2 className="text-xl font-medium text-[#263355]">Class List</h2>

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
              {/* <Filter className="h-4 w-4" /> */}
              <img src={filterIcon} alt="Filter icon" />
              Filter
            </button>

            <button
              type="button"
              onClick={handleSortToggle}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#d4d8e3] bg-white px-4 text-sm font-medium text-[#55637f] transition hover:bg-slate-50"
            >
              {/* <ArrowDownUp className="h-4 w-4" /> */}
              <img src ={SortVector} alt=""  />
              Sort By {sortOrder === 'az' ? 'A-Z' : 'Z-A'}
            </button>
          </div>
        </div>

        <div className="border-b border-[#d9dde7] px-5 py-3 text-sm text-[#55637f] flex items-center  gap-5">
          <span className="font-medium whitespace-nowrap">Row Per Page</span>{' '}
          {/* <span className="mx-1 rounded-md border border-[#d4d8e3] bg-white px-2 py-0.5">10</span> */}
 <select name="" id="" className='border rounded-lg  border-gray-300 px-4 '>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <span>Entries</span>  
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#e6e9ef]">
              <tr>
                <th className="w-12 px-4 py-3 text-left">
                  <input type="checkbox" className="h-4 w-4 rounded bg-gray-50  border border-gray-100" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold ">ID </th>
                <th className="px-4 py-3 text-left text-sm font-semibold ">Class</th>
                <th className="px-4 py-3 text-left text-sm font-semibold ">Section</th>
                <th className="px-4 py-3 text-left text-sm font-semibold ">No of Students</th>
                <th className="px-4 py-3 text-left text-sm font-semibold ">No of Subjects</th>
                <th className="px-4 py-3 text-left text-sm font-semibold ">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold ">Action</th>
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
                          {/* <Trash2 className="h-4 w-4" /> */}
                          <img src={Trash} alt="" className='w-4 h-4' />
                        </button>
                        <button
                          type="button"
                          onClick={() => openClassDetailsModal(classItem)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#d5dbe7] bg-white text-[#5d6883] transition hover:bg-slate-50"
                          aria-label={`View class ${classItem.name}`}
                        >
                          {/* <Pencil className="h-4 w-4" /> */}
                          <img src={edit} alt="" className='w-4 h-4' />
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
        <div className="fixed inset-0 z-50 top-[52px] flex items-center justify-center bg-white/20 px-4 backdrop-blur-[2px]">
          <div className="relative w-full max-w-[512px] rounded-xl border-[4px] border-gray-400 bg-white px-12 py-7 shadow-[0_8px_24px_rgba(15,23,42,0.25)]">
            {/* <button
              type="button"
              onClick={closeModal}
              className="absolute right-3 top-3 rounded-full p-1 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button> */}

             <div className="flex items-center justify-center gap-3 mt-4 ">
                          {/* <BookOpen className="h-12 w-12 text-[#0f1524]" /> */}
                          <img src={BookLogo1} alt="Book logo" className="w-16 h-14"/>
                          <p className="text-lg font-medium text-[#0f1524]">School Management <br /> System</p>
                        </div>

            <h3 className="mt-6 text-center text-3xl font-semibold text-[#0f1524] sm:text-3xl">{modalTitle}</h3>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-base font-medium text-[#0f1524]">ID</span>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(event) => handleInputChange('id', event.target.value)}
                  readOnly={modalMode === 'details'}
                  className={`h-10 w-full rounded-xl border-2 border-gray-700 bg-gray-100 px-3 text-sm text-[#0f1524] outline-none ${
                    modalMode === 'details'
                      ? 'cursor-default bg-[#e8e9eb]'
                      : ' focus:border-primary-500'
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
                  className={`h-10 w-full rounded-xl  border-2 border-gray-700 bg-gray-100 px-3 text-sm text-[#0f1524] outline-none ${
                    isReadOnly ? 'cursor-default bg-[#e8e9eb]' : ' focus:border-primary-500'
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
                  className={`h-10 w-full rounded-xl border-2 border-gray-700 bg-gray-100 px-3 text-sm text-[#0f1524] outline-none ${
                    isReadOnly ? 'cursor-default bg-[#e8e9eb]' : ' focus:border-primary-500'
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
                  className={`h-10 w-full rounded-xl border-2  border-gray-700 bg-gray-100 px-3 text-sm text-[#0f1524] outline-none ${
                    isReadOnly ? 'cursor-default bg-[#e8e9eb]' : ' focus:border-primary-500'
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
                  className={`h-10 w-full rounded-xl border-2 border-gray-700 bg-gray-100 px-3 text-sm text-[#0f1524] outline-none ${
                    isReadOnly ? 'cursor-default bg-[#e8e9eb]' : ' focus:border-primary-500'
                  }`}
                />
              </label>
            </div>

            {formError && <p className="mt-3 text-sm font-medium text-rose-600">{formError}</p>}

            <div className="mt-8 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="rounded border-2 border-gray-500 bg-white/70 px-6 py-2 text-sm font-semibold text-[#131a2a] transition hover:bg-white"
              >
                Cancel
              </button>

              {modalMode === 'add' ? (
                <button
                  type="button"
                  onClick={handleAddClass}
                  disabled={isCreatingClass}
                  className="rounded bg-primary-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
                >
                  {isCreatingClass ? 'Adding...' : 'Add Class'}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditEnabled(true)}
                    className="rounded border-2 border-gray-500 bg-white/70 px-6 py-2 text-sm font-semibold text-[#131a2a] transition hover:bg-white"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveClass}
                    className={`rounded px-6 py-2 text-sm font-semibold text-white transition ${
                      isEditEnabled
                        ? 'bg-primary-500 hover:bg-primary-600'
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
