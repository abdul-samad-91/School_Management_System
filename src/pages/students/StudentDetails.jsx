import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import edit from '@/assets/edit.svg'
import Customer from '@/assets/Customer.svg'
import genderIcon from '@/assets/genderIcon.svg'
import pdfIcon from '@/assets/pdfIcon.svg'
import IconDown from '@/assets/IconDown.svg'
import Icon from '@/assets/Icon.svg'
import Calendar from '@/components/ui/Calendar'

import {
  ArrowLeft,
  CalendarDays,
  Edit2,
  FileText,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'

const performanceBars = [100, 32, 58, 90, 88, 60,100]
const performanceMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
const documents = [
  { id: 1, name: 'Form-B', type: 'Pdf' },
  { id: 2, name: 'B-Certificate', type: 'Pdf' },
  { id: 3, name: 'Medical ', type: 'Pdf' },
  { id: 4, name: 'Transfer ', type: 'Pdf' },
  { id: 5, name: 'Form-B', type: 'Pdf' },
  { id: 6, name: 'Form-B', type: 'Pdf' },
  { id: 7, name: 'Form-B', type: 'Pdf' },
]
const behaviorLogs = [
  { id: 1, date: '12-12-2025', note: 'Shows positive behavior in class' },
  { id: 2, date: '05-12-2025', note: 'Participates well in group work' },
  { id: 3, date: '28-11-2025', note: 'Helped classmates during activity' },
  { id: 4, date: '17-11-2025', note: 'Shows positive behavior in class' },
  { id: 5, date: '02-11-2025', note: 'Shows positive behavior in class' },
]
const yearOptions = Array.from({ length: 11 }, (_, index) => 2020 + index)

const StudentDetails = () => {
  const [selectedMonth, setSelectedMonth] = useState('Sep')
  const [selectedYear, setSelectedYear] = useState(2025)
  const location = useLocation()
  const student = location.state?.student
  const [studentData, setStudentData] = useState(() => ({
    name: student?.name || 'Student',
    admissionNumber: student?.admissionNumber || 'N/A',
    className: student?.className || '',
    section: student?.section || '',
    rollNo: student?.rollNo || 'N/A',
    gender: student?.gender || 'N/A',
    fatherName: student?.fatherName || 'N/A',
    status: student?.status || 'Unknown',
  }))
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false)
  const [editProfileValues, setEditProfileValues] = useState(null)

  const classLabel = studentData.className
    ? `${studentData.className}-${studentData.section || ''}`.trim()
    : 'N/A'

  const handleOpenProfileEdit = () => {
    setEditProfileValues({
      name: studentData.name,
      className: studentData.className,
      section: studentData.section,
      rollNo: studentData.rollNo,
      gender: studentData.gender,
      fatherName: studentData.fatherName,
      status: studentData.status,
    })
    setIsProfileEditOpen(true)
  }

  const handleSaveProfile = () => {
    if (!editProfileValues?.name?.trim()) {
      toast.error('Name is required.')
      return
    }
    setStudentData((prev) => ({
      ...prev,
      ...editProfileValues,
    }))
    setIsProfileEditOpen(false)
    toast.success('Student profile updated.')
  }

  const percent = 84
  const clampedPercent = Math.min(Math.max(percent, 0), 100)
  const degree = (clampedPercent / 100) * 180

  // Treat performanceBars as percentages (0-100)
  const barPercentages = performanceBars.map((value) => {
    const numericValue = Number(value)
    const safeValue = Number.isFinite(numericValue) ? numericValue : 0
    return Math.min(Math.max(safeValue, 0), 100)
  })

  return (
    <div className="space-y-6 ">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/students"
          className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
        >
          {/* <ArrowLeft className="h-4 w-4" /> */}
          <img src={Icon} alt="Back Icon" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Student Details</h1>
          <p className="text-sm text-gray-500">Students / Student Details</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_2fr_1.1fr]">
        <div className="space-y-6 bg-white w-[290px] aspect-[290/500] ">
          <Card className="border-none bg-transparent ">
            <CardContent className="p-5 ">
              <div className="flex items-start justify-center  relative">
                <div className="flex items-center gap-3 flex-col justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-500 border">
                    {/* <UserRound className="h-7 w-7" /> */}
                    <img src={Customer} alt="Customer" className="h-12 w-12" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 text-center mb-1">{studentData.name}</h2>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant="primary" className="bg-gray-200 rounded text-gray-900">Adm.{studentData.admissionNumber}</Badge>
                      <Badge variant="default" className="bg-gray-200 rounded text-gray-900">Class {classLabel}</Badge>
                      <Badge variant="success" className="bg-green-100 rounded ">{studentData.status}</Badge>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenProfileEdit}
                    className="rounded-md border border-gray-200 absolute  top-0 right-0 p-2 text-gray-500 hover:bg-gray-50 flex items-center justify-center h-8"
                  >
                    <img src={edit} alt="Edit" className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm text-gray-600  px-3 py-4 w-full rounded-lg bg-[#F8F8F8]">
                <div className="flex items-center justify-between ">
                  <div className="flex  items-center gap-2 text-gray-400 text-base">
                    {/* <UserRound className="h-4 w-4" /> */}
                    <img src={genderIcon} alt="Gender" className="h-5 w-5 text-gray-400" />
                    Gender
                  </div>
                  <span className="font-medium text-gray-900">{studentData.gender}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400 text-base">
                    <CalendarDays className="h-4 w-4" />
                    Date of Birth
                  </div>
                  <span className="font-medium text-gray-900">N/A</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400 text-base">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </div>
                  <span className="font-medium text-gray-900">N/a</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex  items-center gap-2 text-gray-400 text-base">
                    <MapPin className="h-4 w-4" />
                    Address
                  </div>
                  <span className="font-medium text-gray-900">N/A</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-transparent">
            <CardHeader className="border-none ">
              <CardTitle className="text-lg font-semibold ">Parent/Guardian Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-[#F8F8F8]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Father</span>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{studentData.fatherName}</p>
                  <p className="text-xs text-gray-500">N/A</p>
                </div>
              </div>
              <hr />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Mother</span>
                <div className="text-right">
                  <p className="font-medium text-gray-900">N/A</p>
                  <p className="text-xs text-gray-500">N/A</p>
                </div>
              </div>
              <hr />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Alternative Guardian</span>
                <div className="text-right">
                  <p className="font-medium text-gray-900">N/A</p>
                  <p className="text-xs text-gray-500">N/A</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-transparent p-2">
            <CardHeader className="border-none">
              <CardTitle className="text-base">Additional Info</CardTitle>
            </CardHeader>
            <CardContent className="bg-[#F8F8F8] rounded ">
              <p className="text-sm font-medium text-gray-900">Roll No</p>
              <p className="text-sm text-gray-500">{studentData.rollNo}</p>
            </CardContent>
          </Card>

          <Card className="border-none bg-transparent p-2">
            {/* <CardHeader className="border-none">
                <CardTitle className="text-base">Medical Info</CardTitle>
                </CardHeader> */}
            <CardContent className="bg-[#F8F8F8] rounded">
              <p className="text-sm font-medium text-gray-900">Running, Reading</p>
              <p className="text-sm text-gray-500">Mild Allergy</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 h-[385px]">
              <div className="flex  items-center justify-between ">
                <h3 className="text-lg font-semibold text-gray-900">Academic Performance</h3>
              <div className="relative inline-block ">
  <select className=" bg-primary-500 p-2 pl-5 pr-10 rounded text-white appearance-none cursor-pointer">
    <option>Last 7 Months</option>
    <option>Last 6 Months</option>
    <option>Last 5 Months</option>
    <option>Last 4 Months</option>
    <option>Last 3 Months</option>
    <option>Last 2 Months</option>
    <option>Last Month</option>
  </select>

  {/* Dropdown Icon */}
  <img
    src={IconDown}
    alt="Drop down icon"
    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
  />
</div>
              </div>

              <div className="mt-10 grid items-center gap-6 lg:grid-cols-[1.1fr_1.9fr]  ">
                <div className="rounded-2xl  p-4  ">
                  <div className="mx-auto w-32">
                    <div className="relative h-20 w-32 ">
                      <svg
                        viewBox="0 0 200 120"
                        className="h-20 w-32"
                        role="img"
                        aria-label={`Average score ${clampedPercent}%`}
                      >
                        <path
                          d="M 20 100 A 80 80 0 0 1 180 100"
                          fill="none"
                          stroke="#f1f5f9"
                          strokeWidth="16"
                          strokeLinecap="round"
                          pathLength="100"
                        />
                        <path
                          d="M 20 100 A 80 80 0 0 1 180 100"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="16"
                          strokeLinecap="round"
                          pathLength="100"
                          strokeDasharray="100"
                          strokeDashoffset={100 - clampedPercent}
                        />
                      </svg>

                      <div className="absolute inset-0 flex items-center justify-center mt-6">
                        <div className="text-center">
                          <p className="text-xl font-semibold text-gray-900">{clampedPercent}%</p>
                          <p className="text-xs text-gray-500">Average Score</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 rounded-lg w-full h-16  bg-gray-200  px-3 py-2 text-base text-gray-600">
                    She shows good performance
                  </div>
                </div>

                <div>
                  <div className="flex h-36 items-end gap-3 ">
                    {performanceBars.map((value, index) => (
                      <div key={performanceMonths[index]} className="flex-1 h-full flex flex-col justify-end">
                        <div
                          className={`w-full rounded-md  ${index === 3 ? 'bg-primary-600' : 'bg-indigo-200'
                            }`}
                          style={{ height: `${barPercentages[index]}%` }}
                        />
                        <p className="mt-2 text-center text-xs text-gray-500">
                          {performanceMonths[index]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
            <Card className="h-full  w-[350px] aspect-[350/500] ">
              <CardHeader className="border ">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Documents</CardTitle>
                  <button className="rounded-md  border-gray-200 p-1 text-gray-500 hover:bg-gray-50 flex items-center justify-center h-6 w-6 ml-10">
                    {/* <Edit2 className="h-4 w-4" /> */}
                    <img src={edit} alt="Edit" className="h-4 w-4 " />

                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 p-1  w-full bg-[#F8F8F8] ">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-lg  "
                  >
                    <div className="flex items-center gap-2 text-sm  px-2 py-1 rounded w-full border-b ">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EFF6FF] p-1 text-gray-500">
                        {/* <FileText className="h-4 w-4" /> */}
                        <img src={pdfIcon} alt="PDF Icon" className='w-6 h-6' />
                      </span>

                      <div >
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.type}</p>
                      </div>
                    </div>

                    {/* <button className="text-xs text-gray-500 hover:text-gray-700">
                        View
                      </button> */}

                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="h-full border-none ">
              <CardHeader className="border-none">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Behavior & Discipline Log</CardTitle>
                  <button className="rounded-md border border-gray-200 p-2 text-gray-500 hover:bg-gray-50">
                    {/* <Edit2 className="h-4 w-4" /> */}
                    <img src={edit} alt="Edit" className="h-4 w-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead></TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {behaviorLogs.map((log) => (
                      <TableRow key={log.id} >
                        <TableCell > <input type="checkbox" className="ml-2" /></TableCell>
                        <TableCell className="text-primary-600">{log.date}</TableCell>
                        <TableCell className="text-gray-600">{log.note}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <Calendar />
        </div>
      </div>
      {isProfileEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-10 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-[#d9dde7] bg-white py-6 px-8 shadow-xl">
            <h2 className="text-2xl font-bold text-[#253256]">Edit Student Profile</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-base font-semibold text-[#111827]">Name</span>
                <input
                  value={editProfileValues?.name ?? ''}
                  onChange={(event) =>
                    setEditProfileValues((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className="h-10 w-full rounded border-2 border-gray-300 bg-white px-3 text-sm text-[#111827]"
                />
              </label>
              <label className="space-y-1">
                <span className="text-base font-semibold text-[#111827]">Class</span>
                <input
                  value={editProfileValues?.className ?? ''}
                  onChange={(event) =>
                    setEditProfileValues((prev) => ({ ...prev, className: event.target.value }))
                  }
                  className="h-10 w-full rounded border-2 border-gray-300 bg-white px-3 text-sm text-[#111827]"
                />
              </label>
              <label className="space-y-1">
                <span className="text-base font-semibold text-[#111827]">Section</span>
                <input
                  value={editProfileValues?.section ?? ''}
                  onChange={(event) =>
                    setEditProfileValues((prev) => ({ ...prev, section: event.target.value }))
                  }
                  className="h-10 w-full rounded border-2 border-gray-300 bg-white px-3 text-sm text-[#111827]"
                />
              </label>
              <label className="space-y-1">
                <span className="text-base font-semibold text-[#111827]">Roll No</span>
                <input
                  value={editProfileValues?.rollNo ?? ''}
                  onChange={(event) =>
                    setEditProfileValues((prev) => ({ ...prev, rollNo: event.target.value }))
                  }
                  className="h-10 w-full rounded border-2 border-gray-300 bg-white px-3 text-sm text-[#111827]"
                />
              </label>
              <label className="space-y-1">
                <span className="text-base font-semibold text-[#111827]">Gender</span>
                <input
                  value={editProfileValues?.gender ?? ''}
                  onChange={(event) =>
                    setEditProfileValues((prev) => ({ ...prev, gender: event.target.value }))
                  }
                  className="h-10 w-full rounded border-2 border-gray-300 bg-white px-3 text-sm text-[#111827]"
                />
              </label>
              <label className="space-y-1">
                <span className="text-base font-semibold text-[#111827]">Father Name</span>
                <input
                  value={editProfileValues?.fatherName ?? ''}
                  onChange={(event) =>
                    setEditProfileValues((prev) => ({ ...prev, fatherName: event.target.value }))
                  }
                  className="h-10 w-full rounded border-2 border-gray-300 bg-white px-3 text-sm text-[#111827]"
                />
              </label>
              <label className="space-y-1">
                <span className="text-base font-semibold text-[#111827]">Status</span>
                <input
                  value={editProfileValues?.status ?? ''}
                  onChange={(event) =>
                    setEditProfileValues((prev) => ({ ...prev, status: event.target.value }))
                  }
                  className="h-10 w-full rounded border-2 border-gray-300 bg-white px-3 text-sm text-[#111827]"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsProfileEditOpen(false)}
                className="rounded border-2 border-gray-600 px-4 py-2 text-sm font-semibold text-[#4c5877] hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
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

export default StudentDetails