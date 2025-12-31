import { useQuery } from '@tanstack/react-query'
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  DollarSign,
  TrendingUp,
  Calendar
} from 'lucide-react'
import { dashboardAPI } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { formatCurrency, formatDate } from '@/lib/utils'

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await dashboardAPI.getStats()
      return response.data.data
    }
  })

  const statCards = [
    {
      title: 'Total Students',
      value: stats?.students?.total || 0,
      subtitle: `${stats?.students?.newAdmissions || 0} new this month`,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Teachers',
      value: stats?.teachers?.total || 0,
      subtitle: 'Active staff members',
      icon: GraduationCap,
      color: 'bg-green-500'
    },
    {
      title: 'Total Classes',
      value: stats?.classes?.total || 0,
      subtitle: 'Active classes',
      icon: BookOpen,
      color: 'bg-purple-500'
    },
    {
      title: 'Fee Collection',
      value: formatCurrency(stats?.fees?.collection?.paid || 0),
      subtitle: 'This session',
      icon: DollarSign,
      color: 'bg-yellow-500'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening in your school today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Attendance Today */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.attendance?.today ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Present</span>
                  <span className="text-lg font-bold text-green-600">
                    {stats.attendance.today.present}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Absent</span>
                  <span className="text-lg font-bold text-red-600">
                    {stats.attendance.today.absent}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Late</span>
                  <span className="text-lg font-bold text-yellow-600">
                    {stats.attendance.today.late}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">On Leave</span>
                  <span className="text-lg font-bold text-blue-600">
                    {stats.attendance.today.leave}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No attendance data for today</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Exams */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Exams</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.upcomingExams && stats.upcomingExams.length > 0 ? (
              <div className="space-y-3">
                {stats.upcomingExams.map((exam, index) => (
                  <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary-600 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{exam.name}</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(exam.startDate, 'PPP')}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {exam.classes?.map(c => c.name).join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No upcoming exams</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Session */}
      {stats?.activeSession && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Academic Session</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {stats.activeSession.name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {formatDate(stats.activeSession.startDate, 'PP')} - {formatDate(stats.activeSession.endDate, 'PP')}
                </p>
              </div>
              <div className="bg-green-100 px-4 py-2 rounded-lg">
                <span className="text-green-800 font-medium text-sm">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Dashboard

