"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, Thermometer, Droplets, Wind } from "lucide-react"

interface GasReading {
  type: string
  value: number
  unit: string
  threshold: number
  safeLimit: number
  icon: React.ReactNode
  color: string
}

interface RealTimeMonitorProps {
  expanded?: boolean
}

export function RealTimeMonitor({ expanded = false }: RealTimeMonitorProps) {
  const [gasReadings, setGasReadings] = useState<GasReading[]>([
    {
      type: "Methane (CH4)",
      value: 45,
      unit: "ppm",
      threshold: 100,
      safeLimit: 50,
      icon: <Wind className="h-5 w-5" />,
      color: "text-blue-600",
    },
    {
      type: "Hydrogen Sulfide (H2S)",
      value: 8,
      unit: "ppm",
      threshold: 10,
      safeLimit: 5,
      icon: <Droplets className="h-5 w-5" />,
      color: "text-yellow-600",
    },
    {
      type: "Ammonia (NH3)",
      value: 12,
      unit: "ppm",
      threshold: 25,
      safeLimit: 15,
      icon: <Thermometer className="h-5 w-5" />,
      color: "text-green-600",
    },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setGasReadings((prev) =>
        prev.map((reading) => ({
          ...reading,
          value: Math.max(0, reading.value + (Math.random() - 0.5) * 5),
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getAlertLevel = (value: number, safeLimit: number, threshold: number) => {
    if (value >= threshold) return "hazardous"
    if (value >= safeLimit) return "warning"
    return "safe"
  }

  const getAlertColor = (level: string) => {
    switch (level) {
      case "safe":
        return "text-green-600 bg-green-50 border-green-200"
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "hazardous":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getSafetyDuration = (value: number, safeLimit: number, threshold: number) => {
    const level = getAlertLevel(value, safeLimit, threshold)
    if (level === "safe") return "Safe for 8+ hours"
    if (level === "warning") return "Safe for 2-4 hours"
    return "Exit immediately"
  }

  return (
    <Card className={expanded ? "col-span-full" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Real-time Gas Monitoring</span>
          <Badge variant="outline" className="ml-auto">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-6 ${expanded ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1"}`}>
          {gasReadings.map((reading, index) => {
            const alertLevel = getAlertLevel(reading.value, reading.safeLimit, reading.threshold)
            const percentage = (reading.value / reading.threshold) * 100

            return (
              <div key={index} className={`p-4 rounded-lg border-2 ${getAlertColor(alertLevel)}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={reading.color}>{reading.icon}</div>
                    <h3 className="font-medium text-gray-900">{reading.type}</h3>
                  </div>
                  <Badge
                    variant={alertLevel === "safe" ? "default" : alertLevel === "warning" ? "secondary" : "destructive"}
                  >
                    {alertLevel.toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-gray-900">{reading.value.toFixed(1)}</span>
                    <span className="text-sm text-gray-600">{reading.unit}</span>
                  </div>

                  <Progress value={Math.min(percentage, 100)} className="h-2" />

                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>
                        Safe limit: {reading.safeLimit} {reading.unit}
                      </span>
                      <span>
                        Threshold: {reading.threshold} {reading.unit}
                      </span>
                    </div>
                    <div className="font-medium">
                      Exposure Time: {getSafetyDuration(reading.value, reading.safeLimit, reading.threshold)}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {expanded && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Safety Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Safe (Green): Normal operations, regular monitoring</li>
              <li>• Warning (Yellow): Increased monitoring, limit exposure time</li>
              <li>• Hazardous (Red): Immediate evacuation required</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
