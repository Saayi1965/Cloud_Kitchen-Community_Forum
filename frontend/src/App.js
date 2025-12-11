import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your components
import ForumPage from "./components/forumPage";
import CreateTopic from "./components/createTopic";
import Comments from "./components/Comments";
import EditForm from "./components/EditForm";
import Guidelines from "./components/Guidelines";
import EventForm from "./components/EventForm";
import EventList from "./components/EventList";
import TicketList from "./components/TicketList";
import TicketForm from "./components/TicketForm";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Main forum page */}
          <Route path="/" element={<ForumPage />} />
          <Route path="/forumPage" element={<ForumPage />} />

          {/* Topic operations */}
          <Route path="/create-topic" element={<CreateTopic />} />
          <Route path="/comments/:id" element={<Comments />} />
          <Route path="/edit-form/:id" element={<EditForm />} />

          {/* Extra pages */}
          <Route path="/guidelines" element={<Guidelines />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/events/new" element={<EventForm />} />
          <Route path="/events/edit/:id" element={<EventForm />} />

          {/* Ticket routes */}
          <Route path="/tickets" element={<TicketList />} />
          <Route path="/raise-ticket" element={<TicketForm />} />
          <Route path="/tickets/new" element={<TicketForm />} />
          <Route path="/tickets/edit/:id" element={<TicketForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
