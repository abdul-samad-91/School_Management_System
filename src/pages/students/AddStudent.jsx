import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Card, CardContent } from '@/components/ui/Card'
import { academicAPI, studentsAPI } from '@/lib/api'
import Icon from '@/assets/Icon.svg'
import Icons from '@/assets/Icons.svg'

const AddStudent = () => {
  const navigate = useNavigate()
  const [profileFile, setProfileFile] = useState(null)
  const [documentFiles, setDocumentFiles] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    studentId: `STD${new Date().getFullYear()}${Date.now().toString().slice(-5)}`,
    fullName: '',
    dateOfBirth: '',
    gender: 'male',
    email: '',
    phoneNumber: '',
    address: '',
    fatherName: '',
    fatherPhone: '',
    motherName: '',
    motherPhone: '',
    guardianName: '',
    guardianRelation: '',
    guardianPhone: '',
    admissionNumber: '',
    classId: '',
    section: '',
    sessionId: '',
    enrollmentDate: '',
    previousSchool: '',
    hobbies: '',
    specialNeedsSupport: false,
    medicalConditionsAlert: false,
    notes: '',
  })
  const profileInputRef = useRef(null)
  const documentsInputRef = useRef(null)

  const { data: classesRaw, isLoading: isClassesLoading, error: classesError } = useQuery({
    queryKey: ['academic-classes-for-student-form'],
    queryFn: async () => {
      const response = await academicAPI.getClasses()
      return response.data?.data || []
    },
  })

  const { data: sessionsRaw, isLoading: isSessionsLoading, error: sessionsError } = useQuery({
    queryKey: ['academic-sessions-for-student-form'],
    queryFn: async () => {
      const response = await academicAPI.getSessions()
      return response.data?.data || []
    },
  })

  useEffect(() => {
    if (classesError) {
      const message = classesError?.response?.data?.message || 'Unable to load classes.'
      toast.error(message)
    }
  }, [classesError])

  useEffect(() => {
    if (sessionsError) {
      const message = sessionsError?.response?.data?.message || 'Unable to load sessions.'
      toast.error(message)
    }
  }, [sessionsError])

  const classOptions = useMemo(() => {
    const classes = Array.isArray(classesRaw) ? classesRaw : []
    return [
      { value: '', label: 'Select class' },
      ...classes.map((classItem) => ({
        value: classItem._id,
        label: classItem.level ? `${classItem.name} (${classItem.level})` : classItem.name,
      })),
    ]
  }, [classesRaw])

  const selectedClass = useMemo(() => {
    const classes = Array.isArray(classesRaw) ? classesRaw : []
    return classes.find((classItem) => classItem._id === formData.classId) || null
  }, [classesRaw, formData.classId])

  const sectionOptions = useMemo(() => {
    const sections = selectedClass?.sections || []
    return [
      { value: '', label: 'Select section' },
      ...sections.map((sectionItem) => ({
        value: sectionItem.name,
        label: sectionItem.name,
      })),
    ]
  }, [selectedClass])

  const sessionOptions = useMemo(() => {
    const sessions = Array.isArray(sessionsRaw) ? sessionsRaw : []
    return [
      { value: '', label: 'Select session' },
      ...sessions.map((sessionItem) => ({
        value: sessionItem._id,
        label: sessionItem.name,
      })),
    ]
  }, [sessionsRaw])

  const hasClasses = classOptions.length > 1
  const hasSections = sectionOptions.length > 1

  const updateField = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }))
  }

  const handleProfileChange = (event) => {
    const file = event.target.files?.[0] || null
    setProfileFile(file)
  }

  const handleDocumentsChange = (event) => {
    const files = Array.from(event.target.files || [])
    setDocumentFiles(files)
  }

  const buildParentPayload = () => {
    const parents = []

    if (formData.fatherName.trim() && formData.fatherPhone.trim()) {
      const [firstName, ...lastNameParts] = formData.fatherName.trim().split(/\s+/)
      parents.push({
        relationship: 'father',
        firstName,
        lastName: lastNameParts.join(' '),
        phone: formData.fatherPhone.trim(),
        isPrimary: true,
      })
    }

    if (formData.motherName.trim() && formData.motherPhone.trim()) {
      const [firstName, ...lastNameParts] = formData.motherName.trim().split(/\s+/)
      parents.push({
        relationship: 'mother',
        firstName,
        lastName: lastNameParts.join(' '),
        phone: formData.motherPhone.trim(),
      })
    }

    if (formData.guardianName.trim() && formData.guardianPhone.trim()) {
      const [firstName, ...lastNameParts] = formData.guardianName.trim().split(/\s+/)
      parents.push({
        relationship: 'guardian',
        firstName,
        lastName: lastNameParts.join(' '),
        phone: formData.guardianPhone.trim(),
      })
    }

    return parents
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) return

    const trimmedName = formData.fullName.trim()
    if (!trimmedName) {
      toast.error('Full name is required.')
      return
    }

    const [firstName, ...lastNameParts] = trimmedName.split(/\s+/)
    const lastName = lastNameParts.join(' ')

    if (!lastName) {
      toast.error('Please enter both first and last name.')
      return
    }

    if (!formData.dateOfBirth) {
      toast.error('Date of birth is required.')
      return
    }

    if (!formData.classId || !formData.section || !formData.sessionId) {
      toast.error('Class, section, and session are required.')
      return
    }

    if (!formData.enrollmentDate) {
      toast.error('Enrollment date is required.')
      return
    }

    if (!profileFile) {
      toast.error('Profile photo is required.')
      return
    }

    if (!documentFiles.length) {
      toast.error('At least one document is required.')
      return
    }

    const parents = buildParentPayload()
    if (!parents.length) {
      toast.error('Provide at least one parent/guardian with phone number.')
      return
    }

    const requestData = new FormData()

    if (formData.admissionNumber.trim()) {
      requestData.append('admissionNumber', formData.admissionNumber.trim())
    }

    requestData.append(
      'profile',
      JSON.stringify({
        firstName,
        lastName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        email: formData.email.trim() || undefined,
        phone: formData.phoneNumber.trim() || undefined,
        address: formData.address.trim()
          ? {
              current: {
                street: formData.address.trim(),
              },
            }
          : undefined,
      })
    )

    requestData.append('parents', JSON.stringify(parents))

    requestData.append(
      'academic',
      JSON.stringify({
        currentClass: formData.classId,
        currentSection: formData.section,
        session: formData.sessionId,
        admissionDate: formData.enrollmentDate,
        previousSchool: {
          name: formData.previousSchool.trim() || undefined,
        },
      })
    )

    if (formData.guardianName.trim() && formData.guardianPhone.trim()) {
      requestData.append(
        'emergencyContact',
        JSON.stringify({
          name: formData.guardianName.trim(),
          relationship: formData.guardianRelation.trim() || 'guardian',
          phone: formData.guardianPhone.trim(),
        })
      )
    }

    if (formData.specialNeedsSupport || formData.medicalConditionsAlert || formData.notes.trim()) {
      requestData.append(
        'medical',
        JSON.stringify({
          conditions: formData.medicalConditionsAlert && formData.notes.trim() ? [formData.notes.trim()] : [],
          specialNeeds: formData.specialNeedsSupport ? 'Requires support' : undefined,
        })
      )
    }

    requestData.append('photo', profileFile)
    documentFiles.forEach((file) => {
      requestData.append('documents', file)
    })

    setIsSubmitting(true)
    try {
      await studentsAPI.create(requestData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success('Student added successfully.')
      navigate('/students')
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to add student.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-6 " onSubmit={handleSubmit}>
      <div className="flex flex-wrap items-center gap-3 ">
        <Link to="/students" className="rounded-lg border border-gray-200 p-2 text-gray-600 bg-white hover:bg-gray-50">
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
                <Input label="Student ID" value={formData.studentId} disabled /> 
                <Input label="Full Name" value={formData.fullName} onChange={(event) => updateField('fullName', event.target.value)} />
                <Input label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={(event) => updateField('dateOfBirth', event.target.value)} />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Gender</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-2 rounded-lg border-2 border-gray-200 px-3 py-2 text-base text-gray-700">
                    <input type="radio" name="gender" className="h-4 w-4" checked={formData.gender === 'male'} onChange={() => updateField('gender', 'male')} />
                    Male
                  </label>
                  <label className="flex items-center gap-2 rounded-lg border-2 border-gray-200 px-3 py-2 text-base text-gray-700">
                    <input type="radio" name="gender" className="h-4 w-4 " checked={formData.gender === 'female'} onChange={() => updateField('gender', 'female')} />
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
                <Input label="Email Address" type="email" value={formData.email} onChange={(event) => updateField('email', event.target.value)} />
                <Input label="Phone Number" value={formData.phoneNumber} onChange={(event) => updateField('phoneNumber', event.target.value)} />
              </div>
              <Input label="Address" placeholder="Address" value={formData.address} onChange={(event) => updateField('address', event.target.value)} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-4 ">
              <h2 className="text-xl font-bold text-gray-900">Parent/Guardian Info</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                  <p className="text-lg font-medium text-gray-900">Father</p>
                  <Input label="Name" value={formData.fatherName} onChange={(event) => updateField('fatherName', event.target.value)} />
                  <Input label="Phone Number" value={formData.fatherPhone} onChange={(event) => updateField('fatherPhone', event.target.value)} />
                </div>
                <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-900">Mother</p>
                  <Input label="Name" value={formData.motherName} onChange={(event) => updateField('motherName', event.target.value)} />
                  <Input label="Phone Number" value={formData.motherPhone} onChange={(event) => updateField('motherPhone', event.target.value)} />
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-xl font-medium text-gray-900">Alternative Guardian (if any)</p>
                <div className="grid gap-4 md:grid-cols-3">
                  <Input label="Name" value={formData.guardianName} onChange={(event) => updateField('guardianName', event.target.value)} />
                  <Input label="Relation" value={formData.guardianRelation} onChange={(event) => updateField('guardianRelation', event.target.value)} />
                  <Input label="Phone Number" value={formData.guardianPhone} onChange={(event) => updateField('guardianPhone', event.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-5 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Administration</h2>
              <Input label="Admission Number" value={formData.admissionNumber} onChange={(event) => updateField('admissionNumber', event.target.value)} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Academic Information</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Select
                  label="Class"
                  options={classOptions}
                  disabled={isClassesLoading}
                  value={formData.classId}
                  onChange={(event) => {
                    updateField('classId', event.target.value)
                    updateField('section', '')
                  }}
                />
                <Select
                  label="Section"
                  options={sectionOptions}
                  disabled={!formData.classId || !hasSections}
                  value={formData.section}
                  onChange={(event) => updateField('section', event.target.value)}
                />
              </div>
              {!isClassesLoading && !hasClasses && (
                <p className="text-xs text-amber-700">No classes found. Create class records first or check your academics view permission.</p>
              )}
              {formData.classId && !hasSections && (
                <p className="text-xs text-amber-700">No sections found for the selected class. Add sections in Academic Class setup.</p>
              )}
              <Select
                label="Academic Session"
                options={sessionOptions}
                disabled={isSessionsLoading}
                value={formData.sessionId}
                onChange={(event) => updateField('sessionId', event.target.value)}
              />
              <Input label="Enrollment Date" type="date" value={formData.enrollmentDate} onChange={(event) => updateField('enrollmentDate', event.target.value)} />
              <Input label="Previous School" value={formData.previousSchool} onChange={(event) => updateField('previousSchool', event.target.value)} />
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
              <Input label="Hobbies/Interests" value={formData.hobbies} onChange={(event) => updateField('hobbies', event.target.value)} />
              <div className="space-y-2 text-sm text-gray-700">
                <label className="relative inline-flex cursor-pointer items-center gap-2 ">
          <input type="checkbox" className="peer sr-only" checked={formData.specialNeedsSupport} onChange={(event) => updateField('specialNeedsSupport', event.target.checked)} />
          <span className="h-3 w-9 rounded-full bg-gray-500 transition-colors peer-checked:bg-primary-600" />
          <span className="absolute left-0.2 top-0.2 h-5 w-5 rounded-full bg-gray-300 transition-transform peer-checked:translate-x-4" />
          Special Needs Support
        </label>
              <div>
                 <label className="relative inline-flex cursor-pointer gap-3 items-center ">
          <input type="checkbox" className="peer sr-only" checked={formData.medicalConditionsAlert} onChange={(event) => updateField('medicalConditionsAlert', event.target.checked)} />
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
              <textarea
                value={formData.notes}
                onChange={(event) => updateField('notes', event.target.value)}
                className='border-2 w-full h-20 p-2 rounded-lg border-gray-200 text-sm text-gray-800 focus:border-primary-500 focus:outline-none'
                placeholder='Medical notes (optional)'
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Link to="/students" className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
          Cancel
          </Link>
        <Button className="bg-primary-500 " type="submit" loading={isSubmitting}>
          Save & Add
        </Button>
      </div>
    </form>
  )
}

export default AddStudent

