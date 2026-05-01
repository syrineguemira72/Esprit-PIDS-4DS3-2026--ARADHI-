export default function About() {
  return (
    <div>
      <h1 className="text-3xl mb-6">Our Team</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Member name="You" role="Market Timing" />
        <Member name="Member 2" role="Prediction Model" />
        <Member name="Member 3" role="Chatbot AI" />
        <Member name="Member 4" role="Image Processing" />
      </div>
    </div>
  );
}

function Member({ name, role }) {
  return (
    <div className="bg-white/10 p-4 rounded-xl">
      <h2 className="font-bold">{name}</h2>
      <p className="text-gray-300">{role}</p>
    </div>
  );
}