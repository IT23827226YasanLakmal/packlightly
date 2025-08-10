// components/CommunitySection.jsx
export default function CommunitySection() {
  
  const posts = [
    {
      id: 1,
      title: "Eco-Friendly Travel Hacks",
      author: "Jane Doe",
      date: "Aug 8, 2025",
      description: "Share your best tips for traveling light while reducing your carbon footprint.",
    },
    {
      id: 2,
      title: "Top Sustainable Destinations",
      author: "Mark Lee",
      date: "Aug 6, 2025",
      description: "Let’s list the best destinations that focus on eco-tourism and sustainability.",
    },
    {
      id: 3,
      title: "Minimalist Packing Challenge",
      author: "Sophia Kim",
      date: "Aug 5, 2025",
      description: "Can you pack everything you need in just a carry-on for 2 weeks?",
    },
  ];

  return (
    <section className="py-16 bg-gray-50" id="community">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Community Hub</h2>
        <p className="text-gray-600 mb-10">
          Join discussions, share tips, and inspire other travelers in our eco-conscious community.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 text-left"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{post.title}</h3>
              <p className="text-sm text-gray-500 mb-3">
                By {post.author} • {post.date}
              </p>
              <p className="text-gray-600 mb-4">{post.description}</p>
              <button className="text-green-600 hover:underline">Read More →</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

