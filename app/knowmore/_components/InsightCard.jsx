export default function InsightCard({ title, icon }) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <div className="text-blue-600 mb-4">{icon}</div>
        <h2 className="text-xl font-semibold text-green-900">{title}</h2>
      </div>
    );
  }