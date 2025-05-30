import './App.css';

function App() {

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navbar */}
      <div className="navbar bg-base-300">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">DaisyUI React</a>
        </div>
        
      </div>

      {/* Hero Section */}
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold text-primary">Hello DaisyUI!</h1>
            <p className="py-6 text-base-content">
              This is a React app with DaisyUI components and theme switching.
            </p>
            <button className="btn btn-primary">Get Started</button>
            <button className="btn btn-secondary ml-4">Learn More</button>
          </div>
        </div>
      </div>

      {/* Sample Components */}
      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Card Title</h2>
              <p>Sample card component</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Action</button>
              </div>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Another Card</h2>
              <p>With different content</p>
              <div className="card-actions justify-end">
                <button className="btn btn-secondary">Click me</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Third Card</h2>
              <p>More sample content here</p>
              <div className="card-actions justify-end">
                <button className="btn btn-accent">Try it</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;