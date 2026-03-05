import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '../../components/ui/Button'

const Toggle = ({ label, defaultChecked = false }) => {
  return (
    <div className="flex   gap-4 flex-col">
      <span className="text-lg font-medium text-gray-700">{label}</span>
      <div className="flex items-center justify-between gap-10 px-4 py-2 bg-gray-200 rounded">
        <span className="text-lg font-semibold text-gray-900">OFF</span>
        <label className="relative inline-flex cursor-pointer items-center ">
          <input type="checkbox" className="peer sr-only" defaultChecked={defaultChecked} />
          <span className="h-3 w-9 rounded-full bg-gray-500 transition-colors peer-checked:bg-primary-600" />
          <span className="absolute left-0.2 top-0.2 h-5 w-5 rounded-full bg-gray-300 transition-transform peer-checked:translate-x-4" />
        </label>
      </div>
    </div>
  )
}

const SchoolProfile = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>

      <div className="rounded-2xl bg-gray-100 p-5">
        <h2 className="text-center text-3xl font-semibold text-gray-700">School Profile</h2>

        <div className="mt-4 grid gap-4 ">
          <Input label="School Name" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
          
        </div>
        <div className="grid gap-4 md:grid-cols-2">
            <Input label="Phone" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
            <Input label="Email" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
          </div>
          <Input label="School Registration Number" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
          <Input label="School Logo" type="file" labelClassName="text-lg" className="bg-gray-200/70 border-transparent file:mr-3 file:rounded-md file:border-0 file:bg-gray-200 file:px-3 file:py-1 file:text-xs file:font-medium" />

        <div className="mt-4">
          <label className="mb-1 block text-lg font-medium text-gray-900">Address</label>
          <textarea
            rows="3"
            className="w-full rounded-lg border-2 border-transparent bg-gray-200/70 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"

          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-gray-100 p-5">
          <h2 className="text-center text-2xl font-semibold text-gray-900">School Academic</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {/* <Select
              label="Academic Session"
              placeholder="Select"
              options={[
                { label: '2023 - 2024', value: '2023-2024' },
                { label: '2024 - 2025', value: '2024-2025' },
              ]}
              className="bg-gray-200/70"
            /> */}
            <Input label="Academic Session" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
            <Select
              label="Grading System"
              placeholder="Select"
              labelClassName="text-lg"
              options={[
                { label: 'A-F', value: 'af' },
                { label: 'GPA', value: 'gpa' },
              ]}
              className="bg-gray-200/70"
            />
            <Input label="Passing Marks" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
            <Select
              label="Exam Type"
              labelClassName="text-lg"
              placeholder="Select"
              options={[
                { label: 'Mid Term', value: 'mid' },
                { label: 'Final', value: 'final' },
              ]}
              className="bg-gray-200/70 "
            />
          </div>
        </div>

        <div className="rounded-2xl bg-gray-100 p-5">
          <h2 className="text-center text-2xl font-semibold text-gray-700">Notifications</h2>
          <div className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-2 ">

            <Toggle label="Email Notification" />
            <Toggle label="SMS Alerts" />
            <Toggle label="Reminder Days" />

            {/* <Input label="Reminder Days" className="bg-gray-200/70 border-transparent" /> */}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-gray-100 p-5">
        <h2 className="text-center text-2xl font-semibold text-gray-700">Fees & Finance</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Select
            label="Currency"
            placeholder="Select"
            labelClassName="text-lg"
            options={[
              { label: 'USD', value: 'usd' },
              { label: 'PKR', value: 'pkr' },
              { label: 'EUR', value: 'eur' },
            ]}
            className="bg-gray-200/70"
          />
          <Select
            label="Late Fee Fine"
            placeholder="Select"
            labelClassName="text-lg"
            options={[
              { label: 'USD', value: 'usd' },
              { label: 'PKR', value: 'pkr' },
              { label: 'EUR', value: 'eur' },
            ]}
            className="bg-gray-200/70"
          />
          <Input label="Late Fee Fine" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
          <Input label="Receipt Prefix" placeholder="FEE-02-26" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
        </div>
          <Input label="Allow Partial Payments" placeholder="" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
      </div>


       <div className="rounded-2xl bg-gray-100 p-5">
        <h2 className="text-center text-2xl font-semibold text-gray-700">User Security</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
        
          
          <Input label="Password Policy" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
          <Input label="Session Timeout" placeholder="FEE-02-26" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
          <Input label="Enable Two-Factor Authentication" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
          <Input label="Login Attempts Limit" placeholder="FEE-02-26" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
        </div>
          
      </div>

      
       <div className="rounded-2xl bg-gray-100 p-5">
        <h2 className="text-center text-2xl font-semibold text-gray-700">System</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
        
          
          <Input label="Date Format" placeholder="Select" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
          <Input label="Time zone" placeholder="FEE-02-26" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
          <Input label="Language" placeholder="Select" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
          <Input label="Theme" placeholder="Select" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
        </div>
          
      </div>

      <div className='flex items-center justify-end gap-3 '>
        <Button variant='outline' className=" px-6 py-2 rounded">Cancel</Button>
        <Button variant='outline' className=" px-6 py-2 rounded ">Edit</Button>
        <Button  variant='primary' className=" px-6 py-2 rounded ">Save</Button>
      </div>

    </div>
  )
}

export default SchoolProfile

