"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { SensorMap } from "@/components/sensor-map"
import { RealTimeMonitor } from "@/components/real-time-monitor"
import { HistoricalData } from "@/components/historical-data"
import { AlertsPanel } from "@/components/alerts-panel"
import { MLPredictions } from "@/components/ml-predictions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DashboardProps {
  onLogout: () => void
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={onLogout} />

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="realtime">Real-time</TabsTrigger>
            <TabsTrigger value="historical">Historical</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="predictions">ML Predictions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SensorMap />
              <RealTimeMonitor />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AlertsPanel />
              <MLPredictions />
            </div>
          </TabsContent>

          <TabsContent value="realtime">
            <RealTimeMonitor expanded />
          </TabsContent>

          <TabsContent value="historical">
            <HistoricalData />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsPanel expanded />
          </TabsContent>

          <TabsContent value="predictions">
            <MLPredictions expanded />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
