import React from 'react'
import { Search } from 'lucide-react'
import SortingArrow from '@/assets/SortingArrow.svg'
import fileExport2 from '@/assets/fileExport2.svg'
import printer from '@/assets/printer.svg'
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
    label: 'T.Teachers',
    value: 13,
    percent: 'In class',
    className: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  },
]

const teachers = [
  {
    id: 'T-0001',
    teacherNo: '0001',
    idNo: 'AD9892433',
    name: 'Javeria',
    avatar: 'J',
  },
  {
    id: 'T-0002',
    teacherNo: '0002',
    idNo: 'AD9892434',
    name: 'Jamil',
    avatar: 'J',
  },
  {
    id: 'T-0003',
    teacherNo: '0003',
    idNo: 'AD9892435',
    name: 'Kareena',
    avatar: 'K',
  },
  {
    id: 'T-0004',
    teacherNo: '0004',
    idNo: 'AD9892436',
    name: 'Ali',
    avatar: 'A',
  },
  {
    id: 'T-0005',
    teacherNo: '0005',
    idNo: 'AD9892437',
    name: 'Laila',
    avatar: 'L',
  },
  {
    id: 'T-0006',
    teacherNo: '0006',
    idNo: 'AD9892438',
    name: 'Rehan',
    avatar: 'R',
  },
  {
    id: 'T-0007',
    teacherNo: '0007',
    idNo: 'AD9892439',
    name: 'Ania',
    avatar: 'A',
  },
  {
    id: 'T-0008',
    teacherNo: '0008',
    idNo: 'AD9892440',
    name: 'Ryan',
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

const TeacherAttendance = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
          <p className="text-sm text-gray-600">Mark Attendance / Teachers</p>
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
          <CardTitle className="text-xl ">Teacher Attendance List</CardTitle>
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
                      T. No
                      <img src={SortingArrow} alt="Sort" className="h-3.5 w-3.5" />
                    </span>
                  </TableHead>
                  <TableHead className="text-gray-700 whitespace-nowrap">
                    <span className="inline-flex items-center gap-2">
                      ID No
                      <img src={SortingArrow} alt="Sort" className="h-3.5 w-3.5" />
                    </span>
                  </TableHead>
                  <TableHead className="text-gray-700">Name</TableHead>
                  <TableHead className="text-gray-700">Attendance</TableHead>
                  <TableHead className="text-gray-700">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher, index) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <input type="checkbox" aria-label={`Select ${teacher.name}`} />
                    </TableCell>
                    <TableCell className="text-blue-600">
                      {teacher.teacherNo}
                    </TableCell>
                    <TableCell className="text-blue-600">{teacher.idNo}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-700">
                          {teacher.avatar}
                        </span>
                        <span>{teacher.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 ">
                        {attendanceOptions.map((option) => (
                          <label
                            key={`${teacher.id}-${option}`}
                            className="flex items-center gap-1 text-xs border-r px-1 border-gray-500  text-gray-600 "
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

export default TeacherAttendance