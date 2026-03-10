  import { useState } from 'react'
  import { Link } from 'react-router-dom'
  import edit from '@/assets/edit.svg'
  import Customer from '@/assets/Customer.svg'
  import genderIcon from '@/assets/genderIcon.svg'
  import pdfIcon from '@/assets/pdfIcon.svg'
  import IconDown from '@/assets/IconDown.svg'
  import Icon from '@/assets/Icon.svg'

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

  const monthOptions = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  const yearOptions = Array.from({ length: 11 }, (_, index) => 2020 + index)

  const StudentDetails = () => {
    const [selectedMonth, setSelectedMonth] = useState('Sep')
    const [selectedYear, setSelectedYear] = useState(2025)

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
                      <h2 className="text-lg font-semibold text-gray-900 text-center mb-1">Amna Malik</h2>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge variant="primary" className= "bg-gray-200 rounded text-gray-900">Adm.101</Badge>
                        <Badge variant="default" className="bg-gray-200 rounded text-gray-900">Class 9-A</Badge>
                        <Badge variant="success" className="bg-green-100 rounded ">Active</Badge>
                      </div>
                    </div>
                  <button className="rounded-md border border-gray-200 absolute  top-0 right-0 p-2 text-gray-500 hover:bg-gray-50 flex items-center justify-center h-8">
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
                    <span className="font-medium text-gray-900">Female</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400 text-base">
                      <CalendarDays className="h-4 w-4" />
                      Date of Birth
                    </div>
                    <span className="font-medium text-gray-900">May 18, 2005</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400 text-base">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </div>
                    <span className="font-medium text-gray-900">0268799646</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex  items-center gap-2 text-gray-400 text-base">
                      <MapPin className="h-4 w-4" />
                      Address
                    </div>
                    <span className="font-medium text-gray-900">Peshawar, Pakistan</span>
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
                    <p className="font-medium text-gray-900">Ali Ahmad</p>
                    <p className="text-xs text-gray-500">03639192490</p>
                  </div>
                </div>
                <hr />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Mother</span>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">Kalsoom Bibi</p>
                    <p className="text-xs text-gray-500">03639192490</p>
                  </div>
                </div>
                <hr />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Alternative Guardian</span>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">Ali Ahmad</p>
                    <p className="text-xs text-gray-500">03639192490</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-transparent p-2">
              <CardHeader className="border-none">
                <CardTitle className="text-base">Additional Info</CardTitle>
              </CardHeader>
              <CardContent className="bg-[#F8F8F8] rounded ">
                <p className="text-sm font-medium text-gray-900">Hobbies</p>
                <p className="text-sm text-gray-500">Running, Reading</p>
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
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex items-center gap-2 rounded-md bg-primary-600 px-3 py-2 text-sm text-white"
                  >
                    Last 7 Months
                    <img src={IconDown} alt="Drop down icon" className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-10 grid items-center gap-6 lg:grid-cols-[1.1fr_1.9fr]  ">
                  <div className="rounded-2xl  p-4 ">
                    <div className="relative mx-auto h-32 w-32">
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background:
                            'conic-gradient(#22c55e 0deg, #22c55e 302deg, #f1f5f9 302deg, #f1f5f9 360deg)',
                        }}
                      />
                      <div className="absolute inset-3 flex items-center justify-center rounded-full bg-white shadow-sm">
                        <div className="text-center">
                          <p className="text-2xl font-semibold text-gray-900">84%</p>
                          <p className="text-xs text-gray-500">Average Score</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 rounded-lg w-full h-12  bg-gray-200  px-3 py-2 text-xs text-gray-600">
                      She shows good performance
                    </div>
                  </div>

                  <div>
                    <div className="flex h-36 items-end gap-3 ">
                      {performanceBars.map((value, index) => (
                        <div key={performanceMonths[index]} className="flex-1">
                          <div
                            className={`w-full rounded-md  ${
                              index === 3 ? 'bg-primary-600' : 'bg-indigo-200'
                            }`}
                            style={{ height: `${value}%`, minHeight: '80px' }}
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
                          <img src={pdfIcon} alt="PDF Icon" className='w-6 h-6'/>
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

          <div className="space-y-6">
            <Card >
              <CardContent className="p-5 w-[318px] aspect-[318/385]">
                <div className="flex items-center justify-between">
                  <button className="rounded-md  p-2 text-gray-500 hover:bg-gray-50">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="text-center flex gap-2">
                    <select
                      className="text-sm font-semibold text-gray-900 bg-transparent focus:outline-none"
                      value={selectedMonth}
                      onChange={(event) => setSelectedMonth(event.target.value)}
                      aria-label="Select month"
                    >
                      {monthOptions.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <select
                      className="text-sm font-semibold text-gray-900 bg-transparent focus:outline-none"
                      value={selectedYear}
                      onChange={(event) => setSelectedYear(Number(event.target.value))}
                      aria-label="Select year"
                    >
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button className="rounded-md  p-2 text-gray-500 hover:bg-gray-50">
                    <ChevronRight className="h-5 w-5" />
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

            {/* <Card>
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
            </Card> */}
          </div>
        </div>
      </div>
    )
  }

  export default StudentDetails