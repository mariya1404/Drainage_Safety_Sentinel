"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Bell, CheckCircle, XCircle, Clock } from "lucide-react"

interface AlertItem {
  id: string
  type: "warning" | "hazardous" | "info"
  title: string
  description: string
  location: string
  timestamp: Date
  acknowledged: boolean
  gasType: string
  value: number
  threshold: number
}

interface AlertsPanelProps {
  expanded?: boolean
}

export function AlertsPanel({ expanded = false }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: "A001",
      type: "hazardous",
      title: "Critical H2S Level Detected",
      description: "Hydrogen Sulfide levels exceed safe threshold",
      location: "Park Avenue Drain (S005)",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      acknowledged: false,
      gasType: "H2S",
      value: 12.5,
      threshold: 10,
    },
    {
      id: "A002",
      type: "warning",
      title: "Elevated Methane Levels",
      description: "Methane concentration approaching warning threshold",
      location: "Industrial Zone A (S002)",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      acknowledged: false,
      gasType: "CH4",
      value: 85,
      threshold: 100,
    },
    {
      id: "A003",
      type: "info",
      title: "Sensor Maintenance Required",
      description: "Scheduled maintenance due for sensor calibration",
      location: "Commercial District (S004)",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      acknowledged: true,
      gasType: "System",
      value: 0,
      threshold: 0,
    },
  ])

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)))
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "hazardous":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "info":
        return <Bell className="h-5 w-5 text-blue-600" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "hazardous":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      case "info":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) return `${hours}h ${minutes % 60}m ago`
    return `${minutes}m ago`
  }

  const unacknowledgedCount = alerts.filter((alert) => !alert.acknowledged).length

  return (
    <Card className={expanded ? "col-span-full" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Active Alerts</span>
            {unacknowledgedCount > 0 && <Badge variant="destructive">{unacknowledgedCount}</Badge>}
          </CardTitle>
          <Button variant="outline" size="sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            Acknowledge All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">No active alerts</p>
              <p className="text-sm text-gray-500">All systems operating normally</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-2 ${getAlertColor(alert.type)} ${
                  alert.acknowledged ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{alert.title}</h4>
                        <Badge
                          variant={
                            alert.type === "hazardous"
                              ? "destructive"
                              : alert.type === "warning"
                                ? "secondary"
                                : "default"
                          }
                        >
                          {alert.type.toUpperCase()}
                        </Badge>
                        {alert.acknowledged && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            ACKNOWLEDGED
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimestamp(alert.timestamp)}</span>
                        </span>
                        <span>{alert.location}</span>
                        {alert.gasType !== "System" && (
                          <span>
                            {alert.gasType}: {alert.value} ppm (Threshold: {alert.threshold} ppm)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {!alert.acknowledged && (
                    <Button variant="outline" size="sm" onClick={() => acknowledgeAlert(alert.id)}>
                      Acknowledge
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {expanded && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-900 mb-2">Critical Alerts</h4>
              <p className="text-2xl font-bold text-red-900">
                {alerts.filter((a) => a.type === "hazardous" && !a.acknowledged).length}
              </p>
              <p className="text-sm text-red-700">Require immediate attention</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">Warning Alerts</h4>
              <p className="text-2xl font-bold text-yellow-900">
                {alerts.filter((a) => a.type === "warning" && !a.acknowledged).length}
              </p>
              <p className="text-sm text-yellow-700">Monitor closely</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Info Alerts</h4>
              <p className="text-2xl font-bold text-blue-900">
                {alerts.filter((a) => a.type === "info" && !a.acknowledged).length}
              </p>
              <p className="text-sm text-blue-700">General notifications</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
