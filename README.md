# Finance Dashboard

A modern, responsive finance dashboard built with React, Vite, and Tailwind CSS. Track your income, expenses, and gain valuable financial insights.

## Live 
  https://finance-theta-teal.vercel.app/

## Features

### Dashboard Overview
- **Summary Cards**: Display Total Balance, Income, and Expenses for the current month
- **Balance Trend Chart**: Visualize your balance, income, and expenses over the past 6 months
- **Spending Breakdown**: Interactive donut chart with categorized spending visualization

### Transactions
- Full transaction list with date, category, description, and amount
- **Search** functionality for finding specific transactions
- **Filter** by transaction type (Income/Expense)
- **Filter** by category
- **Sort** by date, amount, or category
- **Add**, **Edit**, and **Delete** transactions (Admin only)
- Responsive card view on mobile devices

### Role-Based UI
- **Viewer Mode**: Read-only access to all dashboard features
- **Admin Mode**: Full CRUD operations on transactions
- Toggle between roles using the header switcher

### Insights
- Highest spending category analysis
- Monthly spending comparison (up/down from last month)
- Savings rate calculation with feedback

### Additional Features
- **Dark Mode**: Toggle between light and dark themes
- **Data Persistence**: Transactions and preferences saved to localStorage
- **Export**: Download transactions as JSON
- **Responsive Design**: Fully optimized for mobile, tablet, iPad, and desktop
- **Smooth Animations**: Polished transitions and micro-interactions

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **React Context** - State management

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
client/
├── src/
│   ├── components/         # React components
│   │   ├── BalanceChart.tsx      # Line chart for balance trends
│   │   ├── CategoryChart.tsx     # Donut chart for spending breakdown
│   │   ├── Dashboard.tsx         # Main dashboard layout
│   │   ├── Header.tsx            # Navigation header
│   │   ├── Insights.tsx          # Financial insights cards
│   │   ├── SummaryCards.tsx      # Balance/Income/Expense cards
│   │   ├── TransactionForm.tsx   # Add/Edit transaction modal
│   │   └── Transactions.tsx      # Transaction list with filters
│   ├── context/           # React Context for state
│   │   └── AppContext.tsx        # Main app state & logic
│   ├── data/              # Mock data
│   │   └── mockData.ts          # Sample transactions & categories
│   ├── App.tsx            # Root component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── index.html              # HTML template
├── package.json
├── tailwind.config.js      # Tailwind configuration
└── vite.config.ts         # Vite configuration
```

## State Management

The app uses React Context with localStorage persistence for:

| State | Description |
|-------|-------------|
| `transactions` | Array of all transactions |
| `filters` | Category, type, and search filters |
| `sortBy` | Current sort field (date/amount/category) |
| `sortOrder` | Sort direction (asc/desc) |
| `role` | Current role (viewer/admin) |
| `darkMode` | Theme preference |

## Responsive Breakpoints

| Breakpoint | Screen Size |
|------------|-------------|
| Mobile | < 640px |
| Tablet | 640px - 768px |
| iPad | 768px - 1024px |
| Desktop | > 1024px |

## Key Features Explained

### Role-Based Access Control
The dashboard simulates RBAC with two roles:
- **Viewer**: Can view all data, search, filter, and export
- **Admin**: Full access including add, edit, and delete operations

### Data Persistence
All data is automatically saved to localStorage:
- Transactions are saved on every change
- Role preference persists across sessions
- Dark mode setting is remembered
- Filters and sort preferences are maintained

### Export Functionality
Click the Export button to download all transactions as a JSON file, useful for backup or analysis.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for personal or commercial purposes.

---

Built with ❤️ using React, Vite, and Tailwind CSS
