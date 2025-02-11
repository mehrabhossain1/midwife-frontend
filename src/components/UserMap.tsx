import type { LatLngTuple } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { Report } from "../pages/Dashboard";

// Define a type for the report if not already defined

const defaultPosition: LatLngTuple = [23.8103, 90.4125];

export default function UserMap() {
  const [reportedUsers, setReportedUsers] = useState<Report[]>([]);

  // Fetch reports from the API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(
          "https://midwife-backend.vercel.app/api/v1/reports"
        );
        const data = await response.json();

        if (data.success) {
          // Assuming the report data contains a location with lat/lng
          setReportedUsers(data.allReports); // Store the fetched reports
        } else {
          console.error("Failed to fetch reports");
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
      }
    };

    fetchReports();
  }, []);

  return (
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
      {reportedUsers.map((report) => (
        <Marker
          key={report._id}
          position={[report.location.lat, report.location.lng]}
        >
          <Popup>
            <strong>{report.name}</strong> <br />
            Latitude: {report.location.lat} <br />
            Longitude: {report.location.lng} <br />
            Email: {report.mobileNumber} <br />
            Report: {report.cause}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
