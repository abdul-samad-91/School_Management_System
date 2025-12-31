import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { studentsAPI } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

const StudentDetails = () => {
  const { id } = useParams()
  
  const { data, isLoading } = useQuery({
    queryKey: ['student', id],
    queryFn: async () => {
      const response = await studentsAPI.getById(id)
      return response.data.data
    }
  })

  if (isLoading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Student Details</h1>
      <Card>
        <CardHeader>
          <CardTitle>{data?.profile?.firstName} {data?.profile?.lastName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Admission Number: {data?.admissionNumber}</p>
          <p>Status: {data?.status}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default StudentDetails

