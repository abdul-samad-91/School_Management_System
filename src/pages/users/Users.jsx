import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import fileExport2 from '@/assets/fileExport2.svg'
import edit from '@/assets/edit.svg'
import trash from '@/assets/Trash.svg'
import SortVector from '@/assets/SortVector.svg'
import printer from '@/assets/printer.svg'
import dotsVertical from '@/assets/dotsVertical.svg'
import SortingArrow from '@/assets/SortingArrow.svg'
import logo from '@/assets/BookLogo1.png'
import { usersAPI } from '@/lib/api'
import { handleError } from '@/lib/utils'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'

const Users = () => {
  const queryClient = useQueryClient()
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', username: '', email: '', role: '', assignedClass: '', password: '', confirmPassword: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const { data: usersRaw = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await usersAPI.getAll()
      return response.data?.data || []
    },
  })

  const users = usersRaw
    .map((u) => ({
      id: u._id,
      displayId: u.employeeId || u.studentId || u._id?.slice(-4) || '',
      name: u.name || `${u.profile?.firstName || ''} ${u.profile?.lastName || ''}`.trim(),
      role: u.role || '',
      assignedClass: u.assignedClass || 'All',
      status: u.isActive !== false ? 'Active' : 'Inactive',
    }))
    .filter((u) => !searchTerm || u.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleFieldChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }))

  const handleAddUser = async () => {
    if (!formData.email || !formData.password || !formData.role) {
      toast.error('Email, password and role are required.')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }
    try {
      setIsSubmitting(true)
      await usersAPI.create({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        role: formData.role,
        assignedClass: formData.assignedClass,
        password: formData.password,
      })
      await queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User added successfully.')
      setIsAddUserOpen(false)
      setFormData({ name: '', username: '', email: '', role: '', assignedClass: '', password: '', confirmPassword: '' })
    } catch (error) {
      toast.error(handleError(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteUser = async (id) => {
    try {
      await usersAPI.delete(id)
      await queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User deleted.')
    } catch (error) {
      toast.error(handleError(error))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-4xl font-semibold text-gray-900">User Management</h1>
        <div className="flex items-center gap-3">
          <img src={printer} alt="Printer icon" className='w-4 h-4'/>
          <Button variant="secondary" size="sm" className="gap-2 rounded">
            <img src={fileExport2} alt="Export" className="h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="gap-2 rounded" onClick={() => setIsAddUserOpen(true)}>
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        title=""
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center ">
            <div className="flex items-center justify-center gap-2 text-xl font-semibold text-gray-900">
              <img src={logo} alt="Logo" className="h-14 w-16" />
              <span className="text-5xl font-serif font-semibold">SMS</span>
            </div>
            <p className="mt-4 text-3xl font-semibold text-gray-800">Add New User</p>
          </div>
          {/* <br /> */}

          <div className="grid grid-cols-2 gap-3 p-4">
            <Input label="Name" value={formData.name} onChange={(e) => handleFieldChange('name', e.target.value)} className="bg-gray-100 border-2 border-gray-900 rounded-xl " />
            <Input label="Username" value={formData.username} onChange={(e) => handleFieldChange('username', e.target.value)} className="bg-gray-100 border-2 border-gray-900 rounded-xl" />
            <Input label="Email" type="email" value={formData.email} onChange={(e) => handleFieldChange('email', e.target.value)} className="bg-gray-100 border-2 border-gray-900 rounded-xl" />
            <Input label="Role" value={formData.role} onChange={(e) => handleFieldChange('role', e.target.value)} className="bg-gray-100 border-2 border-gray-900 rounded-xl" />
            <Input label="Class" value={formData.assignedClass} onChange={(e) => handleFieldChange('assignedClass', e.target.value)} className="bg-gray-100 border-2 border-gray-900 rounded-xl" />
            <Input label="Access" className="bg-gray-100 border-2 border-gray-900 rounded-xl" />
            <Input label="Password" type="password" value={formData.password} onChange={(e) => handleFieldChange('password', e.target.value)} className="bg-gray-100 border-2 border-gray-900 rounded-xl" />
            <Input label="Confirm Password" type="password" value={formData.confirmPassword} onChange={(e) => handleFieldChange('confirmPassword', e.target.value)} className="bg-gray-100 border-2 border-gray-900 rounded-xl" />
          </div>

          <div className="flex items-center justify-end gap-3  px-4">
            <Button
              variant="outline"
              size="md"
              className="rounded  border border-gray-950 "
              onClick={() => setIsAddUserOpen(false)}
            >
              Cancel
            </Button>
            <Button size="md" className="rounded py-2 px-6" loading={isSubmitting} onClick={handleAddUser}>Save</Button>
          </div>
        </div>
      </Modal>

      <Card>
        <CardHeader className="flex  flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-2xl">Users</CardTitle>
          <div className="flex  items-center gap-2">
            <div className="">
              <Input
                placeholder="Search"
                leftIcon={<Search className="h-4 w-4" />}
                className="h-9 w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <img
                src={SortVector}
                alt="Sort"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              />
              <Select
                className="min-w-[140px] pl-9"
                placeholder="Sort by A-Z"
                options={[
                  { label: 'Sort by A-Z', value: 'az' },
                  { label: 'Sort by Z-A', value: 'za' },
                ]}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className='whitespace-nowrap text-sm'>Row Per Page</span>
              <Select
                className="w-[60px] h-9 "
                placeholder="10"
                options={[
                  { label: '10', value: '10' },
                  { label: '20', value: '20' },
                  { label: '50', value: '50' },
                ]}
              />
              <span>Entries</span>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="w-10">
                  <input type="checkbox" className="h-3.5 w-3.5" />
                </TableHead>
                <TableHead className="text-sm text-gray-700">
                  <span className="inline-flex items-center gap-1">
                    ID
                    <img src={SortingArrow} alt="Sort" className="h-3.5 w-3.5" />
                  </span>
                </TableHead>
                <TableHead className="text-gray-700 text-sm">
                  <span className="inline-flex items-center gap-1">
                    Name
                    <img src={SortingArrow} alt="Sort" className="h-3.5 w-3.5" />
                  </span>
                </TableHead>
                <TableHead className="text-gray-700 text-sm">
                  <span className="inline-flex items-center gap-1">
                    Role
                    <img src={SortingArrow} alt="Sort" className="h-3.5 w-3.5" />
                  </span>
                </TableHead>
                <TableHead className="text-gray-700">
                  <span className="inline-flex items-center gap-1">
                    Assigned Classs
                    <img src={SortingArrow} alt="Sort" className="h-3.5 w-3.5" />
                  </span>
                </TableHead>
                <TableHead className="text-gray-700 text-sm">Status</TableHead>
                <TableHead className="text-right text-sm text-gray-700">
                  <span className="inline-flex items-center gap-2">
                    Action
                    <img src={dotsVertical} alt="" className="h-4 w-4 cursor-pointer" />
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center">
                    <div className="flex justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-gray-500">No users found.</TableCell>
                </TableRow>
              ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <input type="checkbox" className="h-3.5 w-3.5" />
                  </TableCell>
                  <TableCell className="text-blue-600">{user.displayId}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell className="text-gray-600">{user.role}</TableCell>
                  <TableCell className="text-gray-600">{user.assignedClass}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'Active' ? 'success' : 'error'} className="gap-1 border-none rounded">
                      <span className={`h-1.5 w-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-2">
                      <button className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50" onClick={() => handleDeleteUser(user.id)}>
                        <span className="sr-only">Delete</span>
                        <img src={trash} alt="Delete" className="h-4 w-4" />
                      </button>
                      <button className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Edit</span>
                        <img src={edit} alt="Edit" className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-end gap-2 text-xs text-gray-500">
            <button className="px-2 py-1 text-sm">Pre</button>
            <button className="rounded-md bg-primary-600 px-2.5 py-1 text-white text-sm">1</button>
            <button className="px-2 py-1 text-sm">2</button>
            <button className="px-2 py-1 text-sm">...</button>
            <button className="px-2 py-1 text-sm">20</button>
            <button className="px-2 py-1 text-primary-500 text-sm">Next</button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Users

