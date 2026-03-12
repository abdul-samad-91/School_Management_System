import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MoreVertical,
  FileDown,
  Filter,
  PlusCircle,
  Printer,
  Search,
  ArrowDownUp,
  Plus
} from 'lucide-react'
import { toast } from 'sonner'
import dotsVertical from '@/assets/dotsVertical.svg'
import fileExport2 from '@/assets/fileExport2.svg'
import printer from '@/assets/printer.svg'
import SortVector from '@/assets/SortVector.svg'

const TEACHERS_STORAGE_KEY = 'sms_teachers'

const INITIAL_TEACHERS = [
  {
    id: '0001',
    name: 'Tania',
    classLabel: 'III A',
    email: 'tania.physics@school.edu.pk',
    phone: '+92 300 1112233',
    subject: 'Physics',
    initials: 'TA',
    avatarTone: 'bg-[#1f355f]',
    status: 'Active',
    gender: 'Female',
    dob: '2005-05-18',
    address: 'Peshawar, Pakistan',
    documents: ['CV', 'Cover letter', 'Degrees'],
    performance: [],
  },
  {
    id: '0002',
    name: 'Danial',
    classLabel: 'II (A)',
    email: 'danial.cs@academy.com',
    phone: '+92 301 2223344',
    subject: 'Computer',
    initials: 'DA',
    avatarTone: 'bg-[#704132]',
    status: 'Active',
    gender: 'Male',
    dob: '2004-10-12',
    address: 'Lahore, Pakistan',
    documents: ['CV', 'Degrees'],
    performance: [],
  },
  {
    id: '0003',
    name: 'Hania',
    classLabel: 'VI (A)',
    email: 'hania.english@schoolmail.pk',
    phone: '+92 302 3334455',
    subject: 'English',
    initials: 'HA',
    avatarTone: 'bg-[#7b5b45]',
    status: 'Active',
    gender: 'Female',
    dob: '2006-02-03',
    address: 'Islamabad, Pakistan',
    documents: ['CV', 'Cover letter'],
    performance: [],
  },
  {
    id: '0004',
    name: 'Ahsan',
    classLabel: 'VI (B) , V (A)',
    email: 'ahsan.urdu@eduportal.pk',
    phone: '+92 303 4445566',
    subject: 'Urdu',
    initials: 'AH',
    avatarTone: 'bg-[#41516f]',
    status: 'Active',
    gender: 'Male',
    dob: '2003-08-28',
    address: 'Karachi, Pakistan',
    documents: ['CV', 'Cover letter', 'Degrees'],
    performance: [],
  },
  {
    id: '0005',
    name: 'Momina',
    classLabel: 'VIII',
    email: 'momina.science@brightfuture.pk',
    phone: '+92 304 5556677',
    subject: 'Science',
    initials: 'MO',
    avatarTone: 'bg-[#5e4435]',
    status: 'Active',
    gender: 'Female',
    dob: '2005-11-21',
    address: 'Quetta, Pakistan',
    documents: ['CV'],
    performance: [],
  },
  {
    id: '0006',
    name: 'Ahmad',
    classLabel: 'I (A)',
    email: 'ahmad.chem@labschool.pk',
    phone: '+92 305 6667788',
    subject: 'Chemistry',
    initials: 'AM',
    avatarTone: 'bg-[#263446]',
    status: 'Active',
    gender: 'Male',
    dob: '2004-03-06',
    address: 'Multan, Pakistan',
    documents: ['CV', 'Degrees'],
    performance: [],
  },
  {
    id: '0007',
    name: 'Fariya',
    classLabel: 'IV',
    email: 'fariya.maths@educare.pk',
    phone: '+92 306 7778899',
    subject: 'Maths',
    initials: 'FA',
    avatarTone: 'bg-[#294964]',
    status: 'Active',
    gender: 'Female',
    dob: '2006-01-14',
    address: 'Rawalpindi, Pakistan',
    documents: ['CV', 'Cover letter'],
    performance: [],
  },
  {
    id: '0008',
    name: 'Zeeshan',
    classLabel: 'IX',
    email: 'zeeshan.bio@scholars.edu',
    phone: '+92 307 8889900',
    subject: 'Biology',
    initials: 'ZE',
    avatarTone: 'bg-[#3d2b68]',
    status: 'Active',
    gender: 'Male',
    dob: '2003-12-09',
    address: 'Faisalabad, Pakistan',
    documents: ['CV', 'Degrees'],
    performance: [],
  },
]
const subjectStyles = {
  Physics: 'bg-rose-100 text-rose-600',
  Computer: 'bg-rose-100 text-rose-600',
  English: 'bg-rose-100 text-rose-600',
  Urdu: 'bg-rose-100 text-rose-600',
  Science: 'bg-rose-100 text-rose-600',
  Chemistry: 'bg-rose-100 text-rose-600',
  Maths: 'bg-rose-100 text-rose-600',
  Biology: 'bg-rose-100 text-rose-600',
}

const Teachers = () => {
  const [teachers, setTeachers] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_TEACHERS
    try {
      const stored = window.localStorage.getItem(TEACHERS_STORAGE_KEY)
      return stored ? JSON.parse(stored) : INITIAL_TEACHERS
    } catch (error) {
      return INITIAL_TEACHERS
    }
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('az')
  const [filterSubject, setFilterSubject] = useState('')
  const [filterClass, setFilterClass] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeMenuId, setActiveMenuId] = useState(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editValues, setEditValues] = useState(null)

  useEffect(() => {
    try {
      window.localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(teachers))
    } catch (error) {
      // ignore storage failures
    }
  }, [teachers])

  const subjectOptions = useMemo(
    () => Array.from(new Set(teachers.map((teacher) => teacher.subject).filter(Boolean))),
    [teachers]
  )
  const classOptions = useMemo(
    () => Array.from(new Set(teachers.map((teacher) => teacher.classLabel).filter(Boolean))),
    [teachers]
  )

  const filteredTeachers = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase()
    const filtered = teachers.filter((teacher) => {
      if (filterSubject && teacher.subject !== filterSubject) return false
      if (filterClass && teacher.classLabel !== filterClass) return false
      if (!normalizedTerm) return true
      return (
        teacher.name.toLowerCase().includes(normalizedTerm) ||
        teacher.email.toLowerCase().includes(normalizedTerm) ||
        teacher.subject.toLowerCase().includes(normalizedTerm) ||
        teacher.classLabel.toLowerCase().includes(normalizedTerm) ||
        teacher.phone.toLowerCase().includes(normalizedTerm)
      )
    })

    return filtered.sort((current, next) => {
      if (sortOrder === 'za') {
        return next.name.localeCompare(current.name)
      }
      return current.name.localeCompare(next.name)
    })
  }, [filterClass, filterSubject, searchTerm, sortOrder, teachers])

  const handleSortToggle = () => {
    setSortOrder((previous) => (previous === 'az' ? 'za' : 'az'))
  }

  const handleClearFilters = () => {
    setFilterSubject('')
    setFilterClass('')
  }

  const handlePrintList = (list) => {
    const printWindow = window.open('', '_blank', 'width=900,height=650')
    if (!printWindow) {
      toast.error('Please allow pop-ups to print the teachers list.')
      return
    }

    const rowsHtml = list
      .map(
        (teacher) => `
          <tr>
            <td>${teacher.id}</td>
            <td>${teacher.name}</td>
            <td>${teacher.subject}</td>
            <td>${teacher.classLabel}</td>
            <td>${teacher.email}</td>
            <td>${teacher.phone}</td>
          </tr>`
      )
      .join('')

    printWindow.document.write(`
      <html>
        <head>
          <title>Teachers</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
            th { background: #f8fafc; }
          </style>
        </head>
        <body>
          <h2>Teachers List</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Subject</th>
                <th>Class</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  const handleExport = (list) => {
    if (!list.length) {
      toast.info('No teacher records to export.')
      return
    }

    const header = ['ID', 'Name', 'Subject', 'Class', 'Email', 'Phone']
    const rows = list.map((teacher) => [
      teacher.id,
      teacher.name,
      teacher.subject,
      teacher.classLabel,
      teacher.email,
      teacher.phone,
    ])
    const csvContent = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'teachers.csv'
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Teachers list exported.')
  }

  const handleOpenEdit = (teacher) => {
    setEditValues({ ...teacher })
    setIsEditOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editValues?.name?.trim()) {
      toast.error('Teacher name is required.')
      return
    }

    setTeachers((prev) =>
      prev.map((teacher) => (teacher.id === editValues.id ? { ...teacher, ...editValues } : teacher))
    )
    setIsEditOpen(false)
    toast.success('Teacher updated successfully.')
  }

  const handleDeleteTeacher = (id) => {
    setTeachers((prev) => prev.filter((teacher) => teacher.id !== id))
    toast.success('Teacher removed successfully.')
  }

  return (
    <div className="h-full space-y-4 overflow-y-auto pr-1 ">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-[#253256]">Teachers</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handlePrintList(filteredTeachers)}
            className="inline-flex h-9 w-9 items-center justify-center text-[#55637f] transition hover:bg-slate-50"
            aria-label="Print teachers"
          >
            <img src={printer} alt="Printer Logo" />
            {/* <Printer className="h-4 w-4" /> */}
          </button>
          <button
            type="button"
            onClick={() => handleExport(filteredTeachers)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#dce1eb] px-4 py-2 text-sm font-semibold text-[#475372] transition hover:bg-[#ced5e4]"
          >
            {/* <FileDown className="h-4 w-4" /> */}
            <img src={fileExport2} alt="Export" className="h-4 w-4" /> 
            Export
          </button>
          <Link
            to="/teachers/add"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            <Plus  className="text-primary-500 bg-white rounded w-3 h-3"/>
            {/* <PlusCircle className="h-4 w-4" /> */}
            Add Teacher
          </Link>
        </div>
      </div>

      <section className="rounded-2xl border border-[#d9dde7] bg-[#f2f3f5] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-[#263355]">Teachers Grid</h2>
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search"
                className="h-10 w-full rounded-lg border border-[#d4d8e3] bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary-400"
              />
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsFilterOpen((prev) => !prev)}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#d4d8e3] bg-white px-4 text-sm font-medium text-[#55637f] transition hover:bg-slate-50"
              >
                <Filter className="h-4 w-4" />
                Filter
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 z-20 mt-2 w-60 rounded-xl border border-[#d4d8e3] bg-white p-3 shadow-lg">
                  <label className="block text-xs font-semibold text-[#6b7280]">Subject</label>
                  <select
                    value={filterSubject}
                    onChange={(event) => setFilterSubject(event.target.value)}
                    className="mt-1 h-9 w-full rounded-md border border-[#d4d8e3] bg-white px-2 text-sm text-[#4c5877] outline-none"
                  >
                    <option value="">All Subjects</option>
                    {subjectOptions.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>

                  <label className="mt-3 block text-xs font-semibold text-[#6b7280]">Class</label>
                  <select
                    value={filterClass}
                    onChange={(event) => setFilterClass(event.target.value)}
                    className="mt-1 h-9 w-full rounded-md border border-[#d4d8e3] bg-white px-2 text-sm text-[#4c5877] outline-none"
                  >
                    <option value="">All Classes</option>
                    {classOptions.map((classLabel) => (
                      <option key={classLabel} value={classLabel}>
                        {classLabel}
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
              onClick={handleSortToggle}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#d4d8e3] bg-white px-4 text-sm font-medium text-[#55637f] transition hover:bg-slate-50"
            >
              {/* <ArrowDownUp className="h-4 w-4" /> */}
              <img src ={SortVector}   alt="sorting icon" className ="w-4 h-4"/>
              Sort by {sortOrder === 'az' ? 'A-Z' : 'Z-A'}
            </button>
          </div>
        </div>

        <div className="my-4 h-px bg-[#d9dde7]" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
          {filteredTeachers.map((teacher) => (
            <article
              key={teacher.id}
              className="overflow-hidden rounded shadow-lg bg-white"
            >
              <header className="relative flex items-center justify-between border-b border-[#e6e9ef] px-5 py-3">
                <p className="text-base font-medium text-primary-600">ID.{teacher.id}</p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-green-100 px-2 py-1 text-sm font-semibold text-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    {teacher.status || 'Active'}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveMenuId((prev) => (prev === teacher.id ? null : teacher.id))
                    }
                    className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100"
                    aria-label={`More actions for ${teacher.name}`}
                  >
                    {/* <MoreVertical className="h-4 w-4" /> */}
                    <img src={dotsVertical} alt="Vertical Dots " />
                  </button>
                  {activeMenuId === teacher.id && (
                    <div className="absolute right-4 top-12 z-10 w-40 rounded-lg border border-[#d4d8e3] bg-white py-1 shadow-lg">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenuId(null)
                          handleOpenEdit(teacher)
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 text-sm text-[#4c5877] hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenuId(null)
                          handlePrintList([teacher])
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 text-sm text-[#4c5877] hover:bg-slate-50"
                      >
                        Print
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenuId(null)
                          handleDeleteTeacher(teacher.id)
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </header>

              <div className="space-y-4 px-5 py-4">
                <div className="flex items-center gap-3 rounded-xl bg-[#f1f3f7] px-4 py-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${teacher.avatarTone}`}
                  >
                    {teacher.initials}
                  </div>
                  <div>
                    <p className="text-base font-semibold leading-none text-[#263355]">{teacher.name}</p>
                    <p className="mt-1 text-base text-[#5a6780]">{teacher.classLabel}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-[#727d93]">Email</p>
                  <p className="text-base  text-[#2e3b59]">{teacher.email}</p>
                </div>
                <div>
                  <p className="text-sm text-[#727d93]">Phone</p>
                  <p className="text-base  text-[#2e3b59]">{teacher.phone}</p>
                </div>
              </div>

              <footer className="flex items-center justify-between border-t border-[#e6e9ef] bg-[#fbfbfc] px-5 py-3">
                <span
                  className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${
                    subjectStyles[teacher.subject] || 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {teacher.subject}
                </span>
                <Link
                  to={`/teachers/${teacher.id}`}
                  className="inline-flex rounded-lg bg-[#e4e8f0] px-4 py-2 text-sm font-semibold text-[#4d5b79] transition hover:bg-[#d9dfeb]"
                >
                  View Details
                </Link>
              </footer>
            </article>
          ))}
        </div>
      </section>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-10 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-[#d9dde7] bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-[#253256]">Edit Teacher</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-sm font-semibold text-[#111827]">Name</span>
                <input
                  value={editValues?.name ?? ''}
                  onChange={(event) =>
                    setEditValues((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className="h-10 w-full rounded-lg border border-[#d4d8e3] bg-white px-3 text-sm text-[#111827]"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm font-semibold text-[#111827]">Subject</span>
                <input
                  value={editValues?.subject ?? ''}
                  onChange={(event) =>
                    setEditValues((prev) => ({ ...prev, subject: event.target.value }))
                  }
                  className="h-10 w-full rounded-lg border border-[#d4d8e3] bg-white px-3 text-sm text-[#111827]"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm font-semibold text-[#111827]">Class</span>
                <input
                  value={editValues?.classLabel ?? ''}
                  onChange={(event) =>
                    setEditValues((prev) => ({ ...prev, classLabel: event.target.value }))
                  }
                  className="h-10 w-full rounded-lg border border-[#d4d8e3] bg-white px-3 text-sm text-[#111827]"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm font-semibold text-[#111827]">Email</span>
                <input
                  value={editValues?.email ?? ''}
                  onChange={(event) =>
                    setEditValues((prev) => ({ ...prev, email: event.target.value }))
                  }
                  className="h-10 w-full rounded-lg border border-[#d4d8e3] bg-white px-3 text-sm text-[#111827]"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm font-semibold text-[#111827]">Phone</span>
                <input
                  value={editValues?.phone ?? ''}
                  onChange={(event) =>
                    setEditValues((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  className="h-10 w-full rounded-lg border border-[#d4d8e3] bg-white px-3 text-sm text-[#111827]"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm font-semibold text-[#111827]">Address</span>
                <input
                  value={editValues?.address ?? ''}
                  onChange={(event) =>
                    setEditValues((prev) => ({ ...prev, address: event.target.value }))
                  }
                  className="h-10 w-full rounded-lg border border-[#d4d8e3] bg-white px-3 text-sm text-[#111827]"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="rounded-lg border border-[#d4d8e3] px-4 py-2 text-sm font-semibold text-[#4c5877] hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
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

export default Teachers
