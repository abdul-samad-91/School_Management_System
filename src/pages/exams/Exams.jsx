import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { 
  Plus, 
  } from 'lucide-react'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import Select from '@/components/ui/Select'
import fileExport2 from '@/assets/fileExport2.svg'
import SortVector from '@/assets/SortVector.svg'
import edit from '@/assets/edit.svg'
import trash from '@/assets/Trash.svg'
import SortingArrow from '@/assets/SortingArrow.svg'
import printer from '@/assets/printer.svg'
import BookLogo1 from '@/assets/BookLogo1.png'
import { examsAPI } from '@/lib/api'
import { handleError } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'

const createEmptyExam = () => ({
  subject: '',
  date: '',
  startTime: '',
  endTime: '',
  duration: '',
  room: '',
  maxMarks: '',
  minMarks: '',
  className: '',
})

const normalizeExam = (exam) => ({
  id: exam._id,
  subject: exam.subject?.name || exam.subjectId?.name || exam.subject || '',
  date: exam.date ? new Date(exam.date).toLocaleDateString() : '',
  startTime: exam.schedule?.[0]?.startTime || exam.startTime || '',
  endTime: exam.schedule?.[0]?.endTime || exam.endTime || '',
  duration: exam.duration || '',
  room: exam.room || exam.venue || '',
  maxMarks: exam.maxMarks || exam.totalMarks || 100,
  minMarks: exam.passingMarks || exam.minMarks || 35,
  className: exam.class?.name || exam.classId?.name || '',
})

const Exams = () => {
  const queryClient = useQueryClient()
  const [isAddExamOpen, setIsAddExamOpen] = useState(false)
  const [isEditExamOpen, setIsEditExamOpen] = useState(false)
  const [selectedExam, setSelectedExam] = useState(null)
  const [formData, setFormData] = useState(createEmptyExam())
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: examsRaw = [], isLoading } = useQuery({
    queryKey: ['exams'],
    queryFn: async () => {
      const response = await examsAPI.getAll()
      return response.data?.data || []
    },
  })

  const examRows = examsRaw.map(normalizeExam)

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddExam = async () => {
    if (!formData.subject || !formData.date) {
      toast.error('Subject and date are required.')
      return
    }
    try {
      setIsSubmitting(true)
      await examsAPI.create({
        subject: formData.subject,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        duration: formData.duration,
        room: formData.room,
        maxMarks: Number(formData.maxMarks) || 100,
        passingMarks: Number(formData.minMarks) || 35,
        class: formData.className,
      })
      await queryClient.invalidateQueries({ queryKey: ['exams'] })
      toast.success('Exam added successfully.')
      setIsAddExamOpen(false)
      setFormData(createEmptyExam())
    } catch (error) {
      toast.error(handleError(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveExam = async () => {
    if (!selectedExam) return
    try {
      setIsSubmitting(true)
      await examsAPI.update(selectedExam.id, {
        subject: selectedExam.subject,
        date: selectedExam.date,
        startTime: selectedExam.startTime,
        endTime: selectedExam.endTime,
        duration: selectedExam.duration,
        room: selectedExam.room,
        maxMarks: Number(selectedExam.maxMarks),
        passingMarks: Number(selectedExam.minMarks),
      })
      await queryClient.invalidateQueries({ queryKey: ['exams'] })
      toast.success('Exam updated successfully.')
      setIsEditExamOpen(false)
      setSelectedExam(null)
    } catch (error) {
      toast.error(handleError(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteExam = async (id) => {
    try {
      await examsAPI.delete(id)
      await queryClient.invalidateQueries({ queryKey: ['exams'] })
      toast.success('Exam removed.')
    } catch (error) {
      toast.error(handleError(error))
    }
  }

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
        className="border-2 px-10 rounded-lg border-gray-300"
      >
        <div className="space-y-4 ">
          <div >
            <div className="flex items-center justify-center gap-3 mt-4">
              {/* <BookOpen className="h-12 w-12 text-[#0f1524]" /> */}
              <img src={BookLogo1} alt="Book logo" className="w-16 h-14"/>
              <p className="text-lg font-medium text-[#0f1524]">School Management <br /> System</p>
            </div>
            <p className="mt-6 text-2xl  font-semibold text-center text-gray-800">Add New Exam</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input label="Subject" value={formData.subject} onChange={(e) => handleFieldChange('subject', e.target.value)} className="bg-gray-100 border-2 border-gray-900 rounded-xl" />
            <Input label="Exam Date" type="date" value={formData.date} onChange={(e) => handleFieldChange('date', e.target.value)} className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
            <Input label="Class" value={formData.className} onChange={(e) => handleFieldChange('className', e.target.value)} className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
            <Input label="Room No." value={formData.room} onChange={(e) => handleFieldChange('room', e.target.value)} className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
            <Input label="Max. Marks" type="number" value={formData.maxMarks} onChange={(e) => handleFieldChange('maxMarks', e.target.value)} className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
            <Input label="Min. Marks" type="number" value={formData.minMarks} onChange={(e) => handleFieldChange('minMarks', e.target.value)} className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
            <Input label="Start Time" value={formData.startTime} onChange={(e) => handleFieldChange('startTime', e.target.value)} className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
            <Input label="End Time" value={formData.endTime} onChange={(e) => handleFieldChange('endTime', e.target.value)} className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
          </div>

          <Input label="Duration" value={formData.duration} onChange={(e) => handleFieldChange('duration', e.target.value)} className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              className="rounded border-gray-700 text-gray-900 px-6 mb-6"
              onClick={() => { setIsAddExamOpen(false); setFormData(createEmptyExam()) }}
            >
              Cancel
            </Button>
            <Button size="md" className="rounded px-6 mb-6" loading={isSubmitting} onClick={handleAddExam}>Add Exam</Button>
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
        className= "border-2 border-gray-300 rounded-lg px-10"
      >
        <div className="space-y-4">
          <div >
              <div className="flex items-center justify-center gap-3 mt-4">
              {/* <BookOpen className="h-12 w-12 text-[#0f1524]" /> */}
              <img src={BookLogo1} alt="Book logo" className="w-16 h-14"/>
              <p className="text-xl font-medium text-[#0f1524]">School Management <br /> System</p>
            </div>
            <p className="mt-4 mb-10 text-2xl text-center font-bold text-gray-800 ">Exam Details</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input label="Subject" placeholder="" value={selectedExam?.subject || ''} onChange={(e) => setSelectedExam(prev => ({ ...prev, subject: e.target.value }))} className="bg-gray-100 border-2 border-gray-900 rounded-xl " />
            <Input label="Exam Date" placeholder="" value={selectedExam?.date || ''} onChange={(e) => setSelectedExam(prev => ({ ...prev, date: e.target.value }))} className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
            <Input label="Class" placeholder="" value={selectedExam?.className || ''} onChange={(e) => setSelectedExam(prev => ({ ...prev, className: e.target.value }))} className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
            <Input label="Room No." placeholder="" value={selectedExam?.room || ''} onChange={(e) => setSelectedExam(prev => ({ ...prev, room: e.target.value }))} className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
            <Input label="Max. Marks" type="number" placeholder="" value={selectedExam?.maxMarks || ''} onChange={(e) => setSelectedExam(prev => ({ ...prev, maxMarks: e.target.value }))} className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
            <Input label="Min. Marks" type="number" placeholder="" value={selectedExam?.minMarks || ''} onChange={(e) => setSelectedExam(prev => ({ ...prev, minMarks: e.target.value }))} className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
            <Input label="Start Time" placeholder="" value={selectedExam?.startTime || ''} onChange={(e) => setSelectedExam(prev => ({ ...prev, startTime: e.target.value }))} className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
            <Input label="End Time" placeholder="" value={selectedExam?.endTime || ''} onChange={(e) => setSelectedExam(prev => ({ ...prev, endTime: e.target.value }))} className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>
          </div>

          <Input label="Duration" placeholder="" value={selectedExam?.duration || ''} onChange={(e) => setSelectedExam(prev => ({ ...prev, duration: e.target.value }))} className="bg-gray-100 border-2 border-gray-900 rounded-xl"/>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              className="rounded border-gray-700 text-gray-900 px-6 mb-6"
              onClick={() => {
                setIsEditExamOpen(false)
                setSelectedExam(null)
              }}
            >
              Cancel
            </Button>
            <Button size="md" className="rounded bg-primary-500 px-6 mb-6" loading={isSubmitting} onClick={handleSaveExam}>Save</Button>
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} className="py-10 text-center">
                    <div className="flex justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : examRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="py-10 text-center text-sm text-gray-500">No exams found.</TableCell>
                </TableRow>
              ) : (
              examRows.map((row) => (
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
                    <div className="inline-flex items-center gap-2">
                      <button
                        className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50"
                        onClick={() => handleDeleteExam(row.id)}
                      >
                        <span className="sr-only">Delete</span>
                        <img src={trash} alt="Delete" className="h-5 w-5" />
                      </button>
                      <button className="rounded border border-gray-200 p-1.5 hover:bg-gray-50"
                        onClick={() => {
                          setSelectedExam(row)
                          setIsEditExamOpen(true)
                        }}>
                        <span className="sr-only">Edit</span>
                        <img src={edit} alt="Edit" className="h-5 w-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
              )}
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