![Logo Wikusama Hotel](/docs/logo.png)

# Wikusama Hotel

Welcome to **Wikusama Hotel**! This web application is designed to manage and display information for Wikusama Hotel, built using the latest technologies to ensure high performance and a great user experience. Includes room bookings and payment gateway.

- **Next.js 14**: The cutting-edge framework for fast, server-rendered React applications.
- **Prisma**: An ORM for interacting with the MySQL database, enabling easy data access and management.
- **PostgreSQL**: A robust relational database to store competition information.
- **NextAuth.js**: Provides secure user authentication with built-in support for OAuth and JWT.
- **Xendit**: Provides a secure payment gateway for the booking process of the application.

## Tech Stack

- **Frontend**: Next.js 14, React
- **Backend**: Next.js Server Actions, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Payment Gateway**: Xendit

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ahsanzizan/wikusama-hotel
   cd wikusama-hotel
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Setup the environment variables. Create a `.env` file in the root of the project and add the following:

   ```bash
   DATABASE_URL="mysql://username:password@localhost:3306/dbname"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   ......
   ```

4. Set up the Prisma schema and push it to the database:

   ```bash
   npx prisma db push
   ```

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## Database Structure (ERD)

![ERD](/docs/Entity%20Relational%20Diagram.png)

## Scripts

- **`npm run dev`**: Runs the app in development mode.
- **`npm run build`**: Builds the app for production.
- **`npm run start`**: Starts the production server.

## Project Structure

```
.
├── prisma/                   # Prisma schema and migrations
├── public/                   # Static assets (images, etc.)
├── src/
│   ├── app/                  # Next.js pages and main folder (includes API routes)
|   ├── components/           # React components that's used for more general purposes
|   ├── hooks/                # React hooks
│   ├── lib/                  # Helper libraries & utilities
|   ├── types/                # Types for TypeScript usages
|   ├── middleware.ts         # Middleware
├── .env                      # Environment variables
├── next.config.mjs           # Next.js configuration
├── README.md                 # Project documentation
```

## Authentication

Wikusama Hotel uses **NextAuth.js** to handle authentication, supporting various providers like Google, GitHub, and more. Ensure you configure the `.env` file correctly with the required credentials.

## Prisma & Database

Prisma is used to manage the MySQL database. The schema is defined in `prisma/schema.prisma`, and you can generate database migrations using Prisma CLI commands. Use `npx prisma studio` to interact with your database visually.

## Contribution

Feel free to open issues and submit pull requests. Make sure to follow the contribution guidelines provided in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Authors

2024 Ahsan Awadullah Azizan (Fullstack Developer, UI/UX Designer)
