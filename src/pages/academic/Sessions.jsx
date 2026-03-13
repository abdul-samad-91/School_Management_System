import { useMemo, useState } from 'react'
import { BookOpen, PlusCircle, X , Plus} from 'lucide-react'
import BookLogo1 from '@/assets/BookLogo1.png'

const INITIAL_SESSIONS = [
  {
    id: 'session-2025-2026',
    name: '2025-2026',
    startDate: '2025-01-01',
    endDate: '2026-01-01',
  },
  {
    id: 'session-2024-2025',
    name: '2024-2025',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
  },
  {
    id: 'session-2023-2024',
    name: '2023-2024',
    startDate: '2023-01-01',
    endDate: '2024-01-01',
  },
  {
    id: 'session-2022-2023',
    name: '2022-2023',
    startDate: '2022-01-01',
    endDate: '2023-01-01',
  },
]

const createEmptyForm = () => ({
  id: null,
  name: '',
  startDate: '',
  endDate: '',
})

const formatDateForCard = (value) => {
  if (!value) return ''
  const dateValue = new Date(value)
  if (Number.isNaN(dateValue.getTime())) return value
  const day = dateValue.getDate()
  const month = dateValue.getMonth() + 1
  const year = dateValue.getFullYear()
  return `${day}-${month}-${year}`
}

const sortSessionsByStartDate = (sessions) =>
  [...sessions].sort((first, second) => new Date(second.startDate) - new Date(first.startDate))

const SessionCard = ({ session, isCurrent, onEdit }) => {
  return (
    <article
      className={`w-full max-w-[380px] rounded-xl border-4 shadow-sm ${
        isCurrent
          ? 'border-[#8f9994] bg-[#F0FDF4]'
          : 'border-[#969ca7] bg-[#EFF6FF]'
      }`}
    >
      <header className="border-b-2 border-gray-800 px-4 py-3">
        <h3 className="text-center text-3xl font-semibold tracking-wide text-[#0f1524] sm:text-4xl">
          {session.name}
        </h3>
      </header>

      <div className="space-y-3 px-5 py-4">
        <div>
          <p className="text-2xl font-semibold leading-none text-[#0f1524] sm:text-3xl">Start date</p>
          <div className="mt-2 rounded-2xl border-2 border-gray-800 bg-gray-200 px-3 py-1 text-center text-2xl font-medium text-[#0f1524] sm:text-3xl">
            {formatDateForCard(session.startDate)}
          </div>
        </div>

        <div>
          <p className="text-2xl font-semibold leading-none text-[#0f1524] sm:text-3xl">End date</p>
          <div className="mt-2 rounded-2xl border-2 border-gray-800 bg-gray-200 px-3 py-1 text-center text-2xl font-medium text-[#0f1524] sm:text-3xl">
            {formatDateForCard(session.endDate)}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => onEdit(session)}
            className="rounded-lg border-2 border-gray-600 bg-white px-5 py-2 text-lg font-semibold text-[#171c2a] transition hover:bg-white"
          >
            Edit
          </button>
        </div>
      </div>
    </article>
  )
}

const Sessions = () => {
  const [sessions, setSessions] = useState(INITIAL_SESSIONS)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [isEditEnabled, setIsEditEnabled] = useState(true)
  const [formData, setFormData] = useState(createEmptyForm())
  const [formError, setFormError] = useState('')

  const orderedSessions = useMemo(() => sortSessionsByStartDate(sessions), [sessions])
  const currentSession = orderedSessions[0] || null
  const previousSessions = orderedSessions.slice(1)

  const openAddSessionModal = () => {
    setModalMode('add')
    setIsEditEnabled(true)
    setFormData(createEmptyForm())
    setFormError('')
    setIsModalOpen(true)
  }

  const openSessionDetails = (session) => {
    setModalMode('details')
    setIsEditEnabled(false)
    setFormData({
      id: session.id,
      name: session.name,
      startDate: session.startDate,
      endDate: session.endDate,
    })
    setFormError('')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalMode('add')
    setIsEditEnabled(true)
    setFormData(createEmptyForm())
    setFormError('')
  }

  const handleInputChange = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.name.trim() || !formData.startDate || !formData.endDate) {
      setFormError('Please fill session name, start date, and end date.')
      return false
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setFormError('End date must be after start date.')
      return false
    }

    setFormError('')
    return true
  }

  const handleAddSession = () => {
    if (!validateForm()) return

    const newSession = {
      id: `session-${Date.now()}`,
      name: formData.name.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
    }

    setSessions((previous) => [...previous, newSession])
    closeModal()
  }

  const handleSaveSession = () => {
    if (!isEditEnabled) return
    if (!validateForm()) return

    setSessions((previous) =>
      previous.map((session) =>
        session.id === formData.id
          ? {
              ...session,
              name: formData.name.trim(),
              startDate: formData.startDate,
              endDate: formData.endDate,
            }
          : session
      )
    )

    closeModal()
  }

  const isReadOnly = modalMode === 'details' && !isEditEnabled
  const modalTitle = modalMode === 'add' ? 'Add Session' : 'Session Details'

  return (
    <div className="h-full space-y-4 overflow-y-auto pr-1">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-[#253256]">Sessions</h1>
        <button
          type="button"
          onClick={openAddSessionModal}
          className="inline-flex items-center gap-2 rounded bg-primary-600 px-5 py-2.5  font-semibold text-white transition hover:bg-primary-700"
        >
          {/* <PlusCircle className="h-4 w-4" /> */}
        
           <Plus  className= "w-3 h-3 bg-white text-primary-500 rounded "/>
      
          Add Session
        </button>
      </div>

      <section>
        <h2 className="mb-3 text-2xl font-semibold text-[#253256]">Current Sessions</h2>
        {currentSession ? (
          <SessionCard session={currentSession} isCurrent onEdit={openSessionDetails} />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-8 text-center text-lg text-slate-500">
            No active session available.
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-2xl font-bold text-[#253256] sm:text-3xl">Previous Sessions</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {previousSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              isCurrent={false}
              onEdit={openSessionDetails}
            />
          ))}
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-[512px] h-[559px] rounded-xl border-2 border-gray-400 bg-white px-16 py-7 shadow-lg">
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-3 top-3 rounded-full p-1 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center justify-center gap-3 mt-4">
              {/* <BookOpen className="h-12 w-12 text-[#0f1524]" /> */}
              <img src={BookLogo1} alt="Book logo" className="w-16 h-14"/>
              <p className="text-lg font-medium text-[#0f1524]">School Management <br /> System</p>
            </div>

            <h3 className="mt-10 pb-10 text-center text-3xl font-medium  text-[#0f1524] sm:text-4xl">{modalTitle}</h3>

            <div className="mt-6 space-y-3">
              <label className="block space-y-1">
                <span className="text-xl font-medium text-[#0f1524]">Session Name</span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => handleInputChange('name', event.target.value)}
                  readOnly={isReadOnly}
                  className={`h-11 w-full rounded-xl border-2 border-gray-400 bg-gray-100 px-3 text-xl text-[#0f1524] outline-none ${
                    isReadOnly
                      ? 'cursor-default bg-[#e8e9eb]'
                      : ' focus:border-gray-800'
                  }`}
                />
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block space-y-1">
                  <span className="text-xl font-medium text-[#0f1524]">Start Date</span>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(event) => handleInputChange('startDate', event.target.value)}
                    readOnly={isReadOnly}
                    className={`h-11 w-full rounded-xl border-2 border-gray-400 bg-gray-100 px-3 text-lg text-[#0f1524] outline-none ${
                      isReadOnly
                        ? 'cursor-default bg-[#e8e9eb]'
                        : 'focus:border-gray-800'
                    }`}
                  />
                </label>

                <label className="block space-y-1">
                  <span className="text-xl font-medium text-[#0f1524]">End Date</span>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(event) => handleInputChange('endDate', event.target.value)}
                    readOnly={isReadOnly}
                    className={`h-11 w-full rounded-xl border-2 border-gray-400 bg-gray-100 px-3 text-lg text-[#0f1524] outline-none ${
                      isReadOnly
                        ? 'cursor-default bg-[#e8e9eb]'
                        : ' focus:border-gray-800'
                    }`}
                  />  
                </label>
              </div>
            </div>

            {formError && <p className="mt-3 text-sm font-medium text-rose-600">{formError}</p>}

            <div className="mt-10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="rounded border-2 border-gray-400 mr-3 bg-white/70 px-5 py-2 text-lg font-semibold text-[#131a2a] transition hover:bg-white"
              >
                Cancel
              </button>

              {modalMode === 'add' ? (
                <button
                  type="button"
                  onClick={handleAddSession}
                  className="rounded bg-primary-500 px-7  py-2 text-lg font-semibold text-white transition hover:bg-primary-700"
                >
                  Add Session
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditEnabled(true)}
                    className="rounded border-2 border-gray-300  bg-white/70 px-5 py-2 text-lg font-semibold text-[#131a2a] transition hover:bg-white"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSession}
                    className={`rounded px-5 py-2 text-lg font-semibold text-white transition ${
                      isEditEnabled
                        ? 'bg-primary-500 hover:bg-primary-700'
                        : 'cursor-not-allowed bg-primary-300'
                    }`}
                  >
                    Save
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sessions
