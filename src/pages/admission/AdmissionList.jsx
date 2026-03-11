import { Calendar, Download, Edit2, Search, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import printer from '@/assets/printer.svg'
import edit from '@/assets/edit.svg'
import trash from '@/assets/Trash.svg'


const stats = [
  { label: 'New Adms', value: '200', subtext: '50% of School', tone: 'bg-blue-50 border-blue-200 text-blue-700' },
  { label: 'Recent Adms', value: '100', subtext: '20% of School', tone: 'bg-green-50 border-green-200 text-green-700' },
  { label: 'Pending Adms', value: '20', subtext: '10% of School', tone: 'bg-red-50 border-red-200 text-red-700' },
  { label: 'T.Students', value: '1100', subtext: 'In School', tone: 'bg-amber-50 border-amber-200 text-amber-700' },
]

const rows = [
  { id: '7191', student: 'Ahmad Ali', father: 'Ali Khan', contact: '0337875725', status: 'Active' },
  { id: '3379', student: 'Bilal Akbar', father: 'Akbar Khan', contact: '0337875725', status: 'Active' },
  { id: '3633', student: 'Fatima Niaz', father: 'Niaz Hussain', contact: '0337875725', status: 'Active' },
  { id: '2802', student: 'Nayyab Hussain', father: 'Hussain Iqbal', contact: '0337875725', status: 'Active' },
  { id: '6788', student: 'Sadia Hassan', father: 'Hassan Shah', contact: '0337875725', status: 'Active' },
  { id: '1080', student: 'Farhan Ali', father: 'Ali Akbar', contact: '0337875725', status: 'Active' },
  { id: '6899', student: 'Sanan Shah', father: 'Shayan Shah', contact: '0337875725', status: 'Active' },
  { id: '6999', student: 'Zaib Malik', father: 'Ali Malik', contact: '0337875725', status: 'Active' },
  { id: '6929', student: 'Zaib Shah', father: 'Ali zaman', contact: '0337435725', status: 'Active' },
  { id: '6919', student: 'Zaib Malik', father: 'Ali Malik', contact: '03378725', status: 'Active' },
]



const AdmissionList = () => {
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
              {rows.map((row) => (
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
              ))}
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