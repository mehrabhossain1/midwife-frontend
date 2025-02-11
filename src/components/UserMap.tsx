import type { LatLngTuple } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Dummy User Data
const userData = [
  {
    id: 1,
    name: "John Doe",
    location: { lat: 51.505, lng: -0.09 },
  },
  {
    id: 2,
    name: "Jane Smith",
    location: { lat: 54.505, lng: -0.09 },
  },
  {
    id: 3,
    name: "Alice Johnson",
    location: { lat: 52.505, lng: -0.09 },
  },
];

// Default map position (centered around the first user)
const defaultPosition: LatLngTuple = [51.505, -0.09];

export default function UserMap() {
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

      {/* Map over users and add markers */}
      {userData.map((user) => (
        <Marker key={user.id} position={[user.location.lat, user.location.lng]}>
          <Popup>
            <strong>{user.name}</strong> <br />
            Latitude: {user.location.lat} <br />
            Longitude: {user.location.lng}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
