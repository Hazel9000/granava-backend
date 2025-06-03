export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Next.js API Server</h1>
      <p className="text-xl mb-4">Your API server is running successfully!</p>
      <div className="grid gap-4 mt-8">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Available Endpoints:</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <code className="bg-gray-100 p-1 rounded">/api/health</code> - Check server health
            </li>
            <li>
              <code className="bg-gray-100 p-1 rounded">/api/users</code> - Get all users (GET) or create a user (POST)
            </li>
            <li>
              <code className="bg-gray-100 p-1 rounded">/api/users?id=1</code> - Get a specific user by ID
            </li>
            <li>
              <code className="bg-gray-100 p-1 rounded">/api/users/1</code> - Get, update, or delete a specific user
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
