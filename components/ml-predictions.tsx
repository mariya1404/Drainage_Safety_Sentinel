"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface MLPrediction {
  sensorId: string
  location: string
  prediction: "SAFE" | "WARNING" | "HAZARDOUS"
  confidence: number
  timeHorizon: string
  recommendedAction: string
  factors: string[]
  riskScore: number
}

interface MLPredictionsProps {
  expanded?: boolean
}

export function MLPredictions({ expanded = false }: MLPredictionsProps) {
  const [predictions, setPredictions] = useState<MLPrediction[]>([
    {
      sensorId: "S001",
      location: "Main Street Drain",
      prediction: "SAFE",
      confidence: 92,
      timeHorizon: "4 hours",
      recommendedAction: "Continue normal operations",
      factors: ["Stable gas levels", "Normal weather conditions", "Low traffic volume"],
      riskScore: 15,
    },
    {
      sensorId: "S002",
      location: "Industrial Zone A",
      prediction: "WARNING",
      confidence: 78,
      timeHorizon: "2 hours",
      recommendedAction: "Increase monitoring frequency",
      factors: ["Rising methane trend", "Industrial activity nearby", "Temperature increase"],
      riskScore: 65,
    },
    {
      sensorId: "S005",
      location: "Park Avenue Drain",
      prediction: "HAZARDOUS",
      confidence: 89,
      timeHorizon: "1 hour",
      recommendedAction: "Prepare for evacuation",
      factors: ["Critical H2S levels", "Poor ventilation", "Recent rainfall"],
      riskScore: 85,
    },
  ])

  const [modelStats, setModelStats] = useState({
    accuracy: 94.2,
    lastUpdated: new Date(Date.now() - 15 * 60 * 1000),
    predictionsToday: 247,
    alertsPrevented: 12,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setPredictions((prev) =>
        prev.map((pred) => ({
          ...pred,
          confidence: Math.max(70, Math.min(95, pred.confidence + (Math.random() - 0.5) * 5)),
          riskScore: Math.max(0, Math.min(100, pred.riskScore + (Math.random() - 0.5) * 10)),
        })),
      )
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getPredictionIcon = (prediction: string) => {
    switch (prediction) {
      case "SAFE":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "WARNING":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "HAZARDOUS":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <Brain className="h-5 w-5" />
    }
  }

  const getPredictionColor = (prediction: string) => {
    switch (prediction) {
      case "SAFE":
        return "border-green-200 bg-green-50"
      case "WARNING":
        return "border-yellow-200 bg-yellow-50"
      case "HAZARDOUS":
        return "border-red-200 bg-red-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-red-600"
    if (score >= 50) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <Card className={expanded ? "col-span-full" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span>ML Predictions & Risk Assessment</span>
          <Badge variant="outline" className="ml-auto">
            AI Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Model Performance Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Model Accuracy</p>
              <p className="text-2xl font-bold text-blue-900">{modelStats.accuracy}%</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Predictions Today</p>
              <p className="text-2xl font-bold text-green-900">{modelStats.predictionsToday}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Alerts Prevented</p>
              <p className="text-2xl font-bold text-purple-900">{modelStats.alertsPrevented}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 font-medium">Last Updated</p>
              <p className="text-sm font-bold text-gray-900">{modelStats.lastUpdated.toLocaleTimeString()}</p>
            </div>
          </div>

          {/* Predictions */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Predictive Analysis</h4>
            {predictions.map((prediction) => (
              <div
                key={prediction.sensorId}
                className={`p-4 rounded-lg border-2 ${getPredictionColor(prediction.prediction)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getPredictionIcon(prediction.prediction)}
                    <div>
                      <h5 className="font-medium text-gray-900">{prediction.location}</h5>
                      <p className="text-sm text-gray-600">{prediction.sensorId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        prediction.prediction === "SAFE"
                          ? "default"
                          : prediction.prediction === "WARNING"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {prediction.prediction}
                    </Badge>
                    <p className="text-xs text-gray-600 mt-1">{prediction.confidence}% confidence</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Risk Score</span>
                        <span className={`text-sm font-bold ${getRiskColor(prediction.riskScore)}`}>
                          {prediction.riskScore}/100
                        </span>
                      </div>
                      <Progress value={prediction.riskScore} className="h-2" />
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Confidence</span>
                        <span className="text-sm font-bold text-blue-600">{prediction.confidence}%</span>
                      </div>
                      <Progress value={prediction.confidence} className="h-2" />
                    </div>
                  </div>

                  <div>
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Time Horizon</p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {prediction.timeHorizon}
                      </p>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Recommended Action</p>
                      <p className="text-sm text-gray-900 font-medium">{prediction.recommendedAction}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Contributing Factors</p>
                  <div className="flex flex-wrap gap-2">
                    {prediction.factors.map((factor, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {expanded && (
            <div className="space-y-4">
              <Alert>
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  <strong>ML Model Information:</strong> Our predictive model uses historical sensor data, weather
                  patterns, and environmental factors to forecast potential gas level changes. The model is retrained
                  daily with new data to maintain accuracy.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Model Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• Real-time sensor data integration</li>
                      <li>• Weather pattern analysis</li>
                      <li>• Historical trend recognition</li>
                      <li>• Environmental factor correlation</li>
                      <li>• Seasonal variation adjustment</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Prediction Accuracy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Safe Predictions</span>
                        <span className="text-sm font-bold text-green-600">96.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Warning Predictions</span>
                        <span className="text-sm font-bold text-yellow-600">91.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Hazardous Predictions</span>
                        <span className="text-sm font-bold text-red-600">94.5%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
