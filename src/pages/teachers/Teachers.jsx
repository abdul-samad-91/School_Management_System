import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MoreVertical,
  FileDown,
  Filter,
  PlusCircle,
  Printer,
  Search,
  ArrowDownUp,
} from 'lucide-react'

const TEACHERS = [
  {
    id: '0001',
    name: 'Tania',
    classLabel: 'III A',
    email: 'tania.physics@school.edu.pk',
    phone: '+92 300 1112233',
    subject: 'Physics',
    initials: 'TA',
    avatarTone: 'bg-[#1f355f]',
  },
  {
    id: '0002',
    name: 'Danial',
    classLabel: 'II (A)',
    email: 'danial.cs@academy.com',
    phone: '+92 301 2223344',
    subject: 'Computer',
    initials: 'DA',
    avatarTone: 'bg-[#704132]',
  },
  {
    id: '0003',
    name: 'Hania',
    classLabel: 'VI (A)',
    email: 'hania.english@schoolmail.pk',
    phone: '+92 302 3334455',
    subject: 'English',
    initials: 'HA',
    avatarTone: 'bg-[#7b5b45]',
  },
  {
    id: '0004',
    name: 'Ahsan',
    classLabel: 'VI (B) , V (A)',
    email: 'ahsan.urdu@eduportal.pk',
    phone: '+92 303 4445566',
    subject: 'Urdu',
    initials: 'AH',
    avatarTone: 'bg-[#41516f]',
  },
  {
    id: '0005',
    name: 'Momina',
    classLabel: 'VIII',
    email: 'momina.science@brightfuture.pk',
    phone: '+92 304 5556677',
    subject: 'Science',
    initials: 'MO',
    avatarTone: 'bg-[#5e4435]',
  },
  {
    id: '0006',
    name: 'Ahmad',
    classLabel: 'I (A)',
    email: 'ahmad.chem@labschool.pk',
    phone: '+92 305 6667788',
    subject: 'Chemistry',
    initials: 'AM',
    avatarTone: 'bg-[#263446]',
  },
  {
    id: '0007',
    name: 'Fariya',
    classLabel: 'IV',
    email: 'fariya.maths@educare.pk',
    phone: '+92 306 7778899',
    subject: 'Maths',
    initials: 'FA',
    avatarTone: 'bg-[#294964]',
  },
  {
    id: '0008',
    name: 'Zeeshan',
    classLabel: 'IX',
    email: 'zeeshan.bio@scholars.edu',
    phone: '+92 307 8889900',
    subject: 'Biology',
    initials: 'ZE',
    avatarTone: 'bg-[#3d2b68]',
  },
]
const subjectStyles = {
  Physics: 'bg-rose-100 text-rose-600',
  Computer: 'bg-rose-100 text-rose-600',
  English: 'bg-rose-100 text-rose-600',
  Urdu: 'bg-rose-100 text-rose-600',
  Science: 'bg-rose-100 text-rose-600',
  Chemistry: 'bg-rose-100 text-rose-600',
  Maths: 'bg-rose-100 text-rose-600',
  Biology: 'bg-rose-100 text-rose-600',
}

const Teachers = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('az')

  const filteredTeachers = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase()
    const filtered = TEACHERS.filter((teacher) => {
      if (!normalizedTerm) return true
      return (
        teacher.name.toLowerCase().includes(normalizedTerm) ||
        teacher.email.toLowerCase().includes(normalizedTerm) ||
        teacher.subject.toLowerCase().includes(normalizedTerm) ||
        teacher.classLabel.toLowerCase().includes(normalizedTerm) ||
        teacher.phone.toLowerCase().includes(normalizedTerm)
      )
    })

    return filtered.sort((current, next) => {
      if (sortOrder === 'za') {
        return next.name.localeCompare(current.name)
      }
      return current.name.localeCompare(next.name)
    })
  }, [searchTerm, sortOrder])

  const handleSortToggle = () => {
    setSortOrder((previous) => (previous === 'az' ? 'za' : 'az'))
  }

  return (
    <div className="h-full space-y-4 overflow-y-auto pr-1">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-[#253256]">Teachers</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d4d9e4] bg-white text-[#55637f] transition hover:bg-slate-50"
            aria-label="Print teachers"
          >
            <Printer className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-[#dce1eb] px-4 py-2 text-sm font-semibold text-[#475372] transition hover:bg-[#ced5e4]"
          >
            <FileDown className="h-4 w-4" />
            Export
          </button>
          <Link
            to="/teachers/add"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            <PlusCircle className="h-4 w-4" />
            Add Teacher
          </Link>
        </div>
      </div>

      <section className="rounded-2xl border border-[#d9dde7] bg-[#f2f3f5] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-[#263355]">Teachers Grid</h2>
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search"
                className="h-10 w-full rounded-lg border border-[#d4d8e3] bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary-400"
              />
            </label>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#d4d8e3] bg-white px-4 text-sm font-medium text-[#55637f] transition hover:bg-slate-50"
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button
              type="button"
              onClick={handleSortToggle}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#d4d8e3] bg-white px-4 text-sm font-medium text-[#55637f] transition hover:bg-slate-50"
            >
              <ArrowDownUp className="h-4 w-4" />
              Sort by {sortOrder === 'az' ? 'A-Z' : 'Z-A'}
            </button>
          </div>
        </div>

        <div className="my-4 h-px bg-[#d9dde7]" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
          {filteredTeachers.map((teacher) => (
            <article
              key={teacher.id}
              className="overflow-hidden rounded-xl border border-[#e0e4ea] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]"
            >
              <header className="flex items-center justify-between border-b border-[#e6e9ef] px-5 py-3">
                <p className="text-lg font-medium text-primary-600">ID.{teacher.id}</p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-green-100 px-2 py-1 text-sm font-semibold text-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Active
                  </span>
                  <button
                    type="button"
                    className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100"
                    aria-label={`More actions for ${teacher.name}`}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </header>

              <div className="space-y-4 px-5 py-4">
                <div className="flex items-center gap-3 rounded-xl bg-[#f1f3f7] px-4 py-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${teacher.avatarTone}`}
                  >
                    {teacher.initials}
                  </div>
                  <div>
                    <p className="text-xl font-bold leading-none text-[#263355]">{teacher.name}</p>
                    <p className="mt-1 text-sm text-[#5a6780]">{teacher.classLabel}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-[#727d93]">Email</p>
                  <p className="text-lg font-medium text-[#2e3b59]">{teacher.email}</p>
                </div>
                <div>
                  <p className="text-sm text-[#727d93]">Phone</p>
                  <p className="text-lg font-medium text-[#2e3b59]">{teacher.phone}</p>
                </div>
              </div>

              <footer className="flex items-center justify-between border-t border-[#e6e9ef] bg-[#fbfbfc] px-5 py-3">
                <span
                  className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${
                    subjectStyles[teacher.subject] || 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {teacher.subject}
                </span>
                <Link
                  to={`/teachers/${teacher.id}`}
                  className="inline-flex rounded-lg bg-[#e4e8f0] px-4 py-2 text-sm font-semibold text-[#4d5b79] transition hover:bg-[#d9dfeb]"
                >
                  View Details
                </Link>
              </footer>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Teachers
