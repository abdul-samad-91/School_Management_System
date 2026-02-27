import { Link } from 'react-router-dom'
import { ArrowLeft, Upload } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Card, CardContent } from '@/components/ui/Card'
import Icon from '../../Assets/Icon.svg'
import Icons from '../../Assets/Icons.svg'

const AddStudent = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 bg-gray-50">
        <Link to="/students" className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50">
          {/* <ArrowLeft className="h-4 w-4" /> */}
          <img src={Icon} alt="Back Icon" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Student</h1>
          <p className="text-sm text-gray-600 mt-1">Students / Add Student</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6 ">
          <Card>
            <CardContent className="p-5 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <Input label="Student ID"  disabled /> 
                <Input label="Full Name" />
                <Input label="Date of Birth" type="text" />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Gender</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-base text-gray-700">
                    {/* <input type="radio" name="gender" className="h-4 w-4" /> */}
                    Male
                  </label>
                  <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-base text-gray-700">
                    {/* <input type="radio" name="gender" className="h-4 w-4" /> */}
                    Female
                  </label>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Profile Photo</p>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-primary-400 bg-primary-50/40 px-4 py-3">
                  <div>
                    <p className="text-base font-semibold text-gray-900">Drag And Drop Files Here Or Upload</p>
                    <p className="text-sm text-gray-500">Accepted file types: JPG, SVG, PNG 120 x 120 (px)</p>
                  </div>
                  <Button size="sm" className="gap-2 bg-primary-500" >
                    {/* <Upload className="h-4 w-4" /> */}
                    Upload
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Email Address" type="email"  />
                <Input label="Phone Number"  />
              </div>
              <Input label="Address" placeholder="Address" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-4 ">
              <h2 className="text-xl font-bold text-gray-900">Parent/Guardian Info</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                  <p className="text-xl font-medium text-gray-900">Father</p>
                  <Input label="Name" />
                  <Input label="Phone Number"  />
                </div>
                <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-900">Mother</p>
                  <Input label="Name"  />
                  <Input label="Phone Number" />
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-xl font-medium text-gray-900">Alternative Guardian (if any)</p>
                <div className="grid gap-4 md:grid-cols-3">
                  <Input label="Name"  />
                  <Input label="Relation" />
                  <Input label="Phone Number"  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-5 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Administration</h2>
              <Input label="Admission Number"  disabled />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Academic Information</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {/* <Select label="Class" options={[{ value: 'III', label: 'III' }]} />
                <Select label="Section" options={[{ value: 'A', label: 'A' }]} /> */}
                <Input label="Class"  />
                <Input label="Section"  />
              </div>
              <Input label="Enrollment Date" type="text" />
              <Input label="Previous School"  />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-4">
              <h2 className="text-base font-semibold text-gray-900">Documents</h2>
              <div className="flex  gap-2 rounded-lg border border-dashed border-primary-400 bg-primary-50/40 px-4 py-3">
               <img src={Icons} alt="" className='w-6 h-6'/>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Drag And Drop Files Here Or Upload</p>
                  <p className="text-xs text-gray-500">Accepted file types: JPG, SVG, PNG 120 x 120 (px)</p>
                </div>
                <Button size="sm" className=" bg-primary-500" >
                  {/* <Upload className="h-4 w-4" /> */}
                  Upload
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2>
              <Input label="Hobbies/Interests"  />
              <div className="space-y-2 text-sm text-gray-700">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4" />
                  Special Needs Support
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4" />
                  Medical Condition Alert
                </label>
              </div>
              <Input
                label="Notes"
                placeholder="Mild asthma - requires inhaler during support activities"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-primary-500 ">Save & Add</Button>
      </div>
    </div>
  )
}

export default AddStudent

