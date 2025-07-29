"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Wifi, WifiOff } from "lucide-react"

const sensors = [
  { id: "S001", name: "Main Street Drain", lat: 40.7128, lng: -74.006, status: "online", alert: "safe" },
  { id: "S002", name: "Industrial Zone A", lat: 40.7589, lng: -73.9851, status: "online", alert: "warning" },
  { id: "S003", name: "Residential Area B", lat: 40.7505, lng: -73.9934, status: "online", alert: "safe" },
  { id: "S004", name: "Commercial District", lat: 40.7282, lng: -73.7949, status: "offline", alert: "unknown" },
  { id: "S005", name: "Park Avenue Drain", lat: 40.7614, lng: -73.9776, status: "online", alert: "hazardous" },
]

export function SensorMap() {
  const getAlertColor = (alert: string) => {
    switch (alert) {
      case "safe":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "hazardous":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    return status === "online" ? (
      <Wifi className="h-4 w-4 text-green-600" />
    ) : (
      <WifiOff className="h-4 w-4 text-red-600" />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Sensor Locations</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Map placeholder */}
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"></div>
            <div className="relative z-10 text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Interactive Map View</p>
              <p className="text-sm text-gray-500">Sensor locations and real-time status</p>
            </div>

            {/* Sensor markers */}
            {sensors.map((sensor, index) => (
              <div
                key={sensor.id}
                className="absolute z-20"
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${30 + (index % 2) * 20}%`,
                }}
              >
                <div
                  className={`w-4 h-4 rounded-full ${getAlertColor(sensor.alert)} border-2 border-white shadow-lg animate-pulse`}
                ></div>
              </div>
            ))}
          </div>

          {/* Sensor list */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Active Sensors</h4>
            {sensors.map((sensor) => (
              <div key={sensor.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getAlertColor(sensor.alert)}`}></div>
                  <div>
                    <p className="font-medium text-sm">{sensor.name}</p>
                    <p className="text-xs text-gray-500">{sensor.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={
                      sensor.alert === "safe" ? "default" : sensor.alert === "warning" ? "secondary" : "destructive"
                    }
                  >
                    {sensor.alert.toUpperCase()}
                  </Badge>
                  {getStatusIcon(sensor.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
