export default function Card({ title, description }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition duration-300 hover:-translate-y-1">

      <h3 className="text-lg font-semibold text-gray-900">
        {title}
      </h3>

      <p className="text-gray-500 mt-2 text-sm">
        {description}
      </p>

    </div>
  );
}