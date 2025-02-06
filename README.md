# Capitol Insurance Application

This is a full-stack application for managing insurance claims and applications. The application consists of a Next.js frontend and a Python Flask backend, both integrated with Supabase for authentication and data storage.

## Application Components

### Frontend Application (`/capitol-fe`)
- Next.js web application
- Handles user interface and client-side logic
- Includes authentication flows and insurance management features
- We have different views to browse all insurance applications, view application details, and manage claim applications.

### Backend API (`/api`)
- Python Flask API
- Handles business logic and data processing
- Integrates with Supabase for data storage

## Prerequisites

- Node.js 18 or later
- Python 3.11 or later
- Docker and Docker Compose (for containerized deployment)

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### Required Configuration

1. **Supabase Configuration**
   - Create a Supabase project at [https://supabase.com](https://supabase.com)
   - Obtain the project URL and anon key from your Supabase project settings
   - Configure authentication providers in Supabase dashboard

## Starting the Application

### Using Docker Compose (Recommended)

1. Build and start all services:
   ```bash
   docker-compose up --build
   ```
   This will start both frontend and backend services.
   - Frontend will be available at: http://localhost:3000
   - Backend API will be available at: http://localhost:5001

### Manual Setup

#### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd capitol-fe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at http://localhost:3000

#### Backend Setup
1. Navigate to the API directory:
   ```bash
   cd api
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the Flask server:
   ```bash
   python run_api.py
   ```
   The API will be available at http://localhost:5001

## Authentication

The application uses Supabase for authentication. Email authentication is enabled by default. To configure additional authentication providers:

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Providers
3. Enable and configure desired authentication providers

## Tech Stack

### Frontend Development
- The frontend is built with Next.js 14 and uses TypeScript
- UI components are built using shadcn/ui and styled with Tailwind CSS
- State management is handled with React Query

### Backend Development
- The backend is built with Python Flask
- Uses Supabase Python client for database operations


## Project Structure

```
├── api/                 # Backend API
│   ├── Dockerfile
│   ├── app.py          # Main application file
│   ├── routes.py       # API routes
│   └── requirements.txt # Python dependencies
├── capitol-fe/         # Frontend application
│   ├── Dockerfile
│   ├── app/           # Next.js pages and components
│   ├── utils/         # Utility functions
│   └── package.json   # Node.js dependencies
└── docker-compose.yml  # Docker composition file
```

## Database Structure

The application uses a PostgreSQL database with the following structure:

![Database Schema](./Capitol-Insurance-Database-Schema.png)

### Table Schemas

#### Vehicles Table
```sql
create table public.vehicles (
  vehicle_id bigint generated by default as identity not null,
  vehicle_manufacturer text null,
  vehicle_model text null,
  vehicle_type text null,
  construction_year bigint null,
  fuel_type text null,
  accident_history text null,
  maintenance_status text null,
  application_id bigint not null,
  vehicle_risk double precision null,
  constraint vehicles_pkey primary key (vehicle_id),
  constraint vehicles_application_id_fkey foreign key (application_id) references applications (application_id) on update cascade on delete cascade
);
```

#### Applications Table
```sql
create table public.applications (
  application_id bigint generated by default as identity not null,
  pid bigint not null,
  first_name text null,
  last_name text null,
  age bigint null,
  driver_license_valid boolean null,
  street_number bigint null,
  phone_number bigint null,
  email_address text null,
  child_seat boolean null,
  additional_services text null,
  extra_insurance boolean null,
  lashing_strap boolean null,
  gps boolean null,
  customer_type text null,
  data_privacy_accepted text null,
  rental_start_date date null,
  rental_end_date date null,
  days_of_rental bigint null,
  insurance_type text null,
  request_type text null,
  number_of_accidents bigint null,
  accident_severity bigint null,
  accident_recency bigint null,
  driver_risk double precision null,
  status text null,
  constraint applications_pkey primary key (application_id),
  constraint applications_pid_key unique (pid)
);
```

#### Insurances Table
```sql
create table public.insurances (
  insurance_id bigint generated by default as identity not null,
  application_id bigint null,
  insurance_type text null,
  policy_number text null,
  date_start date null,
  date_end date null,
  amount double precision null,
  maximum_coverage double precision null,
  deductible double precision null,
  status text null,
  constraint insurances_pkey primary key (insurance_id),
  constraint insurances_application_id_fkey foreign key (application_id) references applications (application_id) on update cascade on delete cascade
);
```

#### Invoices Table
```sql
create table public.invoices (
  invoice_id bigint generated by default as identity not null,
  date_start date not null,
  date_end date null,
  currency text null default 'EUR',
  total_amount double precision null,
  payment_method text null,
  iban text null,
  application_id bigint null,
  constraint invoices_pkey primary key (invoice_id),
  constraint invoices_application_id_fkey foreign key (application_id) references applications (application_id) on update cascade on delete cascade
);
```

## Troubleshooting

1. **Environment Variables**
   - Ensure all environment variables are properly set in the `.env` file
   - Check that the Supabase URL and keys are correct

2. **Docker Issues**
   - Ensure Docker daemon is running
   - Try rebuilding the containers: `docker-compose up --build`

3. **Database Connection**
   - Verify Supabase project is active
   - Check network connectivity to Supabase

