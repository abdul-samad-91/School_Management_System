import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Select = forwardRef(({ 
  label, 
  error, 
  options = [],
  placeholder = 'Select',
  labelClassName,
  className,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className={cn("block text-sm font-medium text-gray-900 mb-1 ", labelClassName)}>
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={cn(  
          'block w-full rounded-lg border border-gray-300 bg-gray-50 px-2 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-gray-50 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      >
        {/* <option value="">{placeholder}</option> */}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select

