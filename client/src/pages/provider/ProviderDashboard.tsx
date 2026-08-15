function ProviderVenues() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Venues
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your venues.
          </p>
        </div>

        <button className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700">
          + Add Venue
        </button>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <p className="text-gray-600">
          Your venues will appear here.
        </p>
      </div>
    </div>
  );
}

export default ProviderVenues;