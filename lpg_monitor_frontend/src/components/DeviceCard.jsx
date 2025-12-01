// src/components/DeviceCard.jsx
import React, { useEffect, useState } from "react";
import { fetchLatestReading } from "../api";

const DeviceCard = ({ device }) => {
  const [latestReading, setLatestReading] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReading = async () => {
      try {
        const data = await fetchLatestReading(device._id);
        setLatestReading(data);
      } catch (error) {
        console.error("Error fetching latest reading:", error);
      } finally {
        setLoading(false);
      }
    };

    if (device?._id) loadReading();
  }, [device]);

  return (
    <div className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{device.name}</h3>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : latestReading ? (
        <>
          <p>
            <strong>Gas Level:</strong> {latestReading.level}%
          </p>
          <p>
            <strong>Temperature:</strong> {latestReading.temperature}°C
          </p>
          <p className="text-sm text-gray-500">
            Terakhir update:{" "}
            {new Date(latestReading.timestamp).toLocaleString()}
          </p>
        </>
      ) : (
        <p className="text-gray-500">No recent data</p>
      )}
    </div>
  );
};

export default DeviceCard;
