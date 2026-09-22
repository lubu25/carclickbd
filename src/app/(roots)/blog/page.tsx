const posts = [
  {
    title: "How to read a Japanese auction sheet",
    summary:
      "Understand grades, mileage notes, repair marks, and condition comments before choosing a vehicle.",
  },
  {
    title: "What to check before buying a reconditioned car",
    summary:
      "A practical checklist for documents, photos, inspection notes, and estimated ownership cost.",
  },
  {
    title: "Tips for comparing vehicles online",
    summary:
      "Compare year, mileage, condition, interior grade, and total estimated cost with more confidence.",
  },
];

const BlogPage = () => {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Blog
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950 md:text-4xl">
          Guides and updates
        </h1>
        <p className="mt-3 max-w-2xl text-gray-600">
          Helpful articles for buyers, sellers, and anyone comparing cars
          through online vehicle listings.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.title}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-950">{post.title}</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">{post.summary}</p>
          </article>
        ))}
      </div>
    </main>
  );
};

export default BlogPage;
