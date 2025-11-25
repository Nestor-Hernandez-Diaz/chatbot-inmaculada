# Project: Chatbot La Inmaculada

## Project Overview

This is a Node.js project that implements a WhatsApp chatbot for the "La Inmaculada" supermarket. The chatbot is designed to answer customer queries about product availability, prices, store hours, and more. It uses the `wppconnect` library to interact with WhatsApp.

The project uses Express to provide a REST API for managing products and viewing statistics. Data is managed through the Prisma ORM, with support for SQLite in development and PostgreSQL in production.

## Building and Running

### Prerequisites

- Node.js (>=16.0.0)
- npm

### Installation and Setup

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Set up the database:**
    ```bash
    # Generate the Prisma client
    npm run db:generate

    # Run database migrations
    npm run db:migrate

    # Seed the database with initial data
    npm run db:seed
    ```

### Running the Application

-   **Development Mode:**
    ```bash
    npm run dev
    ```
    This will start the server with `nodemon`, which automatically restarts the application on file changes.

-   **Production Mode:**
    ```bash
    npm run start:stable
    ```

-   **Windows Scripts:**
    -   `start-bot.bat`: Starts the bot.
    -   `stop-bot.bat`: Stops the bot.

### Database Management

-   **Prisma Studio:**
    ```bash
    npm run db:studio
    ```
    This opens a web interface to view and manage the database.

-   **Reset Database:**
    ```bash
    npm run db:reset
    ```

## Development Conventions

-   The main application logic is located in `src/server.js`.
-   The database schema is defined in `prisma/schema.prisma`.
-   Initial data for the database is in `prisma/seed.js`.
-   Environment variables are used for configuration (a `.env` file should be created from `.env.example`).
-   The project includes a REST API for managing resources.
