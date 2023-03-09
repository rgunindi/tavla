import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { MapRef } from 'react-map-gl'
import { InteractiveMap, Marker } from 'react-map-gl'
import { PositionPin } from 'assets/icons/PositionPin'
import { Viewport } from 'src/types'
import { useSettings } from 'settings/SettingsProvider'
import { useDebounce } from 'hooks/useDebounce'
import { useStopPlaceIds } from 'hooks/useStopPlaceIds'
import { PermanentlyDrawnRoutes } from './components/PermanentlyDrawnRoutes'
import { BikeRentalStationClusterMarkers } from './components/BikeRentalStationClusterMarkers'
import { ScooterClusterMarkers } from './components/ScooterClusterMarkers'
import { RealtimeVehicleMarkers } from './components/RealtimeVehicleMarkers'
import { StopPlaceMarker } from './components/StopPlaceMarker'

function Map() {
    const [settings] = useSettings()
    const { stopPlaceIds } = useStopPlaceIds()

    const [viewport, setViewPort] = useState<Viewport>({
        latitude: settings.coordinates.latitude,
        longitude: settings.coordinates.longitude,
        width: 'auto',
        height: '100%',
        zoom: settings.zoom,
        maxZoom: 18,
        minZoom: 13.5,
    })

    const debouncedViewport = useDebounce(viewport, 200)
    const mapRef = useRef<MapRef>(null)

    const [bounds, setBounds] = useState<[number, number, number, number]>(
        mapRef.current?.getMap()?.getBounds()?.toArray()?.flat() ||
            ([0, 0, 0, 0] as [number, number, number, number]),
    )

    useEffect(() => {
        const newBounds = (mapRef.current
            ?.getMap()
            ?.getBounds()
            ?.toArray()
            ?.flat() || [0, 0, 0, 0]) as [number, number, number, number]

        setBounds(newBounds)
    }, [mapRef, debouncedViewport])

    const handleViewportChange = useCallback(
        (newViewPort: Viewport) => {
            setViewPort((old) => ({
                ...old,
                zoom: newViewPort.zoom,
            }))
        },
        [setViewPort],
    )

    return (
        <InteractiveMap
            {...viewport}
            dragPan={false}
            touchAction="pan-y"
            mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
            mapStyle={process.env.MAPBOX_STYLE_MAPVIEW}
            onViewportChange={handleViewportChange}
            ref={mapRef}
        >
            <RealtimeVehicleMarkers
                boundingBox={{
                    minLat: bounds[1],
                    minLon: bounds[0],
                    maxLat: bounds[3],
                    maxLon: bounds[2],
                }}
            />
            <PermanentlyDrawnRoutes />
            <ScooterClusterMarkers zoom={viewport.zoom} bounds={bounds} />
            {stopPlaceIds.map((stopPlaceId) => (
                <StopPlaceMarker
                    stopPlaceId={stopPlaceId}
                    key={stopPlaceId}
                    hideWalkInfo={settings.hideWalkInfo}
                />
            ))}
            <BikeRentalStationClusterMarkers
                zoom={viewport.zoom}
                bounds={bounds}
            />
            <Marker latitude={viewport.latitude} longitude={viewport.longitude}>
                <PositionPin size={24} />
            </Marker>
        </InteractiveMap>
    )
}

export { Map }
