import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Plus , Printer} from 'lucide-react'
import { useRef } from 'react';
import UserLogo from '@/assets/AddUserMale.svg'

const AddmissionFrom = () => {
  const [showForm, setShowForm] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    console.log('Admission form submit:', data)
  }

   const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click(); // trigger hidden input
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Selected file:', file.name);
    }
  };

  return (
    <div className="space-y-6 " >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Addmissions</h1>
          <div className="flex gap-3 items-center">
            <p className="text-base text-gray-500 mt-1">Admission</p> /
            <p className="text-base text-gray-500 mt-1">Admission Form</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="bg-gray-200 hover:bg-gray-300 text-gray-900">
            Select Academic Section
          </Button>
          <Button className="flex gap-2 bg-primary-500 " onClick={() => setShowForm(true)}>
            <span className="bg-white w-4 h-4 rounded flex items-center justify-center">
              <Plus className="h-4 w-4 text-black" />
            </span>
            Add Student
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="bg-[#EFF6FF] rounded-lg shadow-sm p-6">
            <h2 className="text-3xl  text-center font-bold text-gray-900">Student Admission Form</h2>
          <div className="flex items-start justify-end mb-4">
            <Button variant="secondary" className="text-base flex items-center gap-3">
              Print Form
              <Printer className="w-4 h-4 text-gray-500 " />
              </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-4">
            <div className="grid grid-cols-[1fr_120px] gap-20">
              <div>
              <div className="grid grid-cols-2 gap-4 ">
                <Input 
                className='bg-gray-200 '
                  label="Student First Name"
                  labelClassName="text-lg "
                  required
                  placeholder="Type Here"
                  error={errors.studentFirstName?.message}
                  {...register('studentFirstName', { required: 'First name is required' })}
                />
                <Input
                className='bg-gray-200'
                  label="Student Last Name"
                  labelClassName="text-lg"
                  required
                  placeholder="Type Here"
                  error={errors.studentLastName?.message}
                  {...register('studentLastName', { required: 'Last name is required' })}
                />
                </div>
<div className='grid grid-cols-3 gap-4 mt-2'>
  
                <Input
                className='bg-gray-200'
                  label="Gender"
                  labelClassName="text-lg"
                  required
                  placeholder="Type Here"
                  error={errors.gender?.message}
                  {...register('gender', { required: 'Gender is required' })}
                />
                <Input
                className='bg-gray-200 flex items-center gap-2 justify-center text-gray-500'
                  label="Date of Birth"
                  labelClassName="text-lg"
                  required
                  type="date"
                  error={errors.dateOfBirth?.message}
                  {...register('dateOfBirth', { required: 'Date of birth is required' })}
                />

                <Input
                className='bg-gray-200'
                  label="Religion"
                  labelClassName="text-lg"
                  required
                  placeholder="Type Here"
                  error={errors.religion?.message}
                  {...register('religion')}
                />
</div>
               <div className="grid grid-cols-2 gap-4 mt-2">
                 <Input
                className='bg-gray-200'
                  label="CNIC"
                  labelClassName="text-lg"
                  required
                  placeholder="Type Here"
                  error={errors.cnic?.message}
                  {...register('cnic')}
                />

                <Input
                className='bg-gray-200'
                  label="Nationality"
                  labelClassName="text-lg"
                  required
                  placeholder="Type Here"
                  error={errors.nationality?.message}
                  {...register('nationality')}
                />
               </div>

                
              </div>

            

              <div className="flex flex-col items-center gap-2 ">
                <div className="h-40 w-40 rounded-full bg-gray-200 flex items-center justify-center">
             <img
        src={UserLogo}
        alt="Upload Logo"
        className="w-24 h-24 cursor-pointer rounded-full border"
        onClick={handleClick} // trigger file input
      />

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden" // hide it from view
      />
                </div>
                {/* <Button type="button" variant="outline" className="text-xs">
                  Upload
                </Button> */}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Parents Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                className='bg-gray-200'
                  label="Father Name"
                  labelClassName="text-lg"
                  required
                  placeholder="Type Here"
                  error={errors.fatherName?.message}
                  {...register('fatherName')}
                />
                <Input
                  className='bg-gray-200'
                  label="Mother Name"
                  labelClassName="text-lg"
                  required
                  placeholder="Type Here"
                  error={errors.motherName?.message}
                  {...register('motherName')}
                />

                <Input
                  className='bg-gray-200'
                  label="Father CNIC"
                  labelClassName="text-lg"
                  required
                  placeholder="Type Here"
                  error={errors.fatherCnic?.message}
                  {...register('fatherCnic')}
                />
                <Input
                  className='bg-gray-200'
                  label="Mother CNIC"
                  labelClassName="text-lg"
                  required
                  placeholder="Type Here"
                  error={errors.motherCnic?.message}
                  {...register('motherCnic')}
                />

                <Input
                  className='bg-gray-200'
                  label="Father Occupation"
                  labelClassName="text-lg"
                  required
                  placeholder="Type Here"
                  error={errors.fatherOccupation?.message}
                  {...register('fatherOccupation')}
                />
                <Input
                  className='bg-gray-200'
                  label="Mother Occupation"
                  labelClassName="text-lg"
                  required
                  placeholder="Type Here"
                  error={errors.motherOccupation?.message}
                  {...register('motherOccupation')}
                />

                <Input
                className='bg-gray-200'
                  label="Father Contact Number"
                  labelClassName="text-lg"
                  required
                  placeholder="Type Here"
                  error={errors.fatherContact?.message}
                  {...register('fatherContact')}
                />
                <Input
                className='bg-gray-200'
                  label="Mother Contact Number"
                  labelClassName="text-lg"
                  required
                  placeholder="Type Here"
                  error={errors.motherContact?.message}
                  {...register('motherContact')}
                />

                <div className="col-span-2">
                  <label className="block text-lg font-medium text-gray-700 mb-1">
                    Address<span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-200"
                    placeholder="Type Here"
                    rows="3"
                    required
                    {...register('address')}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Guardian Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                className='bg-gray-200'
                  label="Name"
                  labelClassName="text-lg"
                  required
                  placeholder="Type Here"
                  error={errors.guardianName?.message}
                  {...register('guardianName')}
                />
                <Input
                className='bg-gray-200'
                  label="CNIC"
                  labelClassName="text-lg"
                  required
                  placeholder="Type Here"
                  error={errors.guardianCnic?.message}
                  {...register('guardianCnic')}
                />

                <Input
                className='bg-gray-200'
                  label="Occupation"
                  labelClassName="text-lg"
                  required
                  placeholder="Type Here"
                  error={errors.guardianOccupation?.message}
                  {...register('guardianOccupation')}
                />
                <Input
                className='bg-gray-200'
                  label="Contact Number"
                  labelClassName="text-lg"
                  required
                  placeholder="Type Here"
                  error={errors.guardianContact?.message}
                  {...register('guardianContact')}
                />

                <Input
                className='bg-gray-200'
                  label="Alternative Contact Number"
                  labelClassName="text-lg"
                  required
                  placeholder="Type Here"
                  error={errors.guardianAltContact?.message}
                  {...register('guardianAltContact')}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="px-6 bg-primary-500">
                Save
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default AddmissionFrom