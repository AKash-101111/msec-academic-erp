// Example component showcasing the new design system
import { IconSchool, IconChartBar, IconTrophy } from '@tabler/icons-react';

export default function DesignSystemExample() {
  return (
    <div className="min-h-screen bg-app dark:bg-app-dark p-8 transition-colors">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-primary-900 dark:text-white mb-4">
          Progressive Campus ERP
        </h1>
        <p className="text-lg text-primary-600 dark:text-primary-300">
          Built for students who value innovation
        </p>
      </section>

      {/* Cards Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {/* Primary Card */}
        <div className="bg-surface dark:bg-surface-dark p-6 rounded-2xl shadow-lg border border-primary-200 dark:border-primary-700 hover:shadow-xl transition-all">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center mb-4">
            <IconSchool className="w-6 h-6 text-secondary" stroke={2} />
          </div>
          <h3 className="text-xl font-semibold text-primary-900 dark:text-white mb-2">
            Academics
          </h3>
          <p className="text-primary-600 dark:text-primary-400">
            Track your courses, grades, and academic progress in real-time
          </p>
          <button className="mt-4 btn-primary w-full">
            View Details
          </button>
        </div>

        {/* Accent Card */}
        <div className="bg-surface dark:bg-surface-dark p-6 rounded-2xl shadow-lg border border-primary-200 dark:border-primary-700 hover:shadow-xl transition-all">
          <div className="w-12 h-12 rounded-xl bg-accent/10 dark:bg-accent/20 flex items-center justify-center mb-4">
            <IconTrophy className="w-6 h-6 text-accent" stroke={2} />
          </div>
          <h3 className="text-xl font-semibold text-primary-900 dark:text-white mb-2">
            Achievements
          </h3>
          <p className="text-primary-600 dark:text-primary-400">
            Showcase internships, projects, and extracurricular activities
          </p>
          <button className="mt-4 btn-accent w-full">
            Explore
          </button>
        </div>

        {/* Analytics Card */}
        <div className="bg-surface dark:bg-surface-dark p-6 rounded-2xl shadow-lg border border-primary-200 dark:border-primary-700 hover:shadow-xl transition-all">
          <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-800 flex items-center justify-center mb-4">
            <IconChartBar className="w-6 h-6 text-primary-700 dark:text-primary-300" stroke={2} />
          </div>
          <h3 className="text-xl font-semibold text-primary-900 dark:text-white mb-2">
            Analytics
          </h3>
          <p className="text-primary-600 dark:text-primary-400">
            Visualize your performance with smart analytics and insights
          </p>
          <button className="mt-4 px-6 py-2.5 rounded-lg border-2 border-primary-300 dark:border-primary-700 text-primary-900 dark:text-white font-semibold hover:bg-primary-100 dark:hover:bg-primary-800 transition-all">
            View Stats
          </button>
        </div>
      </div>

      {/* Status Badges */}
      <div className="max-w-4xl mx-auto mt-12 flex gap-4 flex-wrap">
        <span className="status-success px-4 py-2 rounded-lg font-medium">
          ✓ Above 75% Attendance
        </span>
        <span className="status-warning px-4 py-2 rounded-lg font-medium">
          ⚠ Pending Assignment
        </span>
        <span className="status-danger px-4 py-2 rounded-lg font-medium">
          ! Low CGPA Alert
        </span>
      </div>

      {/* Typography Showcase */}
      <div className="max-w-4xl mx-auto mt-12 bg-surface dark:bg-surface-dark p-8 rounded-2xl shadow-lg border border-primary-200 dark:border-primary-700">
        <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">
          Source Sans 3 Typography
        </h2>
        <div className="space-y-3">
          <p className="text-lg font-semibold text-primary-800 dark:text-primary-200">
            Font Weight 600 - Headings and emphasis
          </p>
          <p className="text-base text-primary-700 dark:text-primary-300">
            Font Weight 400 - Body text with excellent readability
          </p>
          <p className="text-sm font-light text-primary-600 dark:text-primary-400">
            Font Weight 300 - Subtle captions and metadata
          </p>
        </div>
      </div>
    </div>
  );
}
