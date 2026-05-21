import { useMemo, useState } from 'react'
import {
  ChevronDown,
  Clock3,
  Plus
} from 'lucide-react'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import fileExport from '@/assets/fileExport.svg'
import printer from '@/assets/printer.svg'
import edit from '@/assets/edit.svg'
import LocationOn from '@/assets/LocationOn.svg'
import BookLogo1 from '@/assets/BookLogo1.png'
import { academicAPI, schoolAPI, teachersAPI } from '@/lib/api'
import { handleError } from '@/lib/utils'

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const PERIOD_SLOTS = [
  { id: 'period-1', time: '8:00 - 8:45' },
  { id: 'period-2', time: '8:45 - 9:30' },
  { id: 'period-3', time: '9:30 - 10:15' },
  { id: 'period-4', time: '10:15 - 11:00' },
  { id: 'period-5', time: '11:45 - 12:30' },
  { id: 'period-6', time: '12:30 - 1:15' },
]

const FRIDAY_PERIODS = [
  { id: 'fri-period-1', time: '8:00 - 8:40' },
  { id: 'fri-period-2', time: '8:40 - 9:20' },
  { id: 'fri-period-3', time: '9:20 - 10:00' },
  { id: 'fri-period-4', time: '10:00 - 10:40' },
  { id: 'fri-period-5', time: '10:40 - 11:20' },
  { id: 'fri-period-6', time: '11:20 - 12:00' },
]

const BREAK_PERIOD = {
  slotId: 'break-1',
  time: '11:00 - 11:45',
  type: 'break',
  breakLabel: '11:00 - 11:45 - Break',
}

const buildDefaultDays = () =>
  WEEK_DAYS.map((day) => {
    // Friday: 6 periods (8:00 - 12:00) with no break
    if (day === 'Friday') {
      return {
        day,
        periods: FRIDAY_PERIODS.map((slot) => ({
          slotId: slot.id,
          time: slot.time,
          subject: '',
          teacher: '',
          room: 'Room 25',
          type: 'period',
        })),
      }
    }

    // Other days: 6 periods with 45-minute break
    return {
      day,
      periods: [
        ...PERIOD_SLOTS.slice(0, 4).map((slot) => ({
          slotId: slot.id,
          time: slot.time,
          subject: '',
          teacher: '',
          room: 'Room 25',
          type: 'period',
        })),
        BREAK_PERIOD,
        ...PERIOD_SLOTS.slice(4, 6).map((slot) => ({
          slotId: slot.id,
          time: slot.time,
          subject: '',
          teacher: '',
          room: 'Room 25',
          type: 'period',
        })),
      ],
    }
  })

// Transform API timetable to view format {id, label, days: {Monday: [...]}}
const toViewFormat = (tt) => ({
  id: tt._id,
  label: tt.label,
  days: WEEK_DAYS.reduce((acc, day) => {
    // Friday: Always use the new 6-period schedule (8:00 - 12:00) regardless of database data
    if (day === 'Friday') {
      acc[day] = FRIDAY_PERIODS.map((slot) => ({
        id: slot.id,
        time: slot.time,
        type: 'period',
        subject: '',
        teacher: '',
        room: '',
      }))
      return acc
    }

    // Other days: Use database data if exists, otherwise use defaults
    const dayData = (tt.days || []).find((d) => d.day === day)
    if (!dayData) {
      // Default: 6 periods with 45-minute break
      acc[day] = [
        ...PERIOD_SLOTS.slice(0, 4).map((slot) => ({ id: slot.id, time: slot.time, type: 'period', subject: '', teacher: '', room: '' })),
        { id: 'break-1', type: 'break', time: BREAK_PERIOD.time, label: BREAK_PERIOD.breakLabel },
        ...PERIOD_SLOTS.slice(4, 6).map((slot) => ({ id: slot.id, time: slot.time, type: 'period', subject: '', teacher: '', room: '' })),
      ]
    } else {
      acc[day] = (dayData.periods || []).map((p) => ({
        id: p.slotId || 'period',
        time: p.time || '',
        type: p.type || 'period',
        subject: p.subject || '',
        teacher: p.teacher || '',
        room: p.room || '',
        label: p.breakLabel || '',
      }))
    }
    return acc
  }, {}),
})

const createFormState = (initialValues = {}) => ({
  subject: '',
  teacher: '',
  classId: '',
  room: 'Room 25',
  day: WEEK_DAYS[0],
  time: PERIOD_SLOTS[0].time,
  ...initialValues,
})

const Timetables = () => {
  const queryClient = useQueryClient()
  const [selectedClassId, setSelectedClassId] = useState('')
  const [activeDay, setActiveDay] = useState(WEEK_DAYS[0])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add') // 'add' | 'edit' | 'create'
  const [formData, setFormData] = useState(createFormState())
  const [formError, setFormError] = useState('')
  const [newLabel, setNewLabel] = useState('')

  const { data: schoolProfile } = useQuery({
    queryKey: ['school-profile'],
    queryFn: async () => {
      const res = await schoolAPI.getProfile()
      return res.data?.data
    },
  })

  const { data: teachers = [] } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const res = await teachersAPI.getAll()
      return res.data?.data || []
    },
  })

  const { data: timetablesRaw = [], isLoading } = useQuery({
    queryKey: ['timetables'],
    queryFn: async () => {
      const res = await academicAPI.getTimetables()
      return res.data?.data || []
    },
  })

  const timetables = useMemo(() => timetablesRaw.map(toViewFormat), [timetablesRaw])

  const { mutateAsync: saveTimetable, isPending: isSaving } = useMutation({
    mutationFn: ({ id, days }) => academicAPI.updateTimetable(id, { days }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['timetables'] }),
  })

  const { mutateAsync: createNewTimetable, isPending: isCreating } = useMutation({
    mutationFn: (data) => academicAPI.createTimetable(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['timetables'] }),
  })

  const activeTimetable = useMemo(
    () => timetables.find((tt) => tt.id === selectedClassId) ?? timetables[0],
    [selectedClassId, timetables]
  )

  const activeDaySchedule = activeTimetable?.days?.[activeDay] ?? []
  const isEditMode = modalMode === 'edit'
  const isCreateMode = modalMode === 'create'

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    toast.info('Export will be available in the next step.')
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalMode('add')
    setFormData(createFormState())
    setFormError('')
    setNewLabel('')
  }

  const openCreateModal = () => {
    setModalMode('create')
    setNewLabel('')
    setFormError('')
    setIsModalOpen(true)
  }

  const openAddModal = () => {
    if (!activeTimetable) return

    setModalMode('add')
    setFormData(
      createFormState({
        classId: activeTimetable.id,
        day: activeDay,
      })
    )
    setFormError('')
    setIsModalOpen(true)
  }

  const openEditModal = (entry) => {
    if (!activeTimetable) return

    setModalMode('edit')
    setFormData(
      createFormState({
        subject: entry.subject,
        teacher: entry.teacher,
        classId: activeTimetable.id,
        room: entry.room,
        day: activeDay,
        time: entry.time,
      })
    )
    setFormError('')
    setIsModalOpen(true)
  }

  const handleInputChange = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.subject.trim()) {
      setFormError('Please enter subject name.')
      return false
    }

    if (!formData.teacher.trim()) {
      setFormError('Please select a teacher.')
      return false
    }

    if (!formData.classId || !formData.day || !formData.time) {
      setFormError('Please select class, day and time.')
      return false
    }

    if (!formData.room.trim()) {
      setFormError('Please enter room number.')
      return false
    }

    setFormError('')
    return true
  }

  const handleModalSubmit = async (event) => {
    event.preventDefault()

    // Create new timetable mode
    if (isCreateMode) {
      if (!newLabel.trim()) {
        setFormError('Please enter a class label (e.g. Class 6 - A).')
        return
      }
      try {
        await createNewTimetable({
          label: newLabel.trim(),
          days: buildDefaultDays(),
          ...(schoolProfile?._id ? { school: schoolProfile._id } : {}),
        })
        toast.success('Timetable created successfully.')
        closeModal()
      } catch (error) {
        toast.error(handleError(error))
      }
      return
    }

    if (!validateForm()) return

    const rawTimetable = timetablesRaw.find((tt) => tt._id === formData.classId)
    if (!rawTimetable) {
      toast.error('Class timetable not found.')
      return
    }

    // Build full updated days array – patch the matching period slot
    const sourceDays = rawTimetable.days?.length ? rawTimetable.days : buildDefaultDays()
    const updatedDays = sourceDays.map((d) => {
      if (d.day !== formData.day) return d
      return {
        ...d,
        periods: d.periods.map((p) => {
          if (p.type === 'break' || p.time !== formData.time) return p
          return {
            ...p,
            subject: formData.subject.trim(),
            teacher: formData.teacher.trim(),
            room: formData.room.trim(),
          }
        }),
      }
    })

    try {
      await saveTimetable({ id: rawTimetable._id, days: updatedDays })
      toast.success('Timetable updated successfully.')
      closeModal()
    } catch (error) {
      toast.error(handleError(error))
    }
  }

  const handleRoomClick = (entry) => {
    toast.info(`${entry.subject} is in ${entry.room}`)
  }

  return (
    <div className="h-full space-y-4 overflow-y-auto pr-1">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#253256]">Time Table</h1>
          <p className="mt-1 text-[15px] text-[#65708a]">Academic / Timetables</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#748098] transition hover:bg-[#e9ecf1]"
            aria-label="Print timetable"
          >
            {/* <Printer className="h-4 w-4" /> */}
            <img src={printer} alt="Printer logo" />
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg bg-[#dce1eb] px-4 py-2 text-sm font-semibold text-[#475372] transition hover:bg-[#ced5e4]"
          >
            {/* <Download className="h-4 w-4" /> */}
            <img src={fileExport} alt="Export logo" />
            Export
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            <Plus className="h-3 w-3 bg-white rounded  text-primary-500" />
            Add timetable
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
        </div>
      ) : timetables.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
          <p className="text-lg font-medium">No timetables found.</p>
          <p className="text-sm mt-1">Click &quot;Add timetable&quot; to create one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative w-full max-w-[170px]">
        <select
          value={selectedClassId}
          onChange={(event) => setSelectedClassId(event.target.value)}
          className="h-11 w-full appearance-none rounded-lg   bg-[#eceff4] px-4 pr-10 text-sm font-semibold text-[#49597a] outline-none transition focus:border-[#9ca9bf]"
        >
          <option value="">Select Class</option>
          {timetables.map((classItem) => (
            <option key={classItem.id} value={classItem.id}>
              {classItem.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#566281]" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {WEEK_DAYS.map((day) => {
          const isActive = day === activeDay
          return (
            <button
              key={day}
              type="button"
              onClick={() => setActiveDay(day)}
              className={`h-11 rounded-xl border-2 text-base font-medium transition ${
                isActive
                  ? 'border-gray-600  text-[#1f2937]'
                  : 'border-gray-400  text-[#2d3545]'
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>

      <div className="space-y-4 pb-2">
        {activeDaySchedule.map((entry, index) => {
          if (entry.type === 'break') {
            return (
              <article
                key={`${activeDay}-${entry.id}`}
                className="rounded-3xl border border-[#9ca3af] bg-[#eff0f2] px-4 py-10 sm:px-6"
              >
                <div className="mx-auto w-full max-w-[420px] rounded-xl bg-[#cfd1d3] px-4 py-3 text-center text-base font-semibold text-[#111827] sm:text-lg">
                  {entry.label}
                </div>
              </article>
            )
          }

          return (
            <article
              key={`${activeDay}-${entry.id}-${index}`}
              className="rounded-3xl border-2 border-[#9ca3af] bg-white px-4 py-5 sm:px-6 sm:py-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-xl bg-[#d1d3d5] text-[#4d5259]">
                      <Clock3 className="h-8 w-8" />
                    </div>

                    <p className="w-[100px] shrink-0 text-sm font-medium text-[#5f6368] sm:w-[130px] sm:text-base">
                      {entry.time}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold leading-none text-[#0f172a] sm:text-2xl">
                      {entry.subject}
                    </h3>
                    <p className="mt-2 text-base text-[#5f6368] sm:text-lg">{entry.teacher}</p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 self-end lg:self-center">
                  <button
                    type="button"
                    onClick={() => openEditModal(entry)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#a6adb9]  text-[#515966] transition hover:bg-[#e1e6ec]"
                    aria-label={`Edit ${entry.subject}`}
                  >
                    {/* <Pencil className="h-5 w-5" /> */}
                    <img src={edit} alt="Edit icon" className="w-6 h-6" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoomClick(entry)}
                    className="inline-flex h-10 min-w-[104px] items-center justify-center gap-2 rounded-lg border-2 border-gray-700 px-3 text-sm font-semibold text-[#111827] whitespace-nowrap"
                    aria-label={`Room for ${entry.subject}`}
                  >
                    {/* <MapPin className="h-4 w-4" /> */}
                    <img src={LocationOn} alt="map Icon" />
                    {entry.room}
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 top-[52px] flex items-center justify-center bg-white/35 px-4 backdrop-blur-[2px]">
          <div className="relative w-full max-w-[512px] rounded-2xl border-[3px] border-gray-400 bg-white   shadow-[0_10px_24px_rgba(15,23,42,0.3)] sm:p-8">
            {/* <button
              type="button"
              onClick={closeModal}
              className="absolute right-3 top-3 rounded-lg p-1 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button> */}

                      <div className="flex items-center justify-center gap-3 ">
                                    {/* <BookOpen className="h-12 w-12 text-[#0f1524]" /> */}
                                    <img src={BookLogo1} alt="Book logo" className="w-18 h-16 mb-2"/>
                                  <p className="text-6xl font-medium text-[#0f1524] font-serif">SMS</p>
                                  </div>

            <h2 className="mt-4 text-center text-4xl font-semibold text-[#111827]">
              {isCreateMode ? 'New Timetable' : isEditMode ? 'Edit Timetable' : 'Add New Timetable'}
            </h2>

            <form onSubmit={handleModalSubmit} className="mt-8 space-y-4 px-10 ">
              {isCreateMode ? (
                <label className="block space-y-1">
                  <span className="text-xl font-normal text-[#111827]">Class Label</span>
                  <input
                    type="text"
                    placeholder="e.g. Class 6 - A"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="h-9 w-full rounded-xl border-2 border-gray-700 bg-gray-100 px-3 text-sm text-[#111827] outline-none transition focus:border-primary-500"
                  />
                </label>
              ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-xl font-normal text-[#111827]">Subject Name</span>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(event) => handleInputChange('subject', event.target.value)}
                    className="h-9 w-full rounded-xl border-2 border-gray-700 bg-gray-100 px-3 text-sm text-[#111827] outline-none transition focus:border-primary-500"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-xl font-normal text-[#111827]">Teacher Name</span>
                  <select
                    value={formData.teacher}
                    onChange={(event) => handleInputChange('teacher', event.target.value)}
                    className="h-9 w-full rounded-xl border-2 border-gray-700 bg-gray-100 px-3 text-sm text-[#111827] outline-none transition focus:border-primary-500"
                  >
                    <option value="">Select Teacher</option>
                    {teachers.length > 0 ? (
                      teachers.map((teacher) => {
                        const fullName = teacher.profile 
                          ? `${teacher.profile.firstName || ''} ${teacher.profile.lastName || ''}`.trim()
                          : teacher.firstName ? `${teacher.firstName} ${teacher.lastName || ''}`.trim() : 'Unknown';
                        return (
                          <option key={teacher._id} value={fullName}>
                            {fullName}
                          </option>
                        );
                      })
                    ) : (
                      <option disabled>No teachers available</option>
                    )}
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="text-xl font-normal text-[#111827]">Class</span>
                  <select
                    value={formData.classId}
                    onChange={(event) => handleInputChange('classId', event.target.value)}
                    disabled={isEditMode}
                    className={`h-9 w-full rounded-xl border-2 border-gray-700 px-3 text-sm text-[#111827] outline-none transition ${
                      isEditMode
                        ? 'cursor-not-allowed bg-[#e6e8ec]'
                        : 'bg-gray-100 focus:border-primary-500'
                    }`}
                  >
                    <option value="">Select Class</option>
                    {timetables.map((classItem) => (
                      <option key={classItem.id} value={classItem.id}>
                        {classItem.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="text-xl font-normal text-[#111827]">Room No.</span>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(event) => handleInputChange('room', event.target.value)}
                    className="h-9 w-full rounded-xl border-2 border-gray-700 bg-gray-100 px-3 text-sm text-[#111827] outline-none transition focus:border-primary-500"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-xl font-normal text-[#111827]">Select Day</span>
                  <select
                    value={formData.day}
                    onChange={(event) => handleInputChange('day', event.target.value)}
                    disabled={isEditMode}
                    className={`h-9 w-full rounded-xl border-2 border-gray-700 px-3 text-sm text-[#111827] outline-none transition ${
                      isEditMode
                        ? 'cursor-not-allowed bg-[#e6e8ec]'
                        : 'bg-gray-100 focus:border-primary-500'
                    }`}
                  >
                    {WEEK_DAYS.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="text-xl font-noraml text-[#111827]">Select Time</span>
                  <select
                    value={formData.time}
                    onChange={(event) => handleInputChange('time', event.target.value)}
                    disabled={isEditMode}
                    className={`h-9 w-full rounded-xl border-2 border-gray-700 px-3 text-sm text-[#111827] outline-none transition ${
                      isEditMode
                        ? 'cursor-not-allowed bg-[#e6e8ec]'
                        : 'bg-gray-100 focus:border-primary-500'
                    }`}
                  >
                    {PERIOD_SLOTS.map((slot) => (
                      <option key={slot.id} value={slot.time}>
                        {slot.time}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              )}

              {formError ? <p className="text-base font-medium text-red-600">{formError}</p> : null}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-10 items-center mt-10 rounded border-2 border-gray-700 bg-white px-6 text-sm font-semibold text-[#111827] transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isCreating}
                  className="inline-flex h-10 mt-10 items-center rounded bg-primary-500 px-6 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-50"
                >
                  {isCreateMode ? 'Create' : isEditMode ? 'Save Changes' : 'Add Timetable'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Timetables
