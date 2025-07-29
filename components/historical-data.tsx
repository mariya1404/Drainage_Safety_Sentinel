"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { Download, TrendingUp } from "lucide-react"
import { useState } from "react"

const generateHistoricalData = (days: number) => {
  const data = []
  const now = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toISOString().split("T")[0],
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      methane: Math.random() * 80 + 10,
      h2s: Math.random() * 15 + 2,
      ammonia: Math.random() * 20 + 5,
      temperature: Math.random() * 10 + 20,
      humidity: Math.random() * 30 + 40,
    })
  }

  return data
}

export function HistoricalData() {
  const [timeRange, setTimeRange] = useState("7")
  const [selectedSensor, setSelectedSensor] = useState("S001")
  const [viewType, setViewType] = useState("line")

  const data = generateHistoricalData(Number.parseInt(timeRange))

  const exportData = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Date,Time,Methane (ppm),H2S (ppm),Ammonia (ppm),Temperature (°C),Humidity (%)\n" +
      data
        .map(
          (row) =>
            `${row.date},${row.time},${row.methane.toFixed(2)},${row.h2s.toFixed(2)},${row.ammonia.toFixed(2)},${row.temperature.toFixed(1)},${row.humidity.toFixed(1)}`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `sensor_data_${selectedSensor}_${timeRange}days.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Historical Data Analysis</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={selectedSensor} onValueChange={setSelectedSensor}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S001">Main Street Drain</SelectItem>
                  <SelectItem value="S002">Industrial Zone A</SelectItem>
                  <SelectItem value="S003">Residential Area B</SelectItem>
                  <SelectItem value="S005">Park Avenue Drain</SelectItem>
                </SelectContent>
              </Select>

              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Last 24h</SelectItem>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>

              <Select value={viewType} onValueChange={setViewType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={exportData} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              {viewType === "line" ? (
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="methane" stroke="#3b82f6" name="Methane (ppm)" strokeWidth={2} />
                  <Line type="monotone" dataKey="h2s" stroke="#f59e0b" name="H2S (ppm)" strokeWidth={2} />
                  <Line type="monotone" dataKey="ammonia" stroke="#10b981" name="Ammonia (ppm)" strokeWidth={2} />
                </LineChart>
              ) : (
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="methane" fill="#3b82f6" name="Methane (ppm)" />
                  <Bar dataKey="h2s" fill="#f59e0b" name="H2S (ppm)" />
                  <Bar dataKey="ammonia" fill="#10b981" name="Ammonia (ppm)" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Environmental Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#ef4444"
                    name="Temperature (°C)"
                    strokeWidth={2}
                  />
                  <Line type="monotone" dataKey="humidity" stroke="#06b6d4" name="Humidity (%)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Avg Methane</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {(data.reduce((sum, item) => sum + item.methane, 0) / data.length).toFixed(1)} ppm
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-600 font-medium">Avg H2S</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {(data.reduce((sum, item) => sum + item.h2s, 0) / data.length).toFixed(1)} ppm
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Avg Ammonia</p>
                  <p className="text-2xl font-bold text-green-900">
                    {(data.reduce((sum, item) => sum + item.ammonia, 0) / data.length).toFixed(1)} ppm
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">Data Points</p>
                  <p className="text-2xl font-bold text-purple-900">{data.length}</p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Peak Readings</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Max Methane: {Math.max(...data.map((d) => d.methane)).toFixed(1)} ppm</p>
                  <p>Max H2S: {Math.max(...data.map((d) => d.h2s)).toFixed(1)} ppm</p>
                  <p>Max Ammonia: {Math.max(...data.map((d) => d.ammonia)).toFixed(1)} ppm</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
