# Finyx Development Guide

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git
- Supabase account
- Clerk account
- Google Cloud account (for Gemini AI)

### Environment Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd finyx
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file with:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_GEMINI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

4. Start development server:
```bash
npm run dev
```

## Development Guidelines

### Component Development
- Place components in appropriate directories:
  - UI components in `components/ui/`
  - Route-specific components in `app/(routes)/`
  - Auth components in `app/(auth)/`
- Use Tailwind CSS for styling
- Implement proper loading states
- Add error boundaries
- Follow accessibility guidelines

### State Management
- Use React hooks for local state
- Implement proper data fetching
- Handle loading and error states
- Maintain clean state updates

### API Integration

#### Supabase
```javascript
import { supabase } from "@/utils/dbConfig";

// Example query
const { data, error } = await supabase
  .from('Budgets')
  .select('*')
  .eq('createdBy', userEmail);
```

#### Gemini AI
```javascript
import { getFinancialAdvice } from "@/utils/getFinancialAdvice";

// Example usage
const advice = await getFinancialAdvice(totalBudget, totalIncome, totalSpend);
```

## Testing

### Manual Testing Checklist
- [ ] Authentication flows
- [ ] Budget CRUD operations
- [ ] Expense tracking
- [ ] AI advice generation
- [ ] Responsive design
- [ ] Error handling

## Migration to Vite + Express

### Phase 1: Backend Setup
1. Create Express server
2. Migrate Supabase operations
3. Implement authentication middleware
4. Set up API routes

### Phase 2: Frontend Migration
1. Set up Vite
2. Update build configuration
3. Migrate components
4. Update routing
5. Implement API integration

## Best Practices

### Code Quality
- Use consistent naming conventions
- Write meaningful comments
- Create reusable components
- Implement proper error handling
- Follow Tailwind CSS best practices

### Performance
- Optimize images
- Implement code splitting
- Use proper caching
- Minimize bundle size
- Optimize database queries

### Security
- Protect sensitive routes
- Validate user input
- Secure API endpoints
- Handle sensitive data properly
- Implement proper authentication checks

## Debugging

### Common Issues
1. Authentication
   - Check Clerk configuration
   - Verify environment variables
   - Check protected routes

2. Database
   - Verify Supabase connection
   - Check permissions
   - Validate queries

3. AI Integration
   - Check API key
   - Verify rate limits
   - Handle timeouts

## Contributing

### Process
1. Create feature branch
2. Implement changes
3. Test thoroughly
4. Update documentation
5. Submit pull request

### Pull Request Guidelines
- Clear description
- Proper formatting
- Documentation updates
- Test coverage
- Code review responses