import { Calendar, Download, Search } from 'lucide-react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import printer from '@/assets/printer.svg'
import edit from '@/assets/edit.svg'
import trash from '@/assets/Trash.svg'
import { studentsAPI } from '@/lib/api'

const AdmissionList = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const { data: studentsRaw = [], isLoading } = useQuery({
    queryKey: ['admissions'],
    queryFn: async () => {
      const response = await studentsAPI.getAll()
      return response.data?.data || []
    },
  })

  const rows = studentsRaw
    .map((s) => ({
      id: s.admissionNo || s._id?.slice(-4) || '',
      student: `${s.profile?.firstName || ''} ${s.profile?.lastName || ''}`.trim(),
      father: s.parent?.fatherName || '',
      contact: s.parent?.fatherPhone || s.parent?.phone || '',
      status: s.status === 'active' ? 'Active' : s.status || 'Active',
    }))
    .filter((r) => !searchTerm || r.student.toLowerCase().includes(searchTerm.toLowerCase()))

  const stats = [
    { label: 'New Adms', value: studentsRaw.filter(s => s.status === 'new').length || studentsRaw.length, subtext: 'In School', tone: 'bg-blue-50 border-blue-200 text-blue-700' },
    { label: 'Recent Adms', value: studentsRaw.filter(s => {
      const d = new Date(s.createdAt); const now = new Date(); return (now - d) < 30 * 24 * 60 * 60 * 1000
    }).length, subtext: 'Last 30 days', tone: 'bg-green-50 border-green-200 text-green-700' },
    { label: 'Pending Adms', value: studentsRaw.filter(s => s.status === 'pending').length, subtext: 'Pending review', tone: 'bg-red-50 border-red-200 text-red-700' },
    { label: 'T.Students', value: studentsRaw.length, subtext: 'Total in School', tone: 'bg-amber-50 border-amber-200 text-amber-700' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Admissions List</h1>
          <p className="text-sm text-gray-500">Admissions / Admissions List</p>
        </div>
       <div className='flex gap-4 cursor-pointer items-center'>
         <img src={printer} alt="Component" className='bg-transparent w-6 h-6'/>
        <Button variant="secondary" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
       </div>
      </div>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className={`border ${stat.tone}`}>
            <CardContent className="px-5 py-4">
              {/* <p className="text-2xl  font-medium text-gray-700">{stat.label}</p> */}
              <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
              <p className="mt-1 text-base text-gray-500">{stat.subtext}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Student Admissions List</h2>
            </div>
            <div className="flex  items-center   gap-2">
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="Date"
                  type="text"
                  className="h-9 w-36 rounded-lg border border-gray-300 pl-9 pr-3 text-sm "
                />
              </div>
              <Select
                options={[{ value: '2024-2025', label: '2024-2025' }]}
                className="h-9 w-40"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap">
              <span className="whitespace-nowrap">Row Per Page</span>
              <Select
                options={[
                  { value: '10', label: '10' },
                  { value: '20', label: '20' },
                  { value: '50', label: '50' },
                ]}
                className="h-9 w-20"
              />
              <span>Entries</span>
            </div>
            <div className="w-full sm:w-56">
              <Input
                placeholder="Search"
                leftIcon={<Search className="h-4 w-4" />}
                className="h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>

        <div className="border-t border-gray-200">
          <Table>
            <TableHeader className="bg-gray-100 ">
              <TableRow>
                <TableHead className="w-10">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                </TableHead>
                <TableHead className= "font-bold text-gray-700">Adm No.</TableHead>
                <TableHead className="font-bold text-gray-700">Student Name</TableHead>
                <TableHead className="font-bold text-gray-700">Father Name</TableHead>
                <TableHead className="font-bold text-gray-700">Contact No.</TableHead>
                <TableHead className="font-bold text-gray-700">Status</TableHead>
                <TableHead className="font-bold text-gray-700">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="py-10 text-center"><div className="flex justify-center"><div className="h-6 w-6 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" /></div></TableCell></TableRow>
              ) : rows.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="py-10 text-center text-sm text-gray-500">No admissions found.</TableCell></TableRow>
              ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="w-10">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                  </TableCell>
                  <TableCell className="text-primary-600">{row.id}</TableCell>
                  <TableCell>{row.student}</TableCell>
                  <TableCell>{row.father}</TableCell>
                  <TableCell>{row.contact}</TableCell>
                  <TableCell>
                    <Badge variant="success">{row.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button className="rounded border border-gray-200 p-1 text-gray-600 hover:bg-gray-50">
                        {/* <Trash2 className="h-4 w-4" /> */}
                        <img src={trash} alt="Delete" className="h-4 w-4" />
                      </button>
                      <button className="rounded border border-gray-200 p-1 text-gray-600 hover:bg-gray-50">
                        {/* <Edit2 className="h-4 w-4" /> */}
                        <img src={edit} alt="Edit" className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 text-sm text-gray-500">
          <span>Pre</span>
          <button className="h-6 w-6 rounded bg-primary-600 text-white">1</button>
          <span>2</span>
          <span>...</span>
          <span>20</span>
          <span>Next</span>
        </div>
      </Card>
    </div>
  )
}

export default AdmissionList