import React from 'react'
import { Search } from 'lucide-react'
import SortingArrow from '../../Assets/SortingArrow.svg'
import fileExport2 from '../../Assets/fileExport2.svg'
import printer from '../../Assets/printer.svg'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'

const stats = [
  {
    label: 'Present',
    value: 7,
    percent: '50% of class',
    className: 'bg-blue-50 border-blue-200 text-blue-700',
  },
  {
    label: 'Absent',
    value: 2,
    percent: '20% of class',
    className: 'bg-green-50 border-green-200 text-green-700',
  },
  {
    label: 'Leave',
    value: 3,
    percent: '30% of class',
    className: 'bg-rose-50 border-rose-200 text-rose-700',
  },
  {
    label: 'T.Students',
    value: 13,
    percent: 'In class',
    className: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  },
]

const students = [
  {
    admissionNo: 'AD9892434',
    rollNo: '001',
    name: 'Javeria',
    className: 'III',
    section: 'A',
    avatar: 'J',
  },
  {
    admissionNo: 'AD9892433',
    rollNo: '002',
    name: 'Jamil',
    className: 'IV',
    section: 'B',
    avatar: 'J',
  },
  {
    admissionNo: 'AD9892432',
    rollNo: '003',
    name: 'Kareena',
    className: 'II',
    section: 'A',
    avatar: 'K',
  },
  {
    admissionNo: 'AD9892431',
    rollNo: '004',
    name: 'Ali',
    className: 'I',
    section: 'B',
    avatar: 'A',
  },
  {
    admissionNo: 'AD9892430',
    rollNo: '005',
    name: 'Laila',
    className: 'II',
    section: 'B',
    avatar: 'L',
  },
  {
    admissionNo: 'AD9892429',
    rollNo: '006',
    name: 'Rehan',
    className: 'III',
    section: 'B',
    avatar: 'R',
  },
  {
    admissionNo: 'AD9892428',
    rollNo: '007',
    name: 'Ania',
    className: 'V',
    section: 'A',
    avatar: 'A',
  },
  {
    admissionNo: 'AD9892427',
    rollNo: '008',
    name: 'Ryan',
    className: 'VI',
    section: 'A',
    avatar: 'R',
  },
]

const classOptions = [
  { value: 'i', label: 'Class I' },
  { value: 'ii', label: 'Class II' },
  { value: 'iii', label: 'Class III' },
  { value: 'iv', label: 'Class IV' },
  { value: 'v', label: 'Class V' },
  { value: 'vi', label: 'Class VI' },
]

const attendanceOptions = ['Present', 'Late', 'Absent', 'Leave', 'Holiday']

const StudentAttendance = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
          <p className="text-sm text-gray-600">Mark Attendance / Students</p>
        </div>
       <div className="flex items-center gap-3">
         <img src={printer} alt="" className='w-4 h-4'/>
        <Button variant="outline" className="gap-2 bg-[#E9EDF4] rounded border-none" >
          
        <img src={fileExport2} alt="Export" className="h-4 w-4" />  Export
        </Button> 
       </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className={stat.className}  >
            <CardContent className="py-4 flex flex-col items-start gap-2">
              <p className="text-2xl font-medium text-gray-700">{stat.label}</p>
              <p className="mt-1 text-2xl font-semibold text-current">{stat.value}</p>
              <p className="mt-1 text-xl text-gray-500">{stat.percent}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl ">Student Attendance List</CardTitle>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input type="date" className="min-w-[160px]" />
            <Select
              options={classOptions}
              placeholder="Select Class"
              className="min-w-[160px] "
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className='whitespace-nowrap'>Row Per Page</span>
              <Select
                options={[
                  { value: '10', label: '10' },
                  { value: '20', label: '20' },
                  { value: '50', label: '50' },
                ]}
                placeholder="10"
                className="w-[70px]"
              />
              <span>Entries</span>
            </div>
            <div className="w-full sm:w-[240px]">
              <Input placeholder="Search" leftIcon={<Search className="h-4 w-4" />} />
            </div>
          </div>

          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 ">
                  <TableHead>
                    <input type="checkbox" aria-label="Select all" />
                  </TableHead>
                  <TableHead className="text-gray-700 whitespace-nowrap">
                    <span className="inline-flex items-center gap-2">
                      Admission No
                      <img src={SortingArrow} alt="Sort" className="h-3.5 w-3.5" />
                    </span>
                  </TableHead>
                  <TableHead className="text-gray-700 whitespace-nowrap">
                    <span className="inline-flex items-center gap-2">
                      Roll No
                      <img src={SortingArrow} alt="Sort" className="h-3.5 w-3.5" />
                    </span>
                  </TableHead>
                  <TableHead className="text-gray-700">Name</TableHead>
                  <TableHead className="text-gray-700">Class</TableHead>
                  <TableHead className="text-gray-700">Section</TableHead>
                  <TableHead className="text-gray-700">Attendance</TableHead>
                  <TableHead className="text-gray-700">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow key={student.admissionNo}>
                    <TableCell>
                      <input type="checkbox" aria-label={`Select ${student.name}`} />
                    </TableCell>
                    <TableCell className="text-blue-600">
                      {student.admissionNo}
                    </TableCell>
                    <TableCell>{student.rollNo}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-700">
                          {student.avatar}
                        </span>
                        <span>{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{student.className}</TableCell>
                    <TableCell>{student.section}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 ">
                        {attendanceOptions.map((option) => (
                          <label
                            key={`${student.admissionNo}-${option}`}
                            className="flex items-center gap-1 text-xs text-gray-600 "
                          >
                            <input
                              type="radio"
                              name={`attendance-${index}`}
                              value={option.toLowerCase()}
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input  className="min-w-[140px]" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end text-sm text-gray-600">
            <span>Pre</span>
            <div className="flex items-center gap-2">
              <button className="h-6 w-6 rounded  text-xs  bg-primary-500 text-white">
                1
              </button>
              <span>2</span>
              <span>...</span>
              <span>20</span>
            </div>
            <span className="text-blue-600">Next</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StudentAttendance