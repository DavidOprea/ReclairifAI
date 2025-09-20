import "./App.css";

// The main App component that renders the entire page.
export default function App() {
  return (
    <div className="app-container">
      {/* Container for the main content to center everything */}
      <div className="main-content">
        {/* The main title of the page */}
        <h1 className="title">My Awesome App</h1>
        
        {/* Placeholder for the logo */}
        <div className="logo-container">
          <img 
            src="https://placehold.co/150x150/2563EB/ffffff?text=LOGO" 
            alt="App Logo"
            className="app-logo"
          />
        </div>
        
        {/* Container for the two buttons */}
        <div className="button-group">
          <button className="main-button primary">
            Button One
          </button>
          <button className="main-button secondary">
            Button Two
          </button>
        </div>
      </div>
    </div>
  );
}
