import { useMemo, useState } from 'react'
import {
  BookOpen,
  ChevronDown,
  Clock3,
  Download,
  MapPin,
  Pencil,
  Plus,
  // Print,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import fileExport from '@/assets/fileExport.svg'
import printer from '@/assets/printer.svg'
import edit from '@/assets/edit.svg'
import LocationOn from '@/assets/LocationOn.svg'
import BookLogo1 from '@/assets/BookLogo1.png'

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

const PERIOD_SLOTS = [
  { id: 'period-1', time: '8:00 - 9:00', teacher: 'Ms. Ayesha' },
  { id: 'period-2', time: '9:00 - 10:00', teacher: 'Ms. Sadia' },
  { id: 'period-3', time: '10:00 - 11:00', teacher: 'Ms. Naheeda' },
  { id: 'period-4', time: '11:00 - 12:00', teacher: 'Ms. Naila' },
  { id: 'period-5', time: '1:00 - 2:00', teacher: 'Ms. Amna' },
]

const CLASS_BASE_SUBJECTS = [
  {
    id: 'class-6-a',
    label: 'Class 6 - A',
    subjects: ['English', 'Science', 'Maths', 'History', 'Geography'],
  },
  {
    id: 'class-7-a',
    label: 'Class 7 - A',
    subjects: ['Pstudy', 'English', 'Islamic Studies', 'Club', 'History'],
  },
  {
    id: 'class-8-a',
    label: 'Class 8 - A',
    subjects: ['English', 'Urdu', 'Maths', 'Science', 'Geography'],
  },
  {
    id: 'class-9-a',
    label: 'Class 9 - A',
    subjects: ['Maths', 'English', 'Science', 'Maths', 'Pstudy'],
  },
]

const rotateSubjects = (subjects, offset) =>
  subjects.map((_, index) => subjects[(index + offset) % subjects.length])

const buildDaySchedule = (subjects) => {
  const periodEntries = PERIOD_SLOTS.map((slot, index) => ({
    ...slot,
    type: 'period',
    subject: subjects[index],
    room: 'Room 25',
  }))

  return [
    ...periodEntries.slice(0, 4),
    { id: 'break-1', type: 'break', label: '12:00 - 1:00 - Lunch Break' },
    periodEntries[4],
  ]
}

const INITIAL_TIMETABLES = CLASS_BASE_SUBJECTS.map((classItem) => ({
  ...classItem,
  days: WEEK_DAYS.reduce((accumulator, day, dayIndex) => {
    accumulator[day] = buildDaySchedule(rotateSubjects(classItem.subjects, dayIndex))
    return accumulator
  }, {}),
}))

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
  const [timetables, setTimetables] = useState(INITIAL_TIMETABLES)
  const [selectedClassId, setSelectedClassId] = useState('')
  const [activeDay, setActiveDay] = useState(WEEK_DAYS[0])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [formData, setFormData] = useState(createFormState())
  const [formError, setFormError] = useState('')

  const activeTimetable = useMemo(
    () => timetables.find((timetable) => timetable.id === selectedClassId) ?? timetables[0],
    [selectedClassId, timetables]
  )

  const activeDaySchedule = activeTimetable?.days?.[activeDay] ?? []
  const isEditMode = modalMode === 'edit'

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
      setFormError('Please enter teacher name.')
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

  const upsertTimetableEntry = () => {
    setTimetables((previous) =>
      previous.map((classItem) => {
        if (classItem.id !== formData.classId) return classItem

        return {
          ...classItem,
          days: {
            ...classItem.days,
            [formData.day]: classItem.days[formData.day].map((entry) => {
              if (entry.type === 'break') return entry
              if (entry.time !== formData.time) return entry

              return {
                ...entry,
                subject: formData.subject.trim(),
                teacher: formData.teacher.trim(),
                room: formData.room.trim(),
              }
            }),
          },
        }
      })
    )
  }

  const handleModalSubmit = (event) => {
    event.preventDefault()
    if (!validateForm()) return

    upsertTimetableEntry()
    toast.success(isEditMode ? 'Timetable updated successfully.' : 'Timetable added successfully.')
    closeModal()
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
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            <Plus className="h-3 w-3 bg-white rounded  text-primary-500" />
            Add timetable
          </button>
        </div>
      </div>

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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/35 px-4 backdrop-blur-[2px]">
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
              {isEditMode ? 'Edit Timetable' : 'Add New Timetable'}
            </h2>

            <form onSubmit={handleModalSubmit} className="mt-8 space-y-4 px-10 ">
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
                  <input
                    type="text"
                    value={formData.teacher}
                    onChange={(event) => handleInputChange('teacher', event.target.value)}
                    className="h-9 w-full rounded-xl border-2 border-gray-700 bg-gray-100 px-3 text-sm text-[#111827] outline-none transition focus:border-primary-500"
                  />
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
                  className="inline-flex h-10 mt-10 items-center rounded bg-primary-500 px-6 text-sm font-semibold text-white transition hover:bg-primary-700"
                >
                  {isEditMode ? 'Save Changes' : 'Add Timetable'}
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
