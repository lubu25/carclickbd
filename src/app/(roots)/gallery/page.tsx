const galleryImages = [
  "/assets/banner/banner-01.png",
  "/assets/banner/banner-02.png",
  "/assets/banner/banner-03.jpg",
  "/assets/shared/car.png",
  "/assets/shared/2025.avif",
  "/assets/shared/2025.v1.avif",
];

const GalleryPage = () => {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Gallery
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950 md:text-4xl">
          CarClickBD gallery
        </h1>
        <p className="mt-3 max-w-2xl text-gray-600">
          Explore featured vehicle visuals, listing highlights, and browsing
          moments from the platform.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {galleryImages.map((image, index) => (
          <div
            key={image}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            <img
              src={image}
              alt={`CarClickBD gallery image ${index + 1}`}
              className="h-64 w-full object-cover"
            />
          </div>
        ))}
      </div>
    </main>
  );
};

export default GalleryPage;
