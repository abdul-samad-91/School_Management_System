import { useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import fileExport2 from '@/assets/fileExport2.svg'
import SortingArrow from '@/assets/SortingArrow.svg'
import printer from '@/assets/printer.svg'
import trash from '@/assets/Trash.svg'
import edit from '@/assets/edit.svg'
import { examsAPI } from '@/lib/api'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'

const Results = () => {
  const { data: resultsRaw = [], isLoading } = useQuery({
    queryKey: ['exam-results'],
    queryFn: async () => {
      const response = await examsAPI.getResults()
      return response.data?.data || []
    },
  })

  const resultsRows = resultsRaw.map((r, i) => ({
    id: r._id || i,
    name: `${r.student?.profile?.firstName || ''} ${r.student?.profile?.lastName || ''}`.trim() || r.student?.name || '',
    math: r.subjects?.find(s => /math/i.test(s.name))?.marks || r.marksObtained || '-',
    science: r.subjects?.find(s => /science/i.test(s.name))?.marks || '-',
    english: r.subjects?.find(s => /english/i.test(s.name))?.marks || '-',
    history: r.subjects?.find(s => /history/i.test(s.name))?.marks || '-',
    grade: r.grade || '-',
    total: r.totalMarks || r.maxMarks || 100,
    percentage: r.percentage ? `${r.percentage}%` : (r.marksObtained && r.totalMarks ? `${Math.round((r.marksObtained / r.totalMarks) * 100)}%` : '-'),
  }))

  const summaryCards = useMemo(() => {
    const pcts = resultsRaw.map(r => r.percentage || (r.marksObtained && r.totalMarks ? Math.round((r.marksObtained / r.totalMarks) * 100) : 0))
    const avg = pcts.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : 0
    return [
      { id: 'average', title: 'Class Average', value: `${avg}%`, subtitle: 'Overall Performance', valueClass: 'text-blue-600' },
      { id: 'top', title: 'Top Performers', value: pcts.filter(p => p >= 80).length, subtitle: 'Grade A or Above', valueClass: 'text-green-600' },
      { id: 'support', title: 'Need Support', value: pcts.filter(p => p < 50).length, subtitle: 'Below Average', valueClass: 'text-red-600' },
      { id: 'pass', title: 'Pass Rate', value: pcts.length ? `${Math.round((pcts.filter(p => p >= 50).length / pcts.length) * 100)}%` : '0%', subtitle: 'Above passing grade', valueClass: 'text-blue-600' },
    ]
  }, [resultsRaw]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Result</h1>
          <p className="text-base text-gray-800">Manage and track student academic performance</p>
        </div>
         <div className='flex items-center justify-center gap-3'>
           <img src={printer} alt="Printer" className="h-4 w-4" />
        <Button variant="secondary" size="sm" className="gap-2 rounded ">
          <img src={fileExport2} alt="Export" className="h-4 w-4" />
          Export
        </Button>
         </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.id} className="border border-gray-200 ">
            <CardContent className="space-y-1 flex flex-col items-start gap-4 ">
              <p className="text-xl font-semibold text-gray-800">{card.title}</p>
              <p className={`text-2xl font-semibold ${card.valueClass}`}>{card.value}</p>
              <p className="text-lg text-gray-500">{card.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gray-100">
        <CardHeader className="flex flex-wrap items-center justify-between gap-4 ">
          <div>
            <CardTitle className="text-2xl text-gray-900 ">Student Grades</CardTitle>
            <p className="text-lg text-gray-800">Academic performance tracking</p>
          </div>
          <div className="flex  items-center gap-3">
            <Select
              className="min-w-[140px]"
              placeholder="Select Class"
              options={[
                { label: 'Class 8-A', value: '8a' },
                { label: 'Class 9-A', value: '9a' },
              ]}
            />
            <Select
              className="min-w-[140px]"
              placeholder="Select Session"
              options={[
                { label: 'Session 2024', value: '2024' },
                { label: 'Session 2025', value: '2025' },
              ]}
            />
            <Select
              className="min-w-[140px]"
              placeholder="Select Exam"
              options={[
                { label: 'Mid Term', value: 'mid' },
                { label: 'Final', value: 'final' },
              ]}
            />
          </div>
        </CardHeader>

        <CardContent className="p-2">
          <Table className="bg-white ">
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <input type="checkbox" className="h-3.5 w-3.5" />
                </TableHead>
                <TableHead className="text-xs text-gray-700 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    Student Name
                    <img src={SortingArrow} alt="Sort" className="h-3.5 w-3.5" />
                  </span>
                </TableHead>
                <TableHead className="text-xs text-gray-700 whitespace-nowrap">Maths</TableHead>
                <TableHead className="text-xs text-gray-700 whitespace-nowrap">Science</TableHead>
                <TableHead className="text-xs text-gray-700 whitespace-nowrap">English</TableHead>
                <TableHead className="text-xs text-gray-700 whitespace-nowrap">History</TableHead>
                <TableHead className="text-xs text-gray-700 whitespace-nowrap">Grade</TableHead>
                <TableHead className="text-xs text-gray-700 whitespace-nowrap">Total Marks</TableHead>
                <TableHead className="text-xs text-gray-700 whitespace-nowrap">Percentage</TableHead>
                <TableHead className="text-right text-xs text-gray-700 whitespace-nowrap">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={10} className="py-10 text-center"><div className="flex justify-center"><div className="h-6 w-6 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" /></div></TableCell></TableRow>
              ) : resultsRows.length === 0 ? (
                <TableRow><TableCell colSpan={10} className="py-10 text-center text-sm text-gray-500">No results found.</TableCell></TableRow>
              ) : resultsRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <input type="checkbox" className="h-3.5 w-3.5" />
                  </TableCell>
                  <TableCell className="text-gray-700">{row.name}</TableCell>
                  <TableCell className="text-gray-600">{row.math}</TableCell>
                  <TableCell className="text-gray-600">{row.science}</TableCell>
                  <TableCell className="text-gray-600">{row.english}</TableCell>
                  <TableCell className="text-gray-600">{row.history}</TableCell>
                  <TableCell className="text-gray-600">{row.grade}</TableCell>
                  <TableCell className="text-gray-600">{row.total}</TableCell>
                  <TableCell className="text-gray-600">{row.percentage}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-2">
                      <button className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">View</span>
                        {/* <Eye className="h-4 w-4" /> */}
                        <img src={printer} alt="Print Icon" />
                      </button>
                      <button className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Edit</span>
                        {/* <Edit2 className="h-4 w-4" /> */}
                        <img src={trash} alt="Trash Icon" className='w-4 h-4'/>
                      </button>
                      <button className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Delete</span>
                        {/* <Trash2 className="h-4 w-4" /> */}
                        <img src={edit} alt="" className='w-4 h-4'/>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

<div className='flex items-center justify-end mt-6 mr-4'>
  <Button size="sm" className="gap-2 rounded px-4 py-2">
              <span className=' bg-white rounded'>
                <Plus className="h-3 w-3 text-primary-500" />
              </span>
              Add Student
            </Button>
</div>
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <button className="px-2 py-1 text-base">Prev</button>
              <button className="rounded-md bg-primary-500 px-2.5 py-1 text-white text-base">1</button>
              <button className="px-2 py-1 text-base">...</button>
              <button className="px-2 py-1 text-base">2</button>
              <button className="px-2 py-1 text-base">20</button>
              <button className="px-2 py-1 text-primary-500 text-base">Next</button>
            </div>
            
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Results

