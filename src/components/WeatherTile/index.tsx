import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import './styles.scss'

import { CloudRainIcon, UmbrellaIcon, WindIcon } from '@entur/icons'

import { useWeather } from '../../logic'
import { getWeatherDescriptionFromApi, getWeatherIconEntur } from '../../utils'
import { useSettingsContext } from '../../settings'

interface Props {
    className?: string
}

function WeatherTile(props: Props): JSX.Element {
    const weather = useWeather()
    const [settings] = useSettingsContext()

    const {
        showIcon = true,
        showTemperature = true,
        showWind = true,
        showPrecipitation = true,
    } = settings || {}

    const [temperatureClassName, setTemperatureClassName] = useState(
        'weather-tile__weather-data--color-red',
    )
    const [description, setDescription] = useState('')

    const [displayTemperature, setdisplayTemperature] = useState(true)
    const [displayWind, setdisplayWind] = useState(true)
    const [displayPrecipitation, setdisplayPrecipitation] = useState(true)

    interface weatherComponents {
        display: boolean
        component: JSX.Element
    }

    useEffect(() => {
        const abortController = new AbortController()

        if (weather) {
            if (
                weather.timeseries[3].data.instant.details.air_temperature >= 0
            ) {
                setTemperatureClassName('weather-tile__weather-data--color-red')
            } else {
                setTemperatureClassName(
                    'weather-tile__weather-data--color-blue',
                )
            }

            getWeatherDescriptionFromApi(
                weather.timeseries[3].data.next_1_hours.summary.symbol_code,
                abortController.signal,
            )
                .then((fetchedDescription) =>
                    setDescription(fetchedDescription),
                )
                .catch((error) => {
                    if (error.name === 'AbortError') return
                    setDescription('')
                    throw error
                })
        }
        return () => {
            abortController.abort()
        }
    }, [weather])

    const updateSize = () => {
        const tileWidth =
            document?.getElementsByClassName('weather-tile')[0]?.clientWidth

        setdisplayTemperature(tileWidth > 217)
        setdisplayWind(tileWidth > 318)
        setdisplayPrecipitation(tileWidth > 428)
    }

    useEffect(() => {
        window.addEventListener('resize', updateSize)
        updateSize()
        return () => window.removeEventListener('resize', updateSize)
    }, [updateSize])

    const Icon = (): JSX.Element => (
        <div className="weather-tile__icon-and-temperature__weather-icon">
            {weather ? (
                <div className="icon-entur">
                    {getWeatherIconEntur(
                        weather.timeseries[3].data.next_1_hours.summary
                            .symbol_code,
                    )}
                </div>
            ) : (
                '?'
            )}
        </div>
    )

    const Temperature = (): JSX.Element => (
        <div className="weather-tile__icon-and-temperature__temperature-and-description">
            <div
                className={
                    'weather-tile__icon-and-temperature__temperature-and-description__temperature ' +
                    temperatureClassName
                }
            >
                {weather
                    ? parseInt(
                          weather.timeseries[3].data.instant.details.air_temperature.toString(),
                      ) + '°'
                    : '?'}
            </div>
            <div className="weather-tile__icon-and-temperature__temperature-and-description__description">
                {description}
            </div>
        </div>
    )

    const Wind = (): JSX.Element => (
        <div className="weather-tile__weather-data">
            <WindIcon size={20} />
            <span className="weather-tile__weather-data__value">
                {weather
                    ? weather.timeseries[3].data.instant.details.wind_speed +
                      ' ' +
                      weather.meta.units.wind_speed
                    : '?'}
            </span>
        </div>
    )

    const Precipitation = (): JSX.Element => (
        <div className="weather-tile__weather-data">
            <CloudRainIcon size={20} />
            <span className="weather-tile__weather-data__value">
                {weather
                    ? weather.timeseries[3].data.next_1_hours.details
                          .precipitation_amount +
                      ' ' +
                      weather.meta.units.precipitation_amount
                    : '?'}
            </span>
        </div>
    )

    const ProbabilityOfrecipitation = (): JSX.Element => (
        <div className="weather-tile__weather-data">
            <UmbrellaIcon size={20} />
            <span className="weather-tile__weather-data__value">
                {weather
                    ? parseInt(
                          weather.timeseries[3].data.next_1_hours.details.probability_of_precipitation.toString(),
                      ) +
                      ' ' +
                      weather.meta.units.probability_of_precipitation
                    : '?'}
            </span>
        </div>
    )

    useEffect(() => {}, [])

    return (
        <div className={'weather-tile ' + props.className}>
            {(showIcon || showTemperature) && (
                <div className="weather-tile__icon-and-temperature">
                    {showIcon && <Icon />}
                    {showTemperature && displayTemperature && <Temperature />}
                </div>
            )}
            {showWind && displayWind && <Wind />}
            {showPrecipitation && displayPrecipitation && (
                <>
                    <Precipitation />
                    <ProbabilityOfrecipitation />
                </>
            )}
        </div>
    )
}

export default WeatherTile
