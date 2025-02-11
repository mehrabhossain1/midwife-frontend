import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
  institution: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface UserMapProps {
  users: User[];
}

export default function UserMap({ users }: UserMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    setMapLoaded(true); // Ensure map initializes only once
  }, []);

  if (!mapLoaded) return <p>Loading Map...</p>;

  return (
    <MapContainer
      center={[23.8103, 90.4125]} // Default center (Dhaka, Bangladesh)
      zoom={6}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {users.map((user, index) => (
        <Marker key={index} position={[user.location.lat, user.location.lng]}>
          <Popup>
            <strong>{user.name}</strong> <br />
            {user.email} <br />
            {user.institution}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
