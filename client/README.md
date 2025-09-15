
# AI-Based Dropout Prediction Platform

An advanced web application for predicting student dropout risk, managing attendance, assessments, and notifications, built with Next.js, TypeScript, and Prisma.

## Features

- **Student Management:** Import, view, and manage student records.
- **Attendance Tracking:** Upload and track attendance data, with upsert logic to avoid duplicates.
- **Assessment Management:** Import and analyze student assessments.
- **Risk Assessment:** AI-based dropout risk prediction and dashboard overview.
- **Alert & Notification System:** Automated alerts for at-risk students and notification center for staff.
- **Authentication & Protected Routes:** Secure login/register and role-based access.
- **Modern UI:** Responsive, accessible, and themeable interface using custom UI components.

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript
- **Backend:** Next.js API routes, Prisma ORM
- **Database:** PostgreSQL
- **Styling:** Tailwind CSS, PostCSS
- **Authentication:** Custom hooks and logic
- **CSV Import:** Robust CSV parsing and validation

## Project Structure

- `app/` - Next.js app pages and routes (dashboard, login, data import, etc.)
- `components/` - Reusable UI and feature components
- `hooks/` - Custom React hooks (e.g., authentication)
- `lib/` - Utility libraries (CSV parser, risk assessment, notifications, Prisma client)
- `prisma/` - Prisma schema and migrations
- `public/` - Static assets

## Getting Started

1. **Install dependencies:**
	```bash
	npm install
	```
2. **Set up environment variables:**
	- Copy `.env.example` to `.env` and set your `DATABASE_URL` for PostgreSQL.
3. **Run database migrations:**
	```bash
	npx prisma migrate dev
	```
4. **Start the development server:**
	```bash
	npm run dev
	```
5. **Open the app:**
	Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Import Data:** Use the dashboard to upload CSV files for students, attendance, and assessments. The system validates and upserts records.
- **View Dashboard:** See student risk levels, attendance stats, and recent alerts.
- **Manage Notifications:** Get notified about at-risk students and important events.
- **Authentication:** Register/login as a teacher, admin, or manager to access protected features.

## Development

- **Code Quality:** ESLint and TypeScript are used for static analysis and type safety.
- **UI Components:** Custom components in `components/ui/` for consistent design.
- **Prisma ORM:** Models for User, Student, Attendance, Assessment, with composite unique constraints for upsert logic.

## Contributing

Contributions are welcome! Please open issues or pull requests for bug fixes, improvements, or new features.

## License

This project is licensed under the MIT License.

---
For more details, see the source code and documentation in each folder.
