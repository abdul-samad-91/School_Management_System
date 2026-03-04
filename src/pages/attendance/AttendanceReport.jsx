import React, { useState } from 'react'
import { Calendar, Download, Filter, Search } from 'lucide-react'
import fileExport2 from '@/assets/fileExport2.svg'
import printer from '@/assets/printer.svg'
import checks from '@/assets/checks.svg'
import clockX from '@/assets/clockX.svg'
import clockup from '@/assets/clockup.svg'
import x from '@/assets/x.svg'
  import SortingArrow from '@/assets/SortingArrow.svg'
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

const tabs = ['Attendance Report', 'Daily Attendance', 'Teacher/Staff Report']

const statusLegend = [
  { label: 'Present', dot: 'bg-green-500',icon:checks, pill: 'bg-green-50' },
  { label: 'Absent', dot: 'bg-red-500',icon:x, pill: 'bg-red-50 ' },
  { label: 'Late', dot: 'bg-blue-500',icon:clockup, pill: 'bg-blue-50' },
  { label: 'Holiday', dot: 'bg-sky-500',icon:clockX, pill: 'bg-sky-50' },
]

const classOptions = [
  { value: 'i', label: 'Class I' },
  { value: 'ii', label: 'Class II' },
  { value: 'iii', label: 'Class III' },
  { value: 'iv', label: 'Class IV' },
  { value: 'v', label: 'Class V' },
  { value: 'vi', label: 'Class VI' },
]

const dateColumns = Array.from({ length: 21 }, (_, i) => {
  const day = String(i + 1).padStart(2, '0')
  const dows = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  return { day, dow: dows[i % 7] }
})

const students = [
  {
    name: 'Javeria',
    avatar: 'J',
    percent: 100,
    stats: { p: 24, l: 0, a: 0, h: 6, f: 0 },
    attendance: Array(21).fill('present'),

  },
  {
    name: 'Ali',
    avatar: 'A',
    percent: 45,
    stats: { p: 16, l: 2, a: 6, h: 0, f: 0 },
    attendance: Array.from({ length: 21 }, (_, i) => (i % 5 === 0 ? 'absent' : 'present')),
  },
  {
    name: 'Laila',
    avatar: 'L',
    percent: 100,
    stats: { p: 24, l: 2, a: 1, h: 0, f: 0 },
    attendance: Array(21).fill('present'),
  },
  {
    name: 'Rehan',
    avatar: 'R',
    percent: 95,
    stats: { p: 21, l: 2, a: 1, h: 0, f: 0 },
    attendance: Array.from({ length: 21 }, (_, i) => (i === 6 ? 'late' : 'present')),
  },
  {
    name: 'Amna',
    avatar: 'A',
    percent: 99,
    stats: { p: 22, l: 0, a: 4, h: 0, f: 0 },
    attendance: Array.from({ length: 21 }, (_, i) => (i === 9 ? 'absent' : 'present')),
  },
  {
    name: 'Ryan',
    avatar: 'R',
    percent: 98,
    stats: { p: 23, l: 0, a: 2, h: 0, f: 0 },
    attendance: Array.from({ length: 21 }, (_, i) => (i === 12 ? 'absent' : 'present')),
  },
  {
    name: 'Sadia',
    avatar: 'S',
    percent: 32,
    stats: { p: 20, l: 3, a: 1, h: 6, f: 0 },
    attendance: Array.from({ length: 21 }, (_, i) => (i % 4 === 0 ? 'holiday' : 'present')),
  },
  {
    name: 'Sana',
    avatar: 'S',
    percent: 50,
    stats: { p: 20, l: 3, a: 1, h: 6, f: 0 },
    attendance: Array.from({ length: 21 }, (_, i) => (i % 4 === 0 ? 'holiday' : 'present')),
  },
]

const dailyAttendance = [
  { className: 'III', section: 'A', present: 69, absent: 2, presentPct: 98, absentPct: 2 },
  { className: 'IV', section: 'A', present: 45, absent: 7, presentPct: 78, absentPct: 22 },
  { className: 'II', section: 'B', present: 69, absent: 8, presentPct: 89, absentPct: 11 },
  { className: 'I', section: 'C', present: 54, absent: 7, presentPct: 99, absentPct: 1 },
  { className: 'II', section: 'A', present: 65, absent: 1, presentPct: 98, absentPct: 2 },
  { className: 'III', section: 'B', present: 78, absent: 2, presentPct: 72, absentPct: 28 },
  { className: 'V', section: 'C', present: 65, absent: 0, presentPct: 100, absentPct: 0 },
  { className: 'VI', section: 'A', present: 45, absent: 2, presentPct: 99, absentPct: 11 },
  { className: 'VIII', section: 'B', present: 47, absent: 2, presentPct: 98, absentPct: 2 },
]

const getDotClass = (status) => {
  // if (status === 'present') return 'bg-green-500'
  // if (status === 'absent') return 'bg-red-500'
  // if (status === 'late') return 'bg-blue-500'
  // if (status === 'holiday') return 'bg-sky-500'
  return 'bg-green-500'
}

const getPercentClass = (percent) => {
  if (percent > 90) return 'bg-green-600 text-white'
  if (percent >= 50 && percent <= 90) return 'bg-blue-500 text-white'
  return 'bg-red-500 text-white'
}

const getDailyPercentClass = (percent) => {
  if (percent >= 90) return 'bg-[#E8F9E8] text-gray-700'
  if (percent >= 75) return 'bg-[#FEFCE8] text-gray-700 '
  return 'bg-red-100 text-red-700'
}

const iconColor ={
  present: 'bg-green-500',
  absent: 'bg-red-500',
  late: 'bg-blue-700',
  holiday: 'bg-sky-500',
}

const AttendanceReport = () => {
  const [activeTab, setActiveTab] = useState(tabs[0])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Report</h1>
          <p className="text-sm text-gray-500">Attendance / <span className='text-gray-800'>Attendance Report</span></p>
        </div>
         <div className="flex items-center gap-3">
                 <img src={printer} alt="" className='w-4 h-4'/>
                <Button variant="secondary" className="gap-2 bg-[#E9EDF4] rounded border-none" >
                <img src={fileExport2} alt="Export" className="h-4 w-4" />  Export
                </Button> 
               </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 border-b border-gray-200 text-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={
              activeTab === tab
                ? 'border-b-2 border-primary-500 pb-3 font-medium text-primary-600'
                : 'pb-3 text-gray-600 hover:text-gray-900'
            }
            type="button"
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Daily Attendance' ? (
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-xl font-bold">Daily Attendance List</CardTitle>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                placeholder="15 May 2020 - 24 May 2020"
                rightIcon={<Calendar className="h-4 w-4" />}
                className="min-w-[200px]"
              />
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="whitespace-nowrap">Row Per Page</span>
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
              <div className="w-full sm:w-[220px]">
                <Input placeholder="Search" leftIcon={<Search className="h-4 w-4" />} />
              </div>
            </div>

            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead>Class</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Total Present</TableHead>
                    <TableHead>Total Absent</TableHead>
                    <TableHead>
                      <span className="inline-flex items-center gap-2">
                        Present %
                        <img src={SortingArrow} alt="" className="h-4 w-4" />
                      </span>
                    </TableHead>
                    <TableHead>
                      <span className="inline-flex items-center gap-2">
                        Absent %
                        <img src={SortingArrow} alt="" className="h-4 w-4" />
                      </span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyAttendance.map((row) => (
                    <TableRow key={`${row.className}-${row.section}`}>
                      <TableCell>{row.className}</TableCell>
                      <TableCell>{row.section}</TableCell>
                      <TableCell>{row.present} </TableCell>
                      <TableCell>{row.absent}</TableCell>
                      <TableCell>
                        <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${getDailyPercentClass(row.presentPct)}`}>
                          {row.presentPct}%  
                        

                        </span>
                      </TableCell>
                      <TableCell>{row.absentPct}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end text-sm text-gray-600">
              <span>Pre</span>
              <div className="flex items-center gap-2">
                <button className="h-6 w-6 rounded bg-primary-500 text-xs text-white">1</button>
                <span>2</span>
                <span>...</span>
                <span>20</span>
              </div>
              <span className="text-blue-600">Next</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-xl font-bold">Attendance Report List</CardTitle>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                placeholder="15 May 2020 - 24 May 2020"
                rightIcon={<Calendar className="h-4 w-4" />}
                className="min-w-[200px]"
              />
              <Select
                options={classOptions}
                placeholder="Select Class"
                className="min-w-[160px]"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="whitespace-nowrap">Row Per Page</span>
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

              <div className="flex flex-wrap items-center gap-2">
                {statusLegend.map((item) => (
                  <span
                    key={item.label}
                    className={`inline-flex items-center gap-2 rounded border border-gray-300  px-3 py-2 text-xs font-medium ${item.pill}`}
                  >
                    <span className={`inline-flex gap-2 items-center rounded border p-1 ${iconColor[item.label.toLowerCase()]}`}>
                      <img src={item.icon} alt={item.label} className="h-3 w-3" />
                    </span>
                    {item.label}
                  </span>
                ))}
                <div className="w-full sm:w-[220px]">
                  <Input placeholder="Search" leftIcon={<Search className="h-4 w-4" />} />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="whitespace-nowrap text-base text-gray-800">Student / Date</TableHead>
                    <TableHead className="text-base text-gray-800">%</TableHead>
                    <TableHead className="text-base text-gray-800">P</TableHead>
                    <TableHead className="text-base text-gray-800">L</TableHead>
                    <TableHead className="text-base text-gray-800">A</TableHead>
                    <TableHead className="text-base text-gray-800">H</TableHead>
                    <TableHead className="text-base text-gray-800">F</TableHead>
                    {dateColumns.map((col) => (
                      <TableHead key={col.day} className="text-center text-gray-800 text-base">
                        <div className="flex flex-col items-center gap-1">
                          <span>{col.day}</span>
                          <span className="text-base text-gray-800">{col.dow}</span>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.name}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-700">
                            {student.avatar}
                          </span>
                          <span>{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${getPercentClass(student.percent)}`}>
                          {student.percent}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">{student.stats.p}</TableCell>
                      <TableCell className="text-gray-600">{student.stats.l}</TableCell>
                      <TableCell className="text-gray-600">{student.stats.a}</TableCell>
                      <TableCell className="text-gray-600">{student.stats.h}</TableCell>
                      <TableCell className="text-gray-600">{student.stats.f}</TableCell>
                      {student.attendance.map((status, index) => (
                        <TableCell key={`${student.name}-${index}`} className="text-center">
                          <span className={`mx-auto inline-flex h-4 w-2.5 rounded-full ${getDotClass(status)}`} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end text-sm text-gray-600">
              <span>Pre</span>
              <div className="flex items-center gap-2">
                <button className="h-6 w-6 rounded bg-primary-500 text-xs text-white">1</button>
                <span>2</span>
                <span>...</span>
                <span>20</span>
              </div>
              <span className="text-blue-600">Next</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AttendanceReport

