import { useState } from 'react'
import { Download, Plus, ArrowUpDown } from 'lucide-react'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import Select from '@/components/ui/Select'
import fileExport2 from '@/assets/fileExport2.svg'
import SortVector from '@/assets/SortVector.svg'
import edit from '@/assets/edit.svg'
// import { Trash } from 'lucide-react'
import trash from '@/assets/trash.svg'
import SortingArrow from '@/assets/SortingArrow.svg'
import logo from '@/assets/BookLogo1.png'
import printer from '@/assets/printer.svg'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'

const examRows = [
  {
    id: 1,
    subject: 'English',
    date: '13 May 2024',
    startTime: '09:30 AM',
    endTime: '10:45 AM',
    duration: '3 hrs',
    room: '101',
    maxMarks: 100,
    minMarks: 35,
  },
  {
    id: 2,
    subject: 'Urdu',
    date: '14 May 2024',
    startTime: '09:30 AM',
    endTime: '10:45 AM',
    duration: '3 hrs',
    room: '104',
    maxMarks: 100,
    minMarks: 35,
  },
  {
    id: 3,
    subject: 'Physics',
    date: '15 May 2024',
    startTime: '09:30 AM',
    endTime: '10:45 AM',
    duration: '3 hrs',
    room: '103',
    maxMarks: 100,
    minMarks: 35,
  },
  {
    id: 4,
    subject: 'Chemistry',
    date: '16 May 2024',
    startTime: '09:30 AM',
    endTime: '10:45 AM',
    duration: '3 hrs',
    room: '105',
    maxMarks: 100,
    minMarks: 35,
  },
  {
    id: 5,
    subject: 'Maths',
    date: '17 May 2024',
    startTime: '09:30 AM',
    endTime: '10:45 AM',
    duration: '3 hrs',
    room: '106',
    maxMarks: 100,
    minMarks: 35,
  },
  {
    id: 6,
    subject: 'Computer',
    date: '18 May 2024',
    startTime: '09:30 AM',
    endTime: '10:45 AM',
    duration: '3 hrs',
    room: '102',
    maxMarks: 100,
    minMarks: 35,
  },
  {
    id: 7,
    subject: 'History',
    date: '19 May 2024',
    startTime: '09:30 AM',
    endTime: '10:45 AM',
    duration: '3 hrs',
    room: '107',
    maxMarks: 100,
    minMarks: 35,
  },
]

const Exams = () => {
  const [isAddExamOpen, setIsAddExamOpen] = useState(false)
  const [isEditExamOpen, setIsEditExamOpen] = useState(false)
  const [selectedExam, setSelectedExam] = useState(null)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Exam Schedule</h1>
          {/* <p className="text-sm text-gray-500">Exam Schedule List</p> */}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <img src={printer} alt="Printer" className="h-5 w-5 mr-4" />
          <Button variant="secondary" size="sm" className="gap-2">
            {/* <Download className="h-4 w-4" /> */}
            <img src={fileExport2} alt="Export" className="h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="gap-2" onClick={() => setIsAddExamOpen(true)}>
            <span className=' rounded bg-white'><Plus className="h-4 w-4 text-black"/></span>
            Add Exam
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isAddExamOpen}
        onClose={() => setIsAddExamOpen(false)}
        title=""
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xl font-semibold text-gray-900">
              <img src={logo} alt="Logo" className="h-10 w-14" />
              <span className='text-4xl font-serif font-semibold '>SMS</span>
            </div>
            <p className="mt-2 text-2xl  font-semibold text-gray-800">Add New Exam</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input label="Subject" placeholder="" className="bg-gray-100 border-2 border-gray-900 rounded-xl" />
            <Input label="Exam Date" placeholder="" className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
            <Input label="Class" placeholder=""  className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
            <Input label="Room No." placeholder="" className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
            <Input label="Max. Marks" type="number" placeholder="" className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
            <Input label="Min. Marks" type="number" placeholder="" className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
            <Input label="Start Time"  placeholder="" className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
            <Input label="End Time"  placeholder="" className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
          </div>

          <Input label="Duration" placeholder="" className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              className="rounded"
              onClick={() => setIsAddExamOpen(false)}
            >
              Cancel
            </Button>
            <Button size="md" className="rounded">Add Exam</Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isEditExamOpen}
        onClose={() => {
          setIsEditExamOpen(false)
          setSelectedExam(null)
        }}
        title=""
        size="sm"
        className= "bg-gray-200"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xl font-semibold text-gray-900">
              <img src={logo} alt="Logo" className="h-10 w-14" />
              <span className='text-4xl font-serif font-semibold'>SMS</span>
            </div>
            <p className="mt-4 mb-5 text-2xl  font-semibold text-gray-800 ">Exam Details</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input label="Subject" placeholder=""  defaultValue={selectedExam?.subject || ''} className="bg-gray-100 border-2 border-gray-900 rounded-xl " />
            <Input label="Exam Date" placeholder="" defaultValue={selectedExam?.date || ''} className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
            <Input label="Class" placeholder="" defaultValue={selectedExam?.className || ''} className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
            <Input label="Room No." placeholder="" defaultValue={selectedExam?.room || ''} className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
            <Input label="Max. Marks" type="number" placeholder="" defaultValue={selectedExam?.maxMarks || ''} className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
            <Input label="Min. Marks" type="number" placeholder="" defaultValue={selectedExam?.minMarks || ''} className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
            <Input label="Start Time"  placeholder="" defaultValue={selectedExam?.startTime || ''} className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
            <Input label="End Time"  placeholder="" defaultValue={selectedExam?.endTime || ''} className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
          </div>

          <Input label="Duration" placeholder="" defaultValue={selectedExam?.duration || ''} className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              className="rounded border-gray-700 text-gray-900"
              onClick={() => {
                setIsEditExamOpen(false)
                setSelectedExam(null)
              }}
            >
              Cancel
            </Button>
            <Button size="md" className="rounded bg-primary-500">Save</Button>
          </div>
        </div>
      </Modal>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg">Exam Schedule List</CardTitle>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select
              className="w-full sm:min-w-[140px]"
              placeholder="Select session"
              options={[
                { label: 'Session 2024', value: '2024' },
                { label: 'Session 2025', value: '2025' },
              ]}
            />
            <Select
              className="w-full sm:min-w-[140px]"
              placeholder="Select Exam"
              options={[
                { label: 'Mid Term', value: 'mid' },
                { label: 'Final', value: 'final' },
              ]}
            />
            <div className="relative">
              <img
                src={SortVector}
                alt="Sort"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              />
              <Select
                className="w-full sm:min-w-[140px] pl-9"
                placeholder="Sort by A-Z"
                options={[
                  { label: 'Sort by A-Z', value: 'az' },
                  { label: 'Sort by Z-A', value: 'za' },
                ]}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Row Per Page</span>
              <select className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <span>Entries</span>
            </div>
            <div className="flex items-center gap-3">
              <Select
                className="w-full sm:min-w-[160px]"
                placeholder="Select Class"
                options={[
                  { label: 'Class 8-A', value: '8a' },
                  { label: 'Class 9-A', value: '9a' },
                ]}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
            <TableHeader >
              <TableRow className="">
                <TableHead className="w-10">
                  <input type="checkbox" className="h-3.5 w-3.5" />
                </TableHead>
                <TableHead className="text-black text-xs whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    Subject
                    <img src={SortingArrow} alt="Sort" className="h-3.5 w-3.5" />
                  </span>
                </TableHead>
                <TableHead className="text-black whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    Exam Date
                    <img src={SortingArrow} alt="Sort" className="h-3.5 w-3.5" />
                  </span>
                </TableHead>
                <TableHead className="text-black whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    Start Time
                    <img src={SortingArrow} alt="Sort" className="h-3.5 w-3.5" />
                  </span>
                </TableHead>
                <TableHead className="text-black whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    End Time
                    <img src={SortingArrow} alt="Sort" className="h-3.5 w-3.5" />
                  </span>
                </TableHead>
                <TableHead className="text-black whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    Duration
                    <img src={SortingArrow} alt="Sort" className="h-3.5 w-3.5" />
                  </span>
                </TableHead>
                <TableHead className="text-black whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    Room No
                    <img src={SortingArrow} alt="Sort" className="h-3.5 w-3.5" />
                  </span>
                </TableHead>
                <TableHead className="text-black whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    Max Marks
                    <img src={SortingArrow} alt="Sort" className="h-3.5 w-3.5" />
                  </span>
                </TableHead>
                <TableHead className="text-black whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    Min Marks
                    <img src={SortingArrow} alt="Sort" className="h-3.5 w-3.5" />
                  </span>
                </TableHead>
                <TableHead className="text-right text-black ">Action </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <input type="checkbox" className="h-3.5 w-3.5" />
                  </TableCell>
                  <TableCell>{row.subject}</TableCell>
                  <TableCell className="text-gray-600">{row.date}</TableCell>
                  <TableCell className="text-gray-600">{row.startTime}</TableCell>
                  <TableCell className="text-gray-600">{row.endTime}</TableCell>
                  <TableCell className="text-gray-600">{row.duration}</TableCell>
                  <TableCell className="text-gray-600">{row.room}</TableCell>
                  <TableCell className="text-gray-600">{row.maxMarks}</TableCell>
                  <TableCell className="text-gray-600">{row.minMarks}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-2 ">
                      <button
                        className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50"
                      
                      >
                        <span className="sr-only">Delete</span>
                        {/* <svg viewBox="0 0 24 24" className="h-4 w-4 text-black" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18" />
                          <path d="M8 6V4h8v2" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                        </svg> */}
                        <img src={trash} alt="Delete" className="h-5 w-5" />
                      </button>
                      <button className="rounded border border-gray-200 p-1.5  hover:bg-gray-50"
                      
                        onClick={() => {
                          setSelectedExam(row)
                          setIsEditExamOpen(true)
                        }}>
                        <span className="sr-only">Edit</span>
                        {/* <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
                        </svg> */}
                        <img src={edit} alt="Edit" className="h-5 w-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end gap-2 text-xs text-gray-500">
            <button className="px-2 py-1">Prev</button>
            <button className="rounded-md bg-primary-600 px-2.5 py-1 text-white">1</button>
            <button className="px-2 py-1">2</button>
            <button className="px-2 py-1">...</button>
            <button className="px-2 py-1">20</button>
            <button className="px-2 py-1 text-primary-600">Next</button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Exams

