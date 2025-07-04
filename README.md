```markdown
# MetalGatesWeb

MetalGatesWeb is the comprehensive and modern website for the Metal Gates Festival, designed to provide international festival attendees with detailed information, artist lineups, and seamless ticket purchasing. It includes a fully integrated content management system (CMS) for organizers, facilitating effortless management and updating of the site.

## Overview

MetalGatesWeb is a two-part application comprising a ReactJS-based frontend and an Express-based backend. The frontend employs utility libraries such as Tailwind CSS and Shadcn-UI for styling and component management, and it leverages client-side routing with React Router. The backend features a robust REST API utilizing MongoDB for data storage and authentication via JWT.

**Architecture and Technologies:**
- **Frontend:** ReactJS with Vite, Shadcn-UI, Tailwind CSS, Axios for API calls.
- **Backend:** Node.js with Express, Mongoose for MongoDB integration.
- **Database:** MongoDB.
- **Authentication:** JWT tokens.
- **Integration:** Google OAuth, Google Maps Embed API, Google Analytics, Meta Pixel, Spotify Web Player Embed.

**Project Structure:**
- `client/`: Contains the ReactJS frontend.
  - `src/pages/`: React page components.
  - `src/components/`: Reusable UI components.
  - `src/api/`: API request definitions.
- `server/`: Houses the Express backend.
  - `routes/`: Definition of API endpoints.
  - `models/`: Mongoose models.
  - `services/`: Business logic and service functions.

## Features

**Frontend User Experience:**
- **Homepage:** Hero section with countdown timer, latest news carousel, and call-to-action buttons.
- **Lineup Page:** Responsive grid showcasing band details with modals for biographies and music previews.
- **News Page:** Blog-style article layout with pagination and individual article views.
- **Info Page:** Detailed festival information, including venue maps, travel tips, rules, and an FAQ section.
- **Archive Page:** Historical festival posters and details.
- **Contact Page:** Inline contact form with validation and spam protection.

**Admin Panel User Experience:**
- **Authentication:** Secure login via email, password, or Google OAuth.
- **Dashboard:** Overview of recent activities and quick action buttons.
- **Language Management:** Toggle for EN/RO languages.
- **Content Management:** Drag-and-drop interfaces for lineup management, rich text editors for page content, and image upload functionalities.
- **Settings:** Configuration for ticket URLs, social media, and tracking codes.

**Integration and Third-Party Services:**
- **Google Services:** OAuth for admin login, Maps for location display, Analytics for tracking.
- **Spotify Integration:** Embed players for band previews.
- **Email Services:** SendGrid or similar for contact form submissions.

## Getting Started

### Requirements
- **Node.js** (version 14.x or higher)
- **npm** (version 6.x or higher)
- **MongoDB** (version 4.4 or higher)

### Quickstart

1. **Clone the repository:**
   ```
   git clone https://github.com/example/MetalGatesWeb.git
   cd MetalGatesWeb
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `server/` folder with the following variables:
   ```
   PORT=3000
   MONGO_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. **Run the project:**
   ```
   npm run start
   ```

This command will start both the frontend on port 5173 and the backend on port 3000.

### License

The project is proprietary (not open source). 

```
Copyright (c) 2024.
```
```