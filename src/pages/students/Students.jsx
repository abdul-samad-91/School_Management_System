import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Filter, Mail, MoreVertical, Phone, Plus, Search } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import SortVector from '@/assets/SortVector.svg'
import brandhiphat from '@/assets/brandhiphat.svg'
import loader3 from '@/assets/loader3.svg'
import dotsVertical from '@/assets/dotsVertical.svg'


const INITIAL_STUDENTS = [
  {
    id: '1',
    admissionNumber: '101',
    name: 'Ayesha',
    className: 'III',
    section: 'A',
    rollNo: '03',
    gender: 'Female',
    fatherName: 'Yousaf Ali',
    status: 'Active',
  },
  {
    id: '2',
    admissionNumber: '31',
    name: 'Junaid',
    className: 'IV',
    section: 'B',
    rollNo: '05',
    gender: 'Male',
    fatherName: 'Samad Khan',
    status: 'Active',
  },
  {
    id: '3',
    admissionNumber: '20',
    name: 'Kainat',
    className: 'III',
    section: 'A',
    rollNo: '10',
    gender: 'Female',
    fatherName: 'Ahmad Ali',
    status: 'Active',
  },
  {
    id: '4',
    admissionNumber: '40',
    name: 'Ghaffor',
    className: 'I',
    section: 'B',
    rollNo: '30',
    gender: 'Male',
    fatherName: 'Hashim ',
    status: 'Active',
  },
  {
    id: '5',
    admissionNumber: '111',
    name: 'Laila',
    className: 'II',
    section: 'B',
    rollNo: '18',
    gender: 'Female',
    fatherName: 'Talhaa Ahmad',
    status: 'Active',
  },
  {
    id: '6',
    admissionNumber: '200',
    name: 'Rehan',
    className: 'III',
    section: 'B',
    rollNo: '27',
    gender: 'Male',
    fatherName: 'Fareed Ali',
    status: 'Active',
  },
  {
    id: '7',
    admissionNumber: '245',
    name: 'Javeria',
    className: 'V',
    section: 'A',
    rollNo: '35007',
    gender: 'Female',
    fatherName: 'Nasir Butt',
    status: 'Active',
  },
  {
    id: '8',
    admissionNumber: '200',
    name: 'Raheel',
    className: 'VI',
    section: 'A',
    rollNo: '35006',
    gender: 'Male',
    fatherName: 'Javed Shah',
    status: 'Active',
  },
]

const Students = () => {
  const [students, setStudents] = useState(INITIAL_STUDENTS)
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState('az')
  const [activeMenuId, setActiveMenuId] = useState(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editValues, setEditValues] = useState(null)
  const filteredStudents = useMemo(() => {
    const needle = search.trim().toLowerCase()
    const filtered = needle
      ? students.filter((student) => {
          return (
            student.name.toLowerCase().includes(needle) ||
            student.admissionNumber.toLowerCase().includes(needle)
          )
        })
      : [...students]

    return filtered.sort((current, next) => {
      if (sortOrder === 'za') {
        return next.name.localeCompare(current.name)
      }
      return current.name.localeCompare(next.name)
    })
  }, [search, sortOrder])

  const handleSortToggle = () => {
    setSortOrder((previous) => (previous === 'az' ? 'za' : 'az'))
  }

  const handleOpenEdit = (student) => {
    setEditValues({ ...student })
    setIsEditOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editValues?.name?.trim()) {
      toast.error('Student name is required.')
      return
    }

    setStudents((prev) =>
      prev.map((student) => (student.id === editValues.id ? { ...student, ...editValues } : student))
    )
    setIsEditOpen(false)
    toast.success('Student updated successfully.')
  }

  const handleDeleteStudent = (id) => {
    setStudents((prev) => prev.filter((student) => student.id !== id))
    toast.success('Student removed successfully.')
  }

  const handlePrintList = (list) => {
    const printWindow = window.open('', '_blank', 'width=900,height=650')
    if (!printWindow) {
      toast.error('Please allow pop-ups to print the students list.')
      return
    }

    const rowsHtml = list
      .map(
        (student) => `
          <tr>
            <td>${student.id}</td>
            <td>${student.admissionNumber}</td>
            <td>${student.name}</td>
            <td>${student.className}</td>
            <td>${student.section}</td>
            <td>${student.rollNo}</td>
            <td>${student.gender}</td>
            <td>${student.fatherName}</td>
          </tr>`
      )
      .join('')

    printWindow.document.write(`
      <html>
        <head>
          <title>Students</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
            th { background: #f8fafc; }
          </style>
        </head>
        <body>
          <h2>Students List</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Admission No</th>
                <th>Name</th>
                <th>Class</th>
                <th>Section</th>
                <th>Roll No</th>
                <th>Gender</th>
                <th>Father Name</th>
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
      toast.info('No student records to export.')
      return
    }

    const header = [
      'ID',
      'Admission Number',
      'Name',
      'Class',
      'Section',
      'Roll No',
      'Gender',
      'Father Name',
      'Status',
    ]
    const rows = list.map((student) => [
      student.id,
      student.admissionNumber,
      student.name,
      student.className,
      student.section,
      student.rollNo,
      student.gender,
      student.fatherName,
      student.status,
    ])
    const csvContent = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'students.csv'
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Students list exported.')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="gap-2" onClick={() => handleExport(filteredStudents)}>
            Export
          </Button>
          <Link to="/students/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Student
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 ">
        <p className="text-xl font-medium text-gray-900">Students Grid</p>
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-44">
            <Input
              placeholder="Search"
              leftIcon={<Search className="h-4 w-4" />}
              className="h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm text-gray-600 hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm text-gray-600 hover:bg-gray-50"
            onClick={handleSortToggle}
            type="button"
          >
            {/* <SortAsc className="h-4 w-4" /> */}
            <img src={SortVector} alt="" />
            Sort By {sortOrder === 'az' ? 'A-Z' : 'Z-A'}
          </button>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {filteredStudents.map((student) => {
          const initials = student.name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0].toUpperCase())
            .join('')

          return (
            <Card key={student.id} className="border border-gray-100 shadow-sm">
              <CardContent className="p-4">
                <div className="relative flex items-center justify-between">
                  <span className="text-xs text-primary-600">Adm.{student.admissionNumber}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="success"  className="flex items-center gap-1 border-none rounded py-1 px-3"><span className="w-1 h-1 bg-green-400 rounded-full inline-block"></span>{student.status}</Badge>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveMenuId((prev) => (prev === student.id ? null : student.id))
                      }
                      className="text-gray-400 hover:text-gray-600"
                      aria-label={`More actions for ${student.name}`}
                    >
                      {/* <MoreVertical className="h-4 w-4" /> */}
                      <img src={dotsVertical} alt="" className='w-4 h-4' />
                    </button>
                    {activeMenuId === student.id && (
                      <div className="absolute right-0 top-8 z-10 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null)
                            handleOpenEdit(student)
                          }}
                          className="flex w-full items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null)
                            handlePrintList([student])
                          }}
                          className="flex w-full items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Print
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null)
                            handleDeleteStudent(student.id)
                          }}
                          className="flex w-full items-center justify-between px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-gray-700 shadow-sm">
                    {initials || 'ST'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-500">
                      {student.className}, {student.section}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-gray-500 ">
                  <div>
                    <p className="text-[11px] uppercase text-gray-900">Roll No</p>
                    <p className="text-sm text-gray-900">{student.rollNo}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase text-gray-900">Gender</p>
                    <p className="text-sm text-gray-900">{student.gender}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase text-gray-900">Father Name</p>
                    <p className="text-sm text-gray-900">{student.fatherName}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t " >
                  <div className="flex items-center gap-2 mt-4 ">
                    <button className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50">
                      {/* <Search className="h-4 w-4" /> */}
                      <img src={brandhiphat} alt="" className='w-5 h-5' />
                    </button>
                    <button className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50">
                      <Mail className="h-5 w-5" />
                    </button>
                  </div>
                 
                   <Link
                     to={`/students/${student.id}`}
                     state={{ student }}
                     className="rounded-md mt-4 bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
                   >
                     View Details
                   </Link>
                 </div>
               
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex justify-center">
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white">
            <img src={loader3} alt="" className='w-4 h-4' /> Load More
        </button>
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4 py-10">
          <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900">Edit Student</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-sm font-semibold text-gray-700">Name</span>
                <input
                  value={editValues?.name ?? ''}
                  onChange={(event) =>
                    setEditValues((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className="h-10 w-full rounded border border-gray-300 bg-white px-3 text-sm text-gray-900"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm font-semibold text-gray-700">Admission No</span>
                <input
                  value={editValues?.admissionNumber ?? ''}
                  onChange={(event) =>
                    setEditValues((prev) => ({ ...prev, admissionNumber: event.target.value }))
                  }
                  className="h-10 w-full rounded border border-gray-300 bg-white px-3 text-sm text-gray-900"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm font-semibold text-gray-700">Class</span>
                <input
                  value={editValues?.className ?? ''}
                  onChange={(event) =>
                    setEditValues((prev) => ({ ...prev, className: event.target.value }))
                  }
                  className="h-10 w-full rounded border border-gray-300 bg-white px-3 text-sm text-gray-900"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm font-semibold text-gray-700">Section</span>
                <input
                  value={editValues?.section ?? ''}
                  onChange={(event) =>
                    setEditValues((prev) => ({ ...prev, section: event.target.value }))
                  }
                  className="h-10 w-full rounded border border-gray-300 bg-white px-3 text-sm text-gray-900"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm font-semibold text-gray-700">Roll No</span>
                <input
                  value={editValues?.rollNo ?? ''}
                  onChange={(event) =>
                    setEditValues((prev) => ({ ...prev, rollNo: event.target.value }))
                  }
                  className="h-10 w-full rounded border border-gray-300 bg-white px-3 text-sm text-gray-900"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm font-semibold text-gray-700">Gender</span>
                <input
                  value={editValues?.gender ?? ''}
                  onChange={(event) =>
                    setEditValues((prev) => ({ ...prev, gender: event.target.value }))
                  }
                  className="h-10 w-full rounded border border-gray-300 bg-white px-3 text-sm text-gray-900"
                />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-sm font-semibold text-gray-700">Father Name</span>
                <input
                  value={editValues?.fatherName ?? ''}
                  onChange={(event) =>
                    setEditValues((prev) => ({ ...prev, fatherName: event.target.value }))
                  }
                  className="h-10 w-full rounded border border-gray-300 bg-white px-3 text-sm text-gray-900"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="rounded bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
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

export default Students

