import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, PlusCircle, Image, Upload } from 'lucide-react'

const createScheduleRow = (id) => ({
  id,
  className: '',
  dayTime: '',
  hours: '',
  subject: '',
})

const DropZone = ({ title, helperText }) => {
  return (
    <div className="rounded-2xl border-2 border-dashed border-primary-400 bg-[#f8f9fd] px-5 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-white p-2 text-[#58698d]">
            <Image className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold text-[#3b4660]">{title}</p>
            <p className="mt-1 text-sm text-[#7a8498]">{helperText}</p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center rounded-lg bg-primary-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
        >
          Upload
        </button>
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
    'h-12 w-full rounded-xl border border-[#d5d9e2] bg-white px-3 text-base text-[#2e3a58] outline-none transition placeholder:text-[#afb7c8] focus:border-primary-400'
  const labelStyles = 'text-base font-medium leading-none text-[#1c2232]'

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
          <h1 className="text-3xl font-bold tracking-tight text-[#253256]">Add New Teacher</h1>
          <p className="mt-1 text-base text-[#6f7890]">Students &nbsp; / &nbsp; Add Teacher</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 gap-3 2xl:grid-cols-[1.55fr_1fr]">
          <div className="space-y-3">
            <section className="rounded-2xl border border-[#e0e3ea] bg-[#f3f4f6] p-5">
              <h2 className="text-2xl font-bold leading-none text-[#11131a]">Personal Information</h2>

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
                    placeholder="Type here"
                    className={inputStyles}
                  />
                </label>

                <label className="space-y-2">
                  <span className={labelStyles}>Date of Birth</span>
                  <input
                    type="date"
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
                />
              </div>
            </section>

            <section className="rounded-2xl border border-[#e0e3ea] bg-[#f3f4f6] p-5">
              <h2 className="text-2xl font-bold leading-none text-[#11131a]">Contact Information</h2>

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
            <section className="rounded-2xl border border-[#e0e3ea] bg-[#f3f4f6] p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold leading-none text-[#11131a]">Schedule</h2>
                <button
                  type="button"
                  onClick={addScheduleRow}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#cdd2df] bg-white text-[#576483] transition hover:bg-slate-50"
                >
                  <PlusCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {scheduleRows.map((row) => (
                  <article key={row.id} className="rounded-2xl bg-[#ebedf1] p-3">
                    <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_1.35fr_0.9fr]">
                      <label className="space-y-1">
                        <span className={labelStyles}>Class</span>
                        <input
                          value={row.className}
                          onChange={(event) => updateSchedule(row.id, 'className', event.target.value)}
                          className={inputStyles}
                        />
                      </label>
                      <label className="space-y-1">
                        <span className={labelStyles}>Day &amp; Time</span>
                        <input
                          value={row.dayTime}
                          onChange={(event) => updateSchedule(row.id, 'dayTime', event.target.value)}
                          className={inputStyles}
                        />
                      </label>
                      <label className="space-y-1">
                        <span className={labelStyles}>Hours</span>
                        <input
                          value={row.hours}
                          onChange={(event) => updateSchedule(row.id, 'hours', event.target.value)}
                          className={inputStyles}
                        />
                      </label>
                    </div>
                    <label className="mt-2 block space-y-1">
                      <span className={labelStyles}>Subject</span>
                      <input
                        value={row.subject}
                        onChange={(event) => updateSchedule(row.id, 'subject', event.target.value)}
                        className={inputStyles}
                      />
                    </label>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#e0e3ea] bg-[#f3f4f6] p-5">
              <h2 className="text-2xl font-bold leading-none text-[#11131a]">Documents</h2>
              <div className="mt-4">
                <DropZone
                  title="Drag And Drop Files Here Or Upload"
                  helperText="Accepted file types: JPG, SVG, PNG 120 x 120 (px)"
                />
              </div>
            </section>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            to="/teachers"
            className="inline-flex h-12 items-center rounded-lg border border-[#3a3f4d] bg-[#f5f5f6] px-6 text-base font-medium text-[#171a22] transition hover:bg-[#ececef]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex h-12 items-center rounded-lg bg-primary-600 px-6 text-base font-medium text-white transition hover:bg-primary-700"
          >
            <Upload className="mr-2 h-4 w-4" />
            Save &amp; Add
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddTeacher
