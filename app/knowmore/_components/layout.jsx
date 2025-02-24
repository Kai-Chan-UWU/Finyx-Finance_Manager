export default function Layout({ children }) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
        {children}
      </div>
    );
  }