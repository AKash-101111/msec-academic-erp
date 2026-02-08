# Design System Migration Guide

## 🎨 New Design System Applied

### Color Palette

**Light Mode (Default):**
- **Primary:** `#111827` (Soft black) - Headers, important text
- **Secondary:** `#6366F1` (Indigo) - Buttons, links, accents
- **Accent:** `#22C55E` (Fresh green) - Success states, highlights
- **Background:** `#F9FAFB` - Main background
- **Surface:** `#FFFFFF` - Cards, panels

**Dark Mode:**
- **Background:** `#030712` - Main background
- **Surface:** `#111827` - Cards, panels
- **Text:** `#E5E7EB` - Body text

### Typography
- **Font Family:** Source Sans 3 (replacing Inter)
- Extremely readable with excellent screen rendering
- Variable font weights: 300, 400, 600, 700

### Icons
- **Library:** Tabler Icons (replacing Lucide React)
- **Style:** Outline icons
- **Stroke Width:** 2 (default)

---

## 🔄 Icon Migration Reference

Replace Lucide imports with Tabler icons using this mapping:

### From Lucide to Tabler

```javascript
// OLD (Lucide)
import { Icon } from 'lucide-react';

// NEW (Tabler)
import { Icon } from '@tabler/icons-react';
```

### Icon Name Mappings

| Lucide Icon | Tabler Icon | Usage |
|-------------|-------------|-------|
| `GraduationCap` | `IconSchool` | Education/academics |
| `Calendar` | `IconCalendar` | Dates/schedule |
| `Trophy` | `IconTrophy` | Achievements |
| `BarChart3` | `IconChartBar` | Analytics |
| `Download` | `IconDownload` | Downloads |
| `ChevronRight` | `IconChevronRight` | Navigation |
| `ChevronLeft` | `IconChevronLeft` | Navigation |
| `ChevronDown` | `IconChevronDown` | Dropdowns |
| `ChevronUp` | `IconChevronUp` | Collapse |
| `AlertTriangle` | `IconAlertTriangle` | Warnings |
| `CheckCircle` | `IconCircleCheck` | Success |
| `TrendingUp` | `IconTrendingUp` | Positive metrics |
| `TrendingDown` | `IconTrendingDown` | Negative metrics |
| `Minus` | `IconMinus` | Neutral |
| `Award` | `IconAward` | Honors |
| `Code` | `IconCode` | Programming |
| `Medal` | `IconMedal` | Rankings |
| `Star` | `IconStar` | Favorites |
| `BookOpen` | `IconBook` | Reading/courses |
| `Briefcase` | `IconBriefcase` | Internships |
| `Eye` | `IconEye` | Show password |
| `EyeOff` | `IconEyeOff` | Hide password |
| `ArrowRight` | `IconArrowRight` | Forward action |
| `ArrowLeft` | `IconArrowLeft` | Back action |
| `FileSpreadsheet` | `IconFileSpreadsheet` | Excel files |
| `Mail` | `IconMail` | Email |
| `Phone` | `IconPhone` | Contact |
| `User` | `IconUser` | Profile |
| `Search` | `IconSearch` | Search |
| `Filter` | `IconFilter` | Filtering |
| `X` | `IconX` | Close/remove |
| `Users` | `IconUsers` | Multiple users |
| `Upload` | `IconUpload` | File upload |
| `AlertCircle` | `IconAlertCircle` | Info/alert |
| `Bell` | `IconBell` | Notifications |
| `Menu` | `IconMenu2` | Hamburger menu |
| `Home` | `IconHome` | Dashboard |
| `Settings` | `IconSettings` | Settings |
| `LogOut` | `IconLogout` | Sign out |
| `Sun` | `IconSun` | Light mode |
| `Moon` | `IconMoon` | Dark mode |

### Migration Example

**Before:**
```jsx
import { GraduationCap, Calendar, Trophy } from 'lucide-react';

function Component() {
  return (
    <div>
      <GraduationCap className="w-6 h-6" />
      <Calendar className="w-5 h-5" />
      <Trophy className="w-4 h-4" />
    </div>
  );
}
```

**After:**
```jsx
import { IconSchool, IconCalendar, IconTrophy } from '@tabler/icons-react';

function Component() {
  return (
    <div>
      <IconSchool className="w-6 h-6" stroke={2} />
      <IconCalendar className="w-5 h-5" stroke={2} />
      <IconTrophy className="w-4 h-4" stroke={2} />
    </div>
  );
}
```

---

## 🌓 Dark Mode Implementation

### Using the Dark Mode Hook

```jsx
import { useDarkMode } from '../hooks/useDarkMode';

function MyComponent() {
  const { isDark, toggleDarkMode } = useDarkMode();
  
  return (
    <button onClick={toggleDarkMode}>
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
```

### Dark Mode Toggle Component

Already created: `src/components/UI/DarkModeToggle.jsx`

Add to your Header:
```jsx
import DarkModeToggle from '../UI/DarkModeToggle';

function Header() {
  return (
    <header>
      {/* existing header content */}
      <DarkModeToggle />
    </header>
  );
}
```

### Styling for Dark Mode

Use Tailwind's `dark:` variant:

```jsx
<div className="bg-white dark:bg-primary-950 text-primary-900 dark:text-primary-100">
  Content adapts to theme
</div>
```

### Color Class Reference

**Primary (Soft Black):**
- `bg-primary-900` / `dark:bg-primary-900` → #111827
- `text-primary-900` / `dark:text-primary-100`

**Secondary (Indigo):**
- `bg-secondary` → #6366F1
- `text-secondary-600` → #4F46E5
- `ring-secondary-500` → Focus rings

**Accent (Fresh Green):**
- `bg-accent` → #22C55E
- `text-accent-600` → #16A34A
- `border-accent-500` → Borders

**Backgrounds:**
- Light: `bg-app` (#F9FAFB) or `bg-surface` (#FFFFFF)
- Dark: `dark:bg-app-dark` (#030712) or `dark:bg-surface-dark` (#111827)

---

## 📋 Quick Start Checklist

- [x] Tailwind config updated with new colors
- [x] Dark mode enabled (`darkMode: 'class'`)
- [x] Source Sans 3 font loaded
- [x] Tabler Icons package installed
- [x] Dark mode hook created
- [x] Dark mode toggle component created
- [ ] Replace Lucide imports with Tabler icons
- [ ] Add DarkModeToggle to Header
- [ ] Update component styles for dark mode
- [ ] Test all pages in both light and dark mode

---

## 🎯 Next Steps

1. **Update Icon Imports:** Go through each component and replace Lucide with Tabler icons using the mapping above
2. **Add Dark Mode Toggle:** Import and add `<DarkModeToggle />` to your Header component
3. **Review Styling:** Check all components and add `dark:` variants where needed
4. **Test:** Verify the app looks great in both light and dark modes

---

## 💡 Pro Tips

- Students prefer dark mode - make it discoverable!
- Use `transition-colors duration-200` for smooth theme transitions
- Test color contrast in both themes for accessibility
- The accent green (`#22C55E`) pops beautifully on dark backgrounds
- Tabler icons look sharp at stroke={2} with the clean Source Sans 3 font
