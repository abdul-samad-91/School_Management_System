# School Management System - Frontend

Modern, responsive frontend application for the School Management System built with React, Vite, and Tailwind CSS.

## 🚀 Features

- ⚡ Fast development with Vite
- 🎨 Beautiful UI with Tailwind CSS
- 🔐 Secure authentication
- 📱 Fully responsive design
- 🎯 TypeScript-ready
- 📊 Data visualization with Recharts
- 🔄 Real-time updates with React Query
- 🎭 Smooth animations
- 🌙 Modern component library
- 📝 Form validation with React Hook Form

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Routing
- **Zustand** - State management
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Recharts** - Charts and graphs
- **Sonner** - Toast notifications
- **Axios** - HTTP client

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Table.jsx
│   │   └── ...
│   └── ...
│
├── layouts/
│   ├── AuthLayout.jsx   # Auth pages layout
│   └── DashboardLayout.jsx  # Dashboard layout
│
├── pages/
│   ├── auth/            # Authentication pages
│   ├── students/        # Student management
│   ├── teachers/        # Teacher management
│   ├── academic/        # Academic pages
│   ├── attendance/      # Attendance pages
│   ├── exams/           # Exam pages
│   ├── fees/            # Fee management
│   ├── communication/   # Communication pages
│   ├── users/           # User management
│   ├── settings/        # Settings pages
│   └── Dashboard.jsx    # Main dashboard
│
├── lib/
│   ├── api.js           # API client & functions
│   └── utils.js         # Utility functions
│
├── store/
│   └── authStore.js     # Authentication state
│
├── App.jsx              # Main app component
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## 🎨 UI Components

### Button
```jsx
import Button from '@/components/ui/Button'

<Button variant="primary" size="md">
  Click me
</Button>
```

Variants: `primary`, `secondary`, `danger`, `success`, `outline`, `ghost`
Sizes: `sm`, `md`, `lg`

### Input
```jsx
import Input from '@/components/ui/Input'

<Input
  label="Username"
  placeholder="Enter username"
  error={errors.username?.message}
  {...register('username')}
/>
```

### Card
```jsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Modal
```jsx
import Modal from '@/components/ui/Modal'

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="md"
>
  Modal content
</Modal>
```

### Table
```jsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## 🔌 API Integration

### Using API Functions

```jsx
import { studentsAPI } from '@/lib/api'
import { useQuery, useMutation } from '@tanstack/react-query'

// Fetch data
const { data, isLoading } = useQuery({
  queryKey: ['students'],
  queryFn: async () => {
    const response = await studentsAPI.getAll()
    return response.data
  }
})

// Mutate data
const mutation = useMutation({
  mutationFn: studentsAPI.create,
  onSuccess: () => {
    // Handle success
  }
})
```

### Available API Modules

- `authAPI` - Authentication
- `schoolAPI` - School profile
- `studentsAPI` - Student management
- `teachersAPI` - Teacher management
- `academicAPI` - Academic operations
- `attendanceAPI` - Attendance
- `examsAPI` - Exams and results
- `feesAPI` - Fee management
- `communicationAPI` - Announcements
- `usersAPI` - User management
- `dashboardAPI` - Dashboard stats

## 🗂️ State Management

### Auth Store (Zustand)

```jsx
import { useAuthStore } from '@/store/authStore'

function Component() {
  const { user, token, setAuth, logout } = useAuthStore()
  
  return <div>Hello {user?.profile?.firstName}</div>
}
```

## 🎯 Routing

Routes are defined in `App.jsx`:

```
/login                  - Login page
/                       - Dashboard
/students               - Students list
/students/add           - Add student
/students/:id           - Student details
/teachers               - Teachers list
/academic/sessions      - Academic sessions
/academic/classes       - Classes
/attendance             - Mark attendance
/exams                  - Exams list
/fees/structures        - Fee structures
/fees/payments          - Fee payments
/communication/announcements - Announcements
/users                  - User management
/settings/school        - School profile
/settings/profile       - User profile
```

## 🎨 Styling

### Tailwind CSS

The project uses Tailwind CSS for styling. Custom configuration in `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        // ... color palette
      },
    },
  },
}
```

### Utility Functions

```jsx
import { cn } from '@/lib/utils'

// Merge Tailwind classes
<div className={cn('base-class', conditional && 'conditional-class')} />

// Format date
import { formatDate } from '@/lib/utils'
formatDate(date, 'PP') // Dec 26, 2024

// Format currency
import { formatCurrency } from '@/lib/utils'
formatCurrency(1000) // $1,000.00

// Get status color
import { getStatusColor } from '@/lib/utils'
<Badge className={getStatusColor('active')}>Active</Badge>
```

## 🔐 Protected Routes

Routes are protected using the `ProtectedRoute` component:

```jsx
const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore()
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  return children
}
```

## 📱 Responsive Design

The application is fully responsive:
- Mobile: Single column layout
- Tablet: Adjusted grid layouts
- Desktop: Full multi-column layout
- Collapsible sidebar on mobile

## 🎭 Animations

Smooth transitions and animations using Tailwind CSS:

```jsx
<div className="transition-colors duration-200 hover:bg-gray-100">
  Hover me
</div>
```

## 🧪 Development

### Hot Module Replacement (HMR)
Vite provides instant HMR for fast development.

### Linting
```bash
npm run lint
```

### Build
```bash
npm run build
```

The build output will be in the `dist` directory.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
vercel
```

### Deploy to Netlify
```bash
netlify deploy --prod --dir=dist
```

### Environment Variables
Set the following environment variables in your hosting platform:
- `VITE_API_URL` - Your backend API URL

## 📦 Dependencies

### Core
- react
- react-dom
- react-router-dom

### State & Data
- zustand
- @tanstack/react-query
- axios

### UI & Styling
- tailwindcss
- lucide-react
- recharts
- sonner

### Forms
- react-hook-form

### Utilities
- clsx
- tailwind-merge
- date-fns

## 🔧 Configuration Files

- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `.eslintrc.cjs` - ESLint configuration

## 🎯 Best Practices

1. **Component Organization**
   - Keep components small and focused
   - Use composition over inheritance
   - Extract reusable logic into hooks

2. **State Management**
   - Use Zustand for global state
   - Use React Query for server state
   - Use local state for component-specific data

3. **Performance**
   - Lazy load routes
   - Memoize expensive computations
   - Use React Query caching

4. **Code Quality**
   - Follow ESLint rules
   - Use TypeScript (optional)
   - Write meaningful comments

5. **Styling**
   - Use Tailwind utility classes
   - Keep custom CSS minimal
   - Use the `cn()` utility for conditional classes

## 🐛 Troubleshooting

### Port already in use
Change the port in `vite.config.js`:
```js
server: {
  port: 3000,
}
```

### API connection issues
Check your `.env` file and ensure `VITE_API_URL` is correct.

### Build errors
Clear cache and reinstall:
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)
- [TanStack Query Documentation](https://tanstack.com/query)

## 🤝 Contributing

1. Follow the existing code style
2. Write meaningful commit messages
3. Test your changes
4. Update documentation

## 📄 License

MIT License

---

**Happy Coding! 🚀**

