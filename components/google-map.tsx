"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { Button } from "@/components/ui/button"
// import { toast } from "@/components/ui/use-toast" // Removed as it's not used in the updated code

interface GoogleMapProps {
  onLocationSelect: (lat: number, lng: number) => void
  onGuess: () => void
}

const GOOGLE_MAPS_API_KEY = "AIzaSyD-DS-knnPnZXdBTqSZk4biZbKQomkJ6s0"

export function GoogleMap({ onLocationSelect, onGuess }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [marker, setMarker] = useState<google.maps.Marker | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      console.error(
        "Google Maps API key is missing. Please set the NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable.",
      )
      setError("Google Maps API key is missing")
      setIsLoading(false)
      return
    }

    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: "weekly",
    })

    setIsLoading(true)
    loader
      .load()
      .then(() => {
        if (mapRef.current) {
          const newMap = new google.maps.Map(mapRef.current, {
            center: { lat: 29.865151, lng: 77.896545 }, // Center on IITR campus
            zoom: 17,
            mapTypeId: "satellite",
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeControl: false,
          })
          setMap(newMap)

          // Add click listener to map
          newMap.addListener("click", (e: google.maps.MapMouseEvent) => {
            const latLng = e.latLng
            if (latLng) {
              const lat = latLng.lat()
              const lng = latLng.lng()

              // Update or create marker
              if (marker) {
                marker.setPosition(latLng)
              } else {
                const newMarker = new google.maps.Marker({
                  position: latLng,
                  map: newMap,
                  animation: google.maps.Animation.DROP,
                  icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: "#FF0000",
                    fillOpacity: 0.8,
                    strokeColor: "#FFFFFF",
                    strokeWeight: 2,
                  },
                })
                setMarker(newMarker)
              }

              setSelectedLocation((prevLocation) => {
                const newLocation = { lat, lng }
                onLocationSelect(lat, lng)
                return newLocation
              })
            }
          })
        }
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error loading Google Maps API:", error)
        setError("Failed to load Google Maps. Please try again later.")
        setIsLoading(false)
      })

    return () => {
      if (marker) {
        marker.setMap(null)
      }
    }
  }, [onLocationSelect, marker]) // Updated dependency array

  const handleGuess = () => {
    console.log("GoogleMap handleGuess called")
    console.log("selectedLocation:", selectedLocation)
    if (selectedLocation) {
      onGuess()
    } else {
      console.error("No location selected") // Updated error handling
    }
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">Loading map...</div>
      )}
      {error && <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">{error}</div>}
      <div ref={mapRef} className="w-full h-full" />
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 items-end">
        {selectedLocation && (
          <div className="bg-black/75 text-white p-2 rounded-md text-sm">
            Selected: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
          </div>
        )}
        <Button
          onClick={handleGuess}
          disabled={!selectedLocation}
          className={`${
            selectedLocation
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-gray-500 cursor-not-allowed text-gray-300"
          }`}
        >
          {selectedLocation ? "Guess Location" : "Select a location first"}
        </Button>
      </div>
    </div>
  )
}

