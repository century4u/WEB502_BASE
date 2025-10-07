import { useEffect, useMemo, useState } from "react";

// API endpoint
const USERS_API = "https://jsonplaceholder.typicode.com/users";

type UserType = {
  id: number;
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  website?: string;
  company?: { name?: string };
  address?: { suite?: string; street?: string; city?: string; zipcode?: string };
  [key: string]: any;
};

export default function Users() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Fetch users once on mount
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    fetch(USERS_API, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: UserType[]) => {
        setUsers(data || []);
        // Preselect first user for convenience
        setSelectedId((prev) => (prev === null && data?.length ? data[0].id : prev));
      })
      .catch((err) => {
        if ((err as any).name === "AbortError") return;
        setError((err as any)?.message || "Failed to load users");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedId) || null,
    [users, selectedId]
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Users (useEffect + fetch)</h1>
          <div className="text-sm opacity-70">{USERS_API}</div>
        </header>

        {/* States: loading / error */}
        {loading && (
          <div className="animate-pulse p-4 rounded-2xl bg-white shadow-sm">Loading users…</div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 text-red-700 shadow-sm mb-4">
            <div className="font-medium">Error</div>
            <div className="text-sm">{error}</div>
            <button
              className="mt-3 inline-flex items-center rounded-xl px-3 py-2 bg-red-600 text-white hover:bg-red-700"
              onClick={() => {
                // simple retry: re-run the effect by toggling a key or just refetch inline
                setLoading(true);
                setError("");
                fetch(USERS_API)
                  .then((r) => {
                    if (!r.ok) throw new Error(`HTTP ${r.status}`);
                    return r.json();
                  })
                  .then((d: UserType[]) => setUsers(d || []))
                  .catch((e) => setError((e as any)?.message || "Failed to load users"))
                  .finally(() => setLoading(false));
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Main content */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b text-sm text-gray-600">{users.length} users</div>
                <ul className="divide-y">
                  {users.map((u) => (
                    <li
                      key={u.id}
                      className={
                        "p-4 cursor-pointer transition " + (u.id === selectedId ? "bg-indigo-50" : "hover:bg-gray-50")
                      }
                      onClick={() => setSelectedId(u.id)}
                      role="button"
                      aria-pressed={u.id === selectedId}
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                          {u.name?.charAt(0) ?? "?"}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{u.name}</div>
                          <div className="text-sm text-gray-600 truncate">{u.email}</div>
                          <div className="text-xs text-gray-500 truncate">@{u.username}</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Detail */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-white shadow-sm p-5">
                {selectedUser ? (
                  <UserDetail user={selectedUser} />
                ) : (
                  <div className="text-gray-600">Select a user to see details</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function UserDetail({ user }: { user: UserType }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold">
          {user.name?.charAt(0) ?? "?"}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-600 text-sm">@{user.username}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Email" value={user.email} />
        <Field label="Phone" value={user.phone} />
        <Field label="Website" value={user.website} />
        <Field label="Company" value={user.company?.name} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Address" value={`${user.address?.suite ?? ""}, ${user.address?.street ?? ""}`} />
        <Field label="City" value={`${user.address?.city ?? ""} (${user.address?.zipcode ?? ""})`} />
      </div>

      <details className="mt-2">
        <summary className="cursor-pointer select-none text-sm text-indigo-600">Raw JSON</summary>
        <pre className="mt-2 text-xs overflow-auto bg-gray-50 p-3 rounded-xl">{JSON.stringify(user, null, 2)}</pre>
      </details>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="p-3 rounded-xl bg-gray-50">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="text-sm font-medium break-words">{value ?? "—"}</div>
    </div>
  );
}
