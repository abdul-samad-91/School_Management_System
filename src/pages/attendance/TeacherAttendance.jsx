import { useMemo, useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { toast } from 'sonner'
import { useQuery, useQueryClient } from '@tanstack/react-query'
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
import { teachersAPI, attendanceAPI, schoolAPI } from '@/lib/api'
import { handleError } from '@/lib/utils'

const STAT_STYLES = [
  { label: 'Present', key: 'present', className: 'bg-blue-50 border-blue-200 text-blue-700' },
  { label: 'Absent', key: 'absent', className: 'bg-green-50 border-green-200 text-green-700' },
  { label: 'Leave', key: 'leave', className: 'bg-rose-50 border-rose-200 text-rose-700' },
  { label: 'T.Teachers', key: 'total', className: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
]

const attendanceOptions = ['Present', 'Late', 'Absent', 'Leave', 'Holiday']

const TeacherAttendance = () => {
  const today = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(today)
  const [searchTerm, setSearchTerm] = useState('')
  const [attendanceMap, setAttendanceMap] = useState({})
  const [noteMap, setNoteMap] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  // Fetch school profile
  const { data: schoolProfile } = useQuery({
    queryKey: ['school-profile-teacher-attendance'],
    queryFn: async () => {
      const response = await schoolAPI.getProfile()
      return response.data?.data
    },
  })

  // Fetch existing attendance for the selected date to pre-populate the form
  const { data: existingAttendance = [] } = useQuery({
    queryKey: ['existing-teacher-attendance', selectedDate],
    queryFn: async () => {
      const response = await attendanceAPI.getAll({
        date: selectedDate,
        type: 'teacher',
        school: schoolProfile?._id,
      })
      return response.data?.data || []
    },
    enabled: Boolean(selectedDate && schoolProfile?._id),
  })

  // Pre-populate attendance map from existing records whenever date changes
  useEffect(() => {
    if (existingAttendance.length > 0) {
      const newAttendanceMap = {}
      const newNoteMap = {}
      existingAttendance.forEach((record) => {
        const teacherId = record.teacher?._id || record.teacher
        if (teacherId) {
          newAttendanceMap[teacherId] = record.status
          if (record.remarks) newNoteMap[teacherId] = record.remarks
        }
      })
      setAttendanceMap(newAttendanceMap)
      setNoteMap(newNoteMap)
    } else {
      setAttendanceMap({})
      setNoteMap({})
    }
  }, [existingAttendance])

  const { data: teachersRaw = [], isLoading } = useQuery({
    queryKey: ['teachers-for-attendance'],
    queryFn: async () => {
      const response = await teachersAPI.getAll()
      return response.data?.data || []
    },
  })

  const teachers = useMemo(() => teachersRaw.map((t) => ({
    id: t._id,
    employeeId: t.employeeId || 'N/A',
    idNo: t.employeeId || t._id,
    name: `${t.profile?.firstName || ''} ${t.profile?.lastName || ''}`.trim() || 'Unknown',
    avatar: (t.profile?.firstName?.[0] || 'T').toUpperCase(),
  })), [teachersRaw])

  const filteredTeachers = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase()
    if (!needle) return teachers
    return teachers.filter((t) => t.name.toLowerCase().includes(needle) || t.idNo.toLowerCase().includes(needle))
  }, [teachers, searchTerm])

  const stats = useMemo(() => {
    const counts = { present: 0, absent: 0, leave: 0, late: 0, total: teachers.length }
    Object.values(attendanceMap).forEach((status) => {
      const key = status?.toLowerCase()
      if (key in counts) counts[key]++
    })
    return STAT_STYLES.map((s) => ({
      ...s,
      value: counts[s.key] ?? 0,
      percent: s.key === 'total' ? 'Total' : `${counts.total ? Math.round((counts[s.key] / counts.total) * 100) : 0}%`,
    }))
  }, [attendanceMap, teachers.length])

  const handleAttendanceChange = (teacherId, value) => {
    setAttendanceMap((prev) => ({ ...prev, [teacherId]: value }))
  }

  const handleNoteChange = (teacherId, value) => {
    setNoteMap((prev) => ({ ...prev, [teacherId]: value }))
  }

  const handleSubmit = async () => {
    if (!selectedDate) {
      toast.error('Please select a date.')
      return
    }
    if (teachers.length === 0) {
      toast.error('No teachers to mark attendance for.')
      return
    }
    try {
      setIsSubmitting(true)
      const records = teachers.map((teacher) => ({
        teacherId: teacher.id,
        status: (attendanceMap[teacher.id] || 'present').toLowerCase(),
        note: noteMap[teacher.id] || '',
      }))
      await attendanceAPI.mark({
        school: schoolProfile?._id,
        date: selectedDate,
        type: 'teacher',
        records,
      })
      // Refetch existing attendance so the form stays populated with saved data
      await queryClient.invalidateQueries({ queryKey: ['existing-teacher-attendance', selectedDate] })
      toast.success('Teacher attendance marked successfully.')
    } catch (error) {
      toast.error(handleError(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
          <p className="text-sm text-gray-600">Mark Attendance / Teachers</p>
        </div>
       <div className="flex items-center gap-3">
         <img src={printer} alt="" className='w-4 h-4'/>
        <Button variant="outline" className="gap-2 bg-[#E9EDF4] rounded border-none">
        <img src={fileExport2} alt="Export" className="h-4 w-4" />  Export
        </Button>
       </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className={stat.className}>
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
          <CardTitle className="text-xl">Teacher Attendance List</CardTitle>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              type="date"
              className="min-w-[160px]"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className='whitespace-nowrap'>Row Per Page</span>
              <Select options={[{ value: '10', label: '10' }, { value: '20', label: '20' }, { value: '50', label: '50' }]} placeholder="10" className="w-[70px]" />
              <span>Entries</span>
            </div>
            <div className="w-full sm:w-[240px]">
              <Input placeholder="Search" leftIcon={<Search className="h-4 w-4" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead><input type="checkbox" aria-label="Select all" /></TableHead>
                  <TableHead className="text-gray-700 whitespace-nowrap">
                    <span className="inline-flex items-center gap-2">T. No <img src={SortingArrow} alt="Sort" className="h-3.5 w-3.5" /></span>
                  </TableHead>
                  <TableHead className="text-gray-700 whitespace-nowrap">
                    <span className="inline-flex items-center gap-2">ID No <img src={SortingArrow} alt="Sort" className="h-3.5 w-3.5" /></span>
                  </TableHead>
                  <TableHead className="text-gray-700">Name</TableHead>
                  <TableHead className="text-gray-700">Attendance</TableHead>
                  <TableHead className="text-gray-700">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center">
                      <div className="flex justify-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredTeachers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-sm text-gray-500">No teachers found.</TableCell>
                  </TableRow>
                ) : (
                  filteredTeachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell><input type="checkbox" aria-label={`Select ${teacher.name}`} /></TableCell>
                      <TableCell className="text-blue-600">{teacher.employeeId}</TableCell>
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
                        <div className="flex items-center gap-2">
                          {attendanceOptions.map((option) => (
                            <label key={`${teacher.id}-${option}`} className="flex items-center gap-1 text-xs border-r px-1 border-gray-500 text-gray-600">
                              <input
                                type="radio"
                                name={`attendance-${teacher.id}`}
                                value={option.toLowerCase()}
                                checked={attendanceMap[teacher.id] === option.toLowerCase()}
                                onChange={() => handleAttendanceChange(teacher.id, option.toLowerCase())}
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          className="min-w-[140px]"
                          value={noteMap[teacher.id] || ''}
                          onChange={(e) => handleNoteChange(teacher.id, e.target.value)}
                          placeholder="Note"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredTeachers.length > 0 && (
            <div className="mt-4 flex justify-end">
              <Button onClick={handleSubmit} loading={isSubmitting} className="px-6">
                Save Attendance
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default TeacherAttendance