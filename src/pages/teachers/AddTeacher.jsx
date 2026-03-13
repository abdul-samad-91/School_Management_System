import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, PlusCircle, Image, Upload } from 'lucide-react'
import Icons from '@/assets/Icons.svg'

const createScheduleRow = (id) => ({
  id,
  className: '',
  dayTime: '',
  hours: '',
  subject: '',
})

const DropZone = ({ title, helperText, accept, multiple = false, selectedFiles, onFilesSelected }) => {
  const inputRef = useRef(null)

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || [])
    onFilesSelected(files)
  }

  const selectedNames = selectedFiles
    .map((file) => file.name)
    .filter(Boolean)
  return (
    <div className="rounded-2xl border-2 border-dashed border-primary-400 bg-[#f8f9fd] px-5 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start">
          <div className=" p-2 text-[#58698d] ">
            {/* <Image className="h-5 w-5" /> */}
            <img src={Icons} alt="" className='w-6 h-6'/>
          </div>
          <div>
            <p className="text-base font-semibold text-[#3b4660] sm:text-lg">{title}</p>
            <p className="mt-1 text-xs text-[#7a8498] sm:text-sm">{helperText}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleButtonClick}
            className="inline-flex items-center rounded-lg bg-primary-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            Upload
          </button>
          {selectedNames.length > 0 && (
            <div className="text-right text-xs text-[#6f7890]">
              {multiple ? `${selectedNames.length} files selected` : selectedNames[0]}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const AddTeacher = () => {
  const [teacher, setTeacher] = useState({
    teacherId: 'Auto-Generated',
    fullName: '',
    dateOfBirth: '',
    gender: 'male',
    email: '',
    phoneNumber: '',
    address: '',
  })
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [documents, setDocuments] = useState([])
  const [scheduleRows, setScheduleRows] = useState([createScheduleRow(1), createScheduleRow(2)])

  const updateTeacher = (field, value) => {
    setTeacher((previous) => ({ ...previous, [field]: value }))
  }

  const updateSchedule = (id, field, value) => {
    setScheduleRows((previousRows) =>
      previousRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    )
  }

  const addScheduleRow = () => {
    setScheduleRows((previousRows) => [...previousRows, createScheduleRow(previousRows.length + 1)])
  }

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  const inputStyles =
    'h-12 w-full rounded-2xl border-2 border-[#d5d9e2] bg-white px-3 text-sm text-[#2e3a58] outline-none transition placeholder:text-[#afb7c8] focus:border-primary-400 sm:text-base'
  const labelStyles = 'text-base font-medium leading-none text-[#1c2232] sm:text-lg'

  return (
    <div className="h-full overflow-y-auto pb-4 pr-1">
      <div className="mb-4 flex items-start gap-3">
        <Link
          to="/teachers"
          className="mt-1 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#dee1e8] bg-[#f7f8fa] text-[#3b4661] transition hover:bg-[#eceff4]"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#253256] sm:text-3xl">Add New Teacher</h1>
          <p className="mt-1 text-sm text-[#6f7890] sm:text-base">Students &nbsp; / &nbsp; Add Teacher</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 gap-3 2xl:grid-cols-[1.55fr_1fr]">
          <div className="space-y-3">
            <section className="rounded-2xl border border-[#e0e3ea] bg-white p-5">
              <h2 className="text-xl font-semibold leading-none text-[#11131a] sm:text-2xl">Personal Information</h2>

              <div className="mt-5 grid grid-cols-1 gap-3 xl:grid-cols-3">
                <label className="space-y-2">
                  <span className={labelStyles}>Teacher ID</span>
                  <input
                    value={teacher.teacherId}
                    readOnly
                    className="h-12 w-full rounded-xl border border-[#d5d9e2] bg-[#dfe2e7] px-3 text-base text-[#65718b]"
                  />
                  <span className="block text-sm text-[#8a91a3]">Auto-Generated</span>
                </label>

                <label className="space-y-2">
                  <span className={labelStyles}>Full Name</span>
                  <input
                    value={teacher.fullName}
                    onChange={(event) => updateTeacher('fullName', event.target.value)}
                    // placeholder="Type here"
                    className={inputStyles}
                  />
                </label>

                <label className="space-y-2">
                  <span className={labelStyles}>Date of Birth</span>
                  <input
                    type="text"
                    value={teacher.dateOfBirth}
                    onChange={(event) => updateTeacher('dateOfBirth', event.target.value)}
                    className={inputStyles}
                  />
                </label>
              </div>

              <div className="mt-4 space-y-2">
                <p className={labelStyles}>Gender</p>
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  <label className="flex h-12 cursor-pointer items-center gap-2 rounded-xl border border-[#d5d9e2] bg-white px-4 text-base text-[#58617a]">
                    <input
                      type="radio"
                      name="gender"
                      checked={teacher.gender === 'male'}
                      onChange={() => updateTeacher('gender', 'male')}
                      className="h-4 w-4 accent-primary-600"
                    />
                    Male
                  </label>
                  <label className="flex h-12 cursor-pointer items-center gap-2 rounded-xl border border-[#d5d9e2] bg-white px-4 text-base text-[#58617a]">
                    <input
                      type="radio"
                      name="gender"
                      checked={teacher.gender === 'female'}
                      onChange={() => updateTeacher('gender', 'female')}
                      className="h-4 w-4 accent-primary-600"
                    />
                    Female
                  </label>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <p className={labelStyles}>Profile Photo</p>
                <DropZone
                  title="Drag And Drop Files Here Or Upload"
                  helperText="Accepted file types: JPG, SVG, PNG 120 x 120 (px)"
                  accept="image/png,image/jpeg,image/svg+xml"
                  selectedFiles={profilePhoto ? [profilePhoto] : []}
                  onFilesSelected={(files) => setProfilePhoto(files[0] || null)}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-[#e0e3ea] bg-white p-5">
              <h2 className="text-xl font-bold leading-none text-[#11131a] sm:text-2xl">Contact Information</h2>

              <div className="mt-5 grid grid-cols-1 gap-3 xl:grid-cols-2">
                <label className="space-y-2">
                  <span className={labelStyles}>Email Address</span>
                  <input
                    type="email"
                    value={teacher.email}
                    onChange={(event) => updateTeacher('email', event.target.value)}
                    className={inputStyles}
                  />
                </label>
                <label className="space-y-2">
                  <span className={labelStyles}>Phone Number</span>
                  <input
                    value={teacher.phoneNumber}
                    onChange={(event) => updateTeacher('phoneNumber', event.target.value)}
                    className={inputStyles}
                  />
                </label>
                <label className="space-y-2 xl:col-span-2">
                  <span className={labelStyles}>Address</span>
                  <input
                    value={teacher.address}
                    onChange={(event) => updateTeacher('address', event.target.value)}
                    className={inputStyles}
                  />
                </label>
              </div>
            </section>
          </div>

          <div className="space-y-3">
            <section className="rounded-2xl border border-[#e0e3ea] bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold leading-none text-[#11131a] sm:text-2xl">Schedule</h2>
                <button
                  type="button"
                  onClick={addScheduleRow}
                  className="inline-flex h-9 w-9 items-center justify-center  bg-white text-[#576483] transition hover:bg-slate-50"
                >
                  <PlusCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {scheduleRows.map((row) => (
                  <article key={row.id} className="rounded-2xl bg-gray-50 p-3">
                    <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_1.35fr_0.9fr]">
                      <label className="space-y-1">
                        <span className={labelStyles}>Class</span>
                        <input
                          value={row.className}
                          onChange={(event) => updateSchedule(row.id, 'className', event.target.value)}
                          className={`h-9 ${inputStyles}`}
                        />
                      </label>
                      <label className="space-y-1">
                        <span className={labelStyles}>Day &amp; Time</span>
                        <input
                          value={row.dayTime}
                          onChange={(event) => updateSchedule(row.id, 'dayTime', event.target.value)}
                          className={`h-9 ${inputStyles}`}
                        />
                      </label>
                      <label className="space-y-1">
                        <span className={labelStyles}>Hours</span>
                        <input
                          value={row.hours}
                          onChange={(event) => updateSchedule(row.id, 'hours', event.target.value)}
                          className={`h-9 ${inputStyles}`}
                        />
                      </label>
                    </div>
                    <label className="mt-2 block space-y-1">
                      <span className={labelStyles}>Subject</span>
                      <input
                        value={row.subject}
                        onChange={(event) => updateSchedule(row.id, 'subject', event.target.value)}
                        className={` w-[60%] flex h-9 ${inputStyles}`}
                      />
                    </label>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#e0e3ea] bg-white p-5 h-[260px]">
              <h2 className="text-lg font-bold leading-none text-[#11131a] sm:text-2xl">Documents</h2>
              <div className="mt-4">
                <DropZone
                  title="Drag And Drop Files Here Or Upload"
                  helperText="Accepted file types: JPG, SVG, PNG 120 x 120 (px)"
                  accept="image/png,image/jpeg,image/svg+xml"
                  multiple
                  selectedFiles={documents}
                  onFilesSelected={setDocuments}
                />
              </div>
            </section>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            to="/teachers"
            className="inline-flex h-12 items-center rounded-lg border-2 border-gray-300  bg-[#f5f5f6] px-6 text-base font-medium text-[#171a22] transition hover:bg-[#ececef]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex h-12 items-center rounded-lg bg-primary-600 px-6 text-base font-medium text-white transition hover:bg-primary-700"
          >
            {/* <Upload className="mr-2 h-4 w-4" /> */}
            Save &amp; Add
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddTeacher
