import { useEffect, useState } from "react";
import axios from "axios";

export default function MyComplaints() {
  const [mine, setMine] = useState([]);
  const token = localStorage.getItem("token");

  const fetchMine = async () => {
    try {
      const r1 = await axios.get(
        "http://localhost:5000/api/complaints/my",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMine(r1.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchMine();
  }, [token]);

  const handleReopen = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/complaints/${id}/reopen`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Complaint reopened successfully");
      fetchMine();

    } catch (err) {
      alert(err.response?.data?.message || "Error reopening complaint");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          My Complaints
        </h2>

        {mine.length === 0 ? (
          <p className="text-sm text-gray-500">
            You have not filed any complaint yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {mine.map((c) => (
              <div
                key={c._id}
                className="border rounded-lg p-3 bg-gray-50 hover:shadow-md transition"
              >
                <div
                  className="cursor-pointer"
                  onDoubleClick={() =>
                    window.open(`/complaint/${c._id}`, "_blank")
                  }
                >
                  <div className="font-semibold text-blue-700 mb-1">
                    {c.title}
                  </div>

                  <div className="text-sm text-gray-600">
                    {c.description}
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    Dept: {c.department} • Location: {c.locationText}
                  </div>

                  <div className="text-xs text-gray-500">
                    Votes: {c.upvotes}
                  </div>

                  <div className="text-xs text-gray-500">
                    Submitted: {new Date(c.createdAt).toLocaleDateString()}
                  </div>

                  <div className="text-xs mt-1">
                    Status:{" "}
                    <span
                      className={`font-medium ${
                        c.status === "Resolved"
                          ? "text-green-600"
                          : c.status === "In Progress"
                          ? "text-yellow-600"
                          : c.status === "Reopened"
                          ? "text-orange-600"
                          : "text-gray-700"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>

                {/* Reopen Button */}
                {c.status === "Resolved" && (
                  <button
                    onClick={() => handleReopen(c._id)}
                    className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded"
                  >
                    Reopen
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
