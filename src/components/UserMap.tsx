import type { LatLngTuple } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { Report } from "../pages/Dashboard";
import axios from "axios";

// Define a type for the report if not already defined

const defaultPosition: LatLngTuple = [23.8103, 90.4125];

export default function UserMap() {
  const [reportedUsers, setReportedUsers] = useState<Report[]>([]);

  const [message, setMessage] = useState(""); // For user-friendly message
  const [solutionText, setSolutionText] = useState("");
  const [solver, setSolver] = useState("");
  // Fetch reports from the API using Axios
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          "https://midwife-backend.vercel.app/api/v1/reports"
        );

        if (response.data.success) {
          setReportedUsers(response.data.allReports); // Store the fetched reports
        } else {
          console.error("Failed to fetch reports");
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
      }
    };

    fetchReports();
  }, []);

  // Handle the solution submission using Axios
  const handleSolutionSubmit = async (
    reportId: string,
    solutionText: string,
    solver: string
  ) => {
    try {
      console.log("Submitting solution for Report ID:", reportId);
      console.log("Payload:", {
        isSolved: true,
        solution: solutionText,
        solverName: solver,
      });

      const response = await axios.patch(
        `https://midwife-backend.vercel.app/api/v1/reports/${reportId}`,
        {
          isSolved: true,
          solution: solutionText,
          solverName: solver,
        }
      );

      if (response.data.success) {
        console.log("Solution updated successfully:", response.data);
        setMessage("Solution submitted successfully!");
        setReportedUsers((prevReports) =>
          prevReports.map((report) =>
            report._id === reportId
              ? {
                  ...report,
                  isSolved: true,
                  solution: solutionText,
                  solverName: solver,
                }
              : report
          )
        );
      } else {
        console.error("Backend failed to update:", response.data);
        setMessage("Failed to submit the solution. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting the solution:", err);
      setMessage("Error submitting the solution. Please try again later.");
    }
  };

  return (
    <>
      {/* Display the message */}
      {message && (
        <div className="bg-green-100 text-green-700 p-2 rounded mt-4 text-center">
          {message}
        </div>
      )}

      <MapContainer
        center={defaultPosition}
        zoom={6}
        scrollWheelZoom={true}
        style={{ height: "500px", width: "100%" }}
      >
        {/* Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Map over reported users and add markers */}
        {reportedUsers.map((report) => {
          return (
            <Marker
              key={report._id}
              position={[report.location.lat, report.location.lng]}
            >
              <Popup>
                <div>
                  <strong>{report.name}</strong>
                  <br />
                  Latitude: {report.location.lat}
                  <br />
                  Longitude: {report.location.lng}
                  <br />
                  Email: {report.mobileNumber}
                  <br />
                  Report: {report.cause}
                  <br />
                  {report.isSolved ? (
                    <span className="text-green-600">Solved ✅</span>
                  ) : (
                    <div>
                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder="Solution"
                          value={solutionText}
                          onChange={(e) => setSolutionText(e.target.value)}
                          className="border p-2 rounded w-full"
                        />
                      </div>
                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={solver}
                          onChange={(e) => setSolver(e.target.value)}
                          className="border p-2 rounded w-full"
                        />
                      </div>
                      <button
                        onClick={() =>
                          handleSolutionSubmit(report._id, solutionText, solver)
                        }
                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                      >
                        Submit Solution
                      </button>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
}
