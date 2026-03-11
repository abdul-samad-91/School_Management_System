import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Upload } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Card, CardContent } from '@/components/ui/Card'
import Icon from '@/assets/Icon.svg'
import Icons from '@/assets/Icons.svg'

const AddStudent = () => {
  const [profileFile, setProfileFile] = useState(null)
  const [documentFiles, setDocumentFiles] = useState([])
  const profileInputRef = useRef(null)
  const documentsInputRef = useRef(null)

  const handleProfileChange = (event) => {
    const file = event.target.files?.[0] || null
    setProfileFile(file)
  }

  const handleDocumentsChange = (event) => {
    const files = Array.from(event.target.files || [])
    setDocumentFiles(files)
  }

  return (
    <div className="space-y-6 ">
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

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr] ">
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
                  <label className="flex items-center gap-2 rounded-lg border-2 border-gray-200 px-3 py-2 text-base text-gray-700">
                    <input type="radio" name="gender" className="h-4 w-4" />
                    Male
                  </label>
                  <label className="flex items-center gap-2 rounded-lg border-2 border-gray-200 px-3 py-2 text-base text-gray-700">
                    <input type="radio" name="gender" className="h-4 w-4 " />
                    Female
                  </label>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Profile Photo</p>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border-2 border-dashed border-primary-400 bg-primary-50/40 px-4 py-3">
                  <div>
                    <p className="text-base font-semibold text-gray-900">Drag And Drop Files Here Or Upload</p>
                    <p className="text-sm text-gray-500">Accepted file types: JPG, SVG, PNG 120 x 120 (px)</p>
                    {profileFile && (
                      <p className="mt-1 text-sm text-gray-700">Selected: {profileFile.name}</p>
                    )}
                  </div>
                  <input
                    ref={profileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml"
                    className="hidden"
                    onChange={handleProfileChange}
                  />
                  <Button
                    size="sm"
                    className="gap-2 bg-primary-500"
                    onClick={() => profileInputRef.current?.click()}
                    type="button"
                  >
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
                  <p className="text-lg font-medium text-gray-900">Father</p>
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
                  {documentFiles.length > 0 && (
                    <p className="mt-1 text-xs text-gray-700">
                      Selected: {documentFiles.map((file) => file.name).join(', ')}
                    </p>
                  )}
                </div>
                <input
                  ref={documentsInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,application/pdf"
                  className="hidden"
                  multiple
                  onChange={handleDocumentsChange}
                />
                <Button
                  size="sm"
                  className=" bg-primary-500"
                  onClick={() => documentsInputRef.current?.click()}
                  type="button"
                >
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
                <label className="relative inline-flex cursor-pointer items-center gap-2 ">
          <input type="checkbox" className="peer sr-only" />
          <span className="h-3 w-9 rounded-full bg-gray-500 transition-colors peer-checked:bg-primary-600" />
          <span className="absolute left-0.2 top-0.2 h-5 w-5 rounded-full bg-gray-300 transition-transform peer-checked:translate-x-4" />
          Special Needs Support
        </label>
              <div>
                 <label className="relative inline-flex cursor-pointer gap-3 items-center ">
          <input type="checkbox" className="peer sr-only" />
          <span className="h-3 w-9 rounded-full bg-gray-500 transition-colors peer-checked:bg-primary-600" />
          <span className="absolute left-0.2 top-0.2 h-5 w-5 rounded-full bg-gray-300 transition-transform peer-checked:translate-x-4" />
          Medical Conditions Alert
        </label>
              </div>

              </div>
              {/* <Input
                label="Notes"
                placeholder="Mild asthma - requires inhaler during support activities"
              /> */}
              <div className='border-2 w-full h-20 p-2 rounded-lg border-gray-200'>
                <p className= "text-sm text-gray-800">Mild asthma - requires inhaler during support activities</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Link to="/students" className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
          Cancel
          </Link>
        <Button className="bg-primary-500 ">Save & Add</Button>
      </div>
    </div>
  )
}

export default AddStudent

