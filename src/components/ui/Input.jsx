import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Input = forwardRef(({ 
  label, 
  error, 
  className,
  labelClassName,
  type = 'text',
  leftIcon,
  rightIcon,
  rightIconAriaLabel = 'Toggle input visibility',
  onRightIconClick,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className={cn('block text-sm font-medium text-gray-900 ', labelClassName)}>
          {label}
          {props.required && <span className="text-black-900 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'block w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-gray-50 disabled:cursor-not-allowed',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {rightIcon && onRightIconClick && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={rightIconAriaLabel}
            onClick={onRightIconClick}
          >
            {rightIcon}
          </button>
        )}
        {rightIcon && !onRightIconClick && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input

