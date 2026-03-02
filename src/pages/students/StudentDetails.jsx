import { Link } from 'react-router-dom'
import edit from '../../Assets/edit.svg'
import Customer from '../../Assets/Customer.svg'
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
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

const performanceBars = [45, 32, 58, 74, 88, 60, 28]
const performanceMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
const documents = [
  { id: 1, name: 'Form-B', type: 'Pdf' },
  { id: 2, name: 'Birth Certificate', type: 'Pdf' },
  { id: 3, name: 'Medical Report', type: 'Pdf' },
  { id: 4, name: 'Transfer Letter', type: 'Pdf' },
  { id: 5, name: 'Form-B', type: 'Pdf' },
]
const behaviorLogs = [
  { id: 1, date: '12-12-2025', note: 'Shows positive behavior in class' },
  { id: 2, date: '05-12-2025', note: 'Participates well in group work' },
  { id: 3, date: '28-11-2025', note: 'Helped classmates during activity' },
  { id: 4, date: '17-11-2025', note: 'Shows positive behavior in class' },
  { id: 5, date: '02-11-2025', note: 'Shows positive behavior in class' },
]
const calendarDays = [
  '',
  '',
  '',
  '',
  '',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
]

const StudentDetails = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/students"
          className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Student Details</h1>
          <p className="text-sm text-gray-500">Students / Student Details</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_2fr_1.1fr]">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-col">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-500 border">
                    {/* <UserRound className="h-7 w-7" /> */}
                    <img src={Customer} alt="Customer" className="h-12 w-12" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 text-center mb-1">Amna Malik</h2>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant="primary">Adm.101</Badge>
                      <Badge variant="default">Class 9-A</Badge>
                      <Badge variant="success">Active</Badge>
                    </div>
                  </div>
                </div>
                <button className="rounded-md border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 flex items-center justify-center h-7">
                  {/* <Edit2 className="h-4 w-4" /> */}
                   <img src={edit} alt="Edit" className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500">
                    <UserRound className="h-4 w-4" />
                    Gender
                  </div>
                  <span className="font-medium text-gray-900">Female</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500">
                    <CalendarDays className="h-4 w-4" />
                    Date of Birth
                  </div>
                  <span className="font-medium text-gray-900">May 18, 2005</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </div>
                  <span className="font-medium text-gray-900">0268799646</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="h-4 w-4" />
                    Address
                  </div>
                  <span className="font-medium text-gray-900">Peshawar, Pakistan</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Parent/Guardian Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Father</span>
                <div className="text-right">
                  <p className="font-medium text-gray-900">Ali Ahmad</p>
                  <p className="text-xs text-gray-500">03639192490</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Mother</span>
                <div className="text-right">
                  <p className="font-medium text-gray-900">Kalsoom Bibi</p>
                  <p className="text-xs text-gray-500">03639192490</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Alternative Guardian</span>
                <div className="text-right">
                  <p className="font-medium text-gray-900">Ali Ahmad</p>
                  <p className="text-xs text-gray-500">03639192490</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Additional Info</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">Hobbies</p>
              <p className="text-sm font-medium text-gray-900">Running, Reading</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Medical Info</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">Mild Allergy</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-gray-900">Academic Performance</h3>
                <Button variant="secondary" size="sm">
                  Last 7 Months
                </Button>
              </div>

              <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_1.8fr]">
                <div className="space-y-3">
                  <div className="relative mx-auto h-28 w-28">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          'conic-gradient(#22c55e 0deg, #22c55e 302deg, #e5e7eb 302deg, #e5e7eb 360deg)',
                      }}
                    />
                    <div className="absolute inset-2 flex items-center justify-center rounded-full bg-white">
                      <div className="text-center">
                        <p className="text-2xl font-semibold text-gray-900">84%</p>
                        <p className="text-xs text-gray-500">Average Score</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                    She shows good performance
                  </div>
                </div>

                <div>
                  <div className="flex h-32 items-end gap-3">
                    {performanceBars.map((value, index) => (
                      <div key={performanceMonths[index]} className="flex-1">
                        <div
                          className={`w-full rounded-lg ${
                            index === 3 ? 'bg-primary-600' : 'bg-indigo-200'
                          }`}
                          style={{ height: `${value}%` }}
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
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Documents</CardTitle>
                  <button className="rounded-md border border-gray-200 p-2 text-gray-500 hover:bg-gray-50">
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                        <FileText className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.type}</p>
                      </div>
                    </div>
                    <button className="text-xs text-gray-500 hover:text-gray-700">
                      View
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Behavior & Discipline Log</CardTitle>
                  <button className="rounded-md border border-gray-200 p-2 text-gray-500 hover:bg-gray-50">
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {behaviorLogs.map((log) => (
                      <TableRow key={log.id}>
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

        <div className="space-y-6">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <button className="rounded-md border border-gray-200 p-2 text-gray-500 hover:bg-gray-50">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">Sep</p>
                  <p className="text-xs text-gray-500">2025</p>
                </div>
                <button className="rounded-md border border-gray-200 p-2 text-gray-500 hover:bg-gray-50">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs text-gray-400">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-7 gap-2 text-center text-xs">
                {calendarDays.map((day, index) => {
                  if (!day) {
                    return <span key={`empty-${index}`} />
                  }
                  const isSelected = day === '12'
                  return (
                    <span
                      key={day}
                      className={`rounded-lg px-2 py-1 ${
                        isSelected
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {day}
                    </span>
                  )
                })}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-center">
                  <p className="text-xs text-blue-600">Present</p>
                  <p className="text-lg font-semibold text-blue-700">3</p>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center">
                  <p className="text-xs text-red-600">Absent</p>
                  <p className="text-lg font-semibold text-red-700">2</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <Phone className="h-4 w-4" />
                Call Parent
              </button>
              <button className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <Mail className="h-4 w-4" />
                Send Email
              </button>
              <button className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <CalendarDays className="h-4 w-4" />
                Schedule Meeting
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default StudentDetails