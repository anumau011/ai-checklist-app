# Testing Guide for AI Checklist App

## Frontend Testing

### Manual Testing Checklist

#### Authentication
- [ ] Registration with valid email and password
- [ ] Registration fails with invalid email
- [ ] Registration fails with password < 6 characters
- [ ] Login with correct credentials
- [ ] Login fails with incorrect credentials
- [ ] Token persists on page reload
- [ ] Logout clears token and redirects to login

#### Checklist Creation
- [ ] Click quick topics work
- [ ] Input topic and click Start
- [ ] Q&A interface shows 3 questions
- [ ] Selected options are highlighted
- [ ] Back button works
- [ ] Generate button disables when no option selected

#### Checklist Board
- [ ] Checklist displays with correct title
- [ ] Progress bar updates correctly
- [ ] Checkboxes toggle items
- [ ] Items show strikethrough when done
- [ ] Progress percentage updates
- [ ] Reset button clears all items
- [ ] Can add new sections
- [ ] Can add new items to sections

#### My Checklists Page
- [ ] All checklists display as cards
- [ ] Each card shows progress
- [ ] Click card opens checklist
- [ ] Delete button removes checklist
- [ ] Empty state shows when no checklists

### API Testing with Curl

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Generate Questions (replace TOKEN)
curl -X POST http://localhost:3000/api/checklist/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"topic":"React learning"}'

# Get All Checklists
curl -X GET http://localhost:3000/api/checklist/all \
  -H "Authorization: Bearer TOKEN"
```

### Browser DevTools Testing

1. **Network Tab**
   - Check all API requests
   - Verify JWT token in headers
   - Check response status codes

2. **Console Tab**
   - Look for errors or warnings
   - Check API error messages

3. **Application Tab (Storage)**
   - Verify token stored in localStorage
   - Check localStorage key: `token`

---

## Backend Testing

### Unit Test Ideas

```javascript
// User Model Tests
describe('User Model', () => {
  it('should hash password before saving')
  it('should fail password comparison with wrong password')
  it('should require unique email')
  it('should require email and password')
})

// Checklist Model Tests
describe('Checklist Model', () => {
  it('should create checklist with sections and items')
  it('should associate checklist with user')
  it('should update timestamp on save')
})
```

### Integration Tests

```javascript
// Auth Routes Tests
describe('Auth Routes', () => {
  it('POST /api/auth/register should create user and return token')
  it('POST /api/auth/login should return token for valid credentials')
  it('GET /api/auth/validate should verify JWT token')
})

// Checklist Routes Tests
describe('Checklist Routes', () => {
  it('POST /api/checklist/questions should return 3 questions')
  it('POST /api/checklist/generate should create checklist in DB')
  it('GET /api/checklist/all should return user checklists only')
})
```

### API Testing with Postman

1. **Create Collection**: "AI Checklist App"
2. **Add Requests**:
   - POST Register
   - POST Login
   - POST Generate Questions
   - POST Generate Checklist
   - GET All Checklists
   - PUT Update Item
   - DELETE Checklist

3. **Set Environment Variables**:
   - `base_url`: http://localhost:3000/api
   - `token`: (auto-fill from login response)

---

## Database Testing

### MongoDB Compass Queries

```javascript
// Check users
db.users.find({})

// Check checklists
db.checklists.find({})

// Find user's checklists
db.checklists.find({ userId: ObjectId("...") })

// Check document count
db.checklists.countDocuments()
```

### Mongoose Connection Test

```javascript
// In backend/src/server.js
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err))
```

---

## Performance Testing

### Load Testing Ideas

```bash
# Using Apache Bench
ab -n 100 -c 10 http://localhost:5173/

# Using hey
hey -n 100 -c 10 http://localhost:5173/
```

### Bundle Size

```bash
# Frontend
cd frontend
npm run build
# Check dist/ folder size

# Analyze bundle (install rollup-plugin-visualizer)
npm run build -- --analyze
```

---

## Security Testing

### CORS Testing
```bash
# Should work
curl -X GET http://localhost:3000/api/health

# Should fail from different origin
curl -X GET http://localhost:3000/api/checklist/all \
  -H "Origin: http://evil.com"
```

### JWT Testing
```bash
# Expired token
curl -X GET http://localhost:3000/api/checklist/all \
  -H "Authorization: Bearer expired_token"

# Invalid token
curl -X GET http://localhost:3000/api/checklist/all \
  -H "Authorization: Bearer invalid.token.here"

# No token
curl -X GET http://localhost:3000/api/checklist/all
```

### Password Hashing Test
```javascript
// Should be different from plain password
const password = "mypassword";
const hashed = await bcrypt.hash(password, 10);
// hashed should NOT equal password
```

---

## Error Handling Testing

### Test Cases

1. **Network Errors**
   - [ ] Backend down
   - [ ] Database down
   - [ ] Timeout errors

2. **Validation Errors**
   - [ ] Missing fields
   - [ ] Invalid email
   - [ ] Short password

3. **Authorization Errors**
   - [ ] No token
   - [ ] Expired token
   - [ ] Invalid token

4. **Not Found Errors**
   - [ ] Nonexistent user
   - [ ] Nonexistent checklist

---

## Browser Compatibility

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers

---

## Accessibility Testing

- [ ] Tab navigation works
- [ ] Form labels present
- [ ] Colors have sufficient contrast
- [ ] Error messages clear
- [ ] Keyboard navigation functional

---

## Performance Metrics

Target metrics:
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.8s
- **API Response Time**: < 200ms
- **Bundle Size**: < 100KB (gzipped)

---

## Testing Tools

### Frontend
- Vitest
- React Testing Library
- Cypress (E2E)
- Playwright (E2E)

### Backend
- Jest
- Supertest
- MongoDB Memory Server

---

## Continuous Integration Ideas

```yaml
# GitHub Actions example
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
      - run: npm run build
```

---

## Test Scenarios

### Happy Path
1. User registers ✓
2. User logs in ✓
3. User creates checklist ✓
4. User completes items ✓
5. User views all checklists ✓

### Error Path
1. User tries invalid password ✗
2. User tries to access others' checklists ✗
3. Backend returns error ✗

---

This testing guide ensures comprehensive coverage of all features and edge cases.
