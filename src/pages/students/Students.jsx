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


const students = [
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
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState('az')
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
                <div className="flex items-center justify-between">
                  <span className="text-xs text-primary-600">Adm.{student.admissionNumber}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="success"  className="flex items-center gap-1 border-none rounded py-1 px-3"><span className="w-1 h-1 bg-green-400 rounded-full inline-block"></span>{student.status}</Badge>
                    <button className="text-gray-400 hover:text-gray-600">
                      {/* <MoreVertical className="h-4 w-4" /> */}
                      <img src={dotsVertical} alt="" className='w-4 h-4' />
                    </button>
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
    </div>
  )
}

export default Students

