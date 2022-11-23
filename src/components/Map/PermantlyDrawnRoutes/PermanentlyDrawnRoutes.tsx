import React, { useMemo } from 'react'
import polyline from 'google-polyline'
import { useSettings } from '../../../settings/SettingsProvider'
import { DrawableRoute, IconColorType, Line } from '../../../types'
import { getIconColor } from '../../../utils/icon'
import { TransportMode } from '../../../../graphql-generated/journey-planner-v3'
import { LineOverlay } from '../RealtimeVehicleTag/LineOverlay/LineOverlay'
import { useStopPlacesWithLines } from '../../../logic/useStopPlacesWithLines'

const PermanentlyDrawnRoutes: React.FC = () => {
    const [settings] = useSettings()
    const uniqueLines = useStopPlacesWithLines()

    const routesToDraw = useMemo(
        () =>
            settings.permanentlyVisibleRoutesInMap
                .filter(
                    ({ lineRef }: DrawableRoute) =>
                        uniqueLines
                            .map(({ id }: Line) => id)
                            .includes(lineRef) &&
                        !settings.hiddenRealtimeDataLineRefs.includes(lineRef),
                )
                .map(({ pointsOnLink, mode }: DrawableRoute) => ({
                    points: polyline.decode(pointsOnLink),
                    color: getIconColor(
                        mode.toLowerCase() as TransportMode,
                        IconColorType.DEFAULT,
                    ),
                })),
        [
            settings.permanentlyVisibleRoutesInMap,
            settings.hiddenRealtimeDataLineRefs,
            uniqueLines,
        ],
    )

    if (!settings.showRoutesInMap || settings.hideRealtimeData) {
        return null
    }

    return <LineOverlay routes={routesToDraw} />
}

export { PermanentlyDrawnRoutes }