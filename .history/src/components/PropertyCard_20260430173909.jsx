export default function PropertyCard({ image, title, price, location }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300">

      <img
        src={image}
        className="h-52 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="font-semibold text-gray-900">
          {title}
        </h3>

        <p className="text-blue-600 font-bold mt-1">
          {price}
        </p>

        <p className="text-gray-500 text-sm">
          {location}
        </p>
      </div>

    </div>
  );
}