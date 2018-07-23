import React from 'react'
import EnturService from '@entur/sdk'
import debounce from 'lodash.debounce'
import {
    getIcon,
    getPositionFromUrl,
    getSettingsFromUrl,
    getStopsWithUniqueStopPlaceDepartures,
    getStopPlacesByPositionAndDistance,
    getSettingsHash,
    updateHiddenListAndHash,
} from '../../utils'
import './styles.css'

const service = new EnturService({ clientName: 'entur-tavla' })


class AdminPage extends React.Component {
    state = {
        distance: 500,
        stations: [],
        stops: [],
        hiddenStations: [],
        hiddenStops: [],
        hiddenRoutes: [],
        position: {},
        positionString: '',
        hashedState: '',
    }

    componentDidMount() {
        const position = getPositionFromUrl()
        const positionString = window.location.pathname.split('/')[2]
        const {
            hiddenStations, hiddenStops, distance, hiddenRoutes,
        } = getSettingsFromUrl()
        service.getBikeRentalStations(position, distance).then(stations => {
            this.setState({
                stations,
            })
        })
        getStopPlacesByPositionAndDistance(position, distance).then(stops => {
            this.setState({
                stops,
                distance,
                hashedState,
                hiddenStops,
                hiddenStations,
                hiddenRoutes,
                position,
                positionString,
            })
            this.stopPlaceDepartures()
        })
        const hashedState = window.location.pathname.split('/')[3]
    }


    stopPlaceDepartures = () => {
        const { stops } = this.state

        getStopsWithUniqueStopPlaceDepartures(stops).then((uniqueRoutes) => {
            this.setState({
                stops: uniqueRoutes,
            })
        })
    }


    handleChange = (event) => {
        const distance = event.target.value
        const { position } = this.state
        this.setState({ distance })
        this.updateSearch(distance, position)
    }

    updateSearch = debounce((distance, position) => {
        service.getBikeRentalStations(position, distance).then(stations => {
            this.setState({
                stations,
            })
        })
        getStopPlacesByPositionAndDistance(position, distance).then(stops => {
            this.setState({
                stops,
            })
            this.stopPlaceDepartures()
        })
    }, 500)

    handleSubmit = (event) => {
        const {
            distance, hiddenStations, hiddenStops, positionString, hiddenRoutes,
        } = this.state
        const hashedState = getSettingsHash(distance, hiddenStations, hiddenStops, hiddenRoutes)
        this.setState({ hashedState })
        this.props.history.push(`/admin/${positionString}/${hashedState}`)
        event.preventDefault()
    }

    updateHiddenList(clickedId, hiddenList) {
        const {
            hiddenLists, hashedState,
        } = updateHiddenListAndHash(clickedId, this.state, hiddenList)
        const { hiddenStations, hiddenStops, hiddenRoutes } = hiddenLists
        this.setState({
            hiddenStations,
            hiddenStops,
            hiddenRoutes,
            hashedState,
        })
        this.props.history.push(`/admin/${this.state.positionString}/${hashedState}`)
    }

    getStyle = (id, type) => {
        const { hiddenStops, hiddenStations, hiddenRoutes } = this.state
        if (type === 'stations') {
            const onStyle = !hiddenStations.includes(id)
            return onStyle ? null : { opacity: 0.3 }
        }
        if (type === 'stops') {
            const onStyle = !hiddenStops.includes(id)
            return onStyle ? null : { opacity: 0.3 }
        }
        const onStyle = !hiddenRoutes.includes(id)
        return onStyle ? null : { opacity: 0.3 }
    }

    onHomeButton = (event) => {
        const { hashedState, positionString } = this.state
        this.props.history.replace(`/dashboard/${positionString}/${hashedState}`)
        event.preventDefault()
    }

    render() {
        const { distance, stations, stops } = this.state
        return (
            <div className="adminContent" >
                <div className="admin-header">
                    <h1>Admin</h1>
                    <button className="close-button" onClick={(event) => this.onHomeButton(event)}>X</button>
                </div>
                <div className="distance" >
                    <p>{distance} meter</p>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Distance:
                            <input
                                id="typeinp"
                                type="range"
                                min="200"
                                max="5000"
                                defaultValue="500"
                                step="100"
                                onChange={this.handleChange}
                            />
                        </label>
                        <button type="submit" value="Submit">Update</button>
                    </form>
                </div>
                <div className="stations">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Fjern sykkelstasjon</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                stations.map(({
                                    name, id,
                                }) => (
                                    <tr style={this.getStyle(id, 'stations')} key={id}>
                                        <td>{getIcon('bike')}</td>
                                        <td>{name}</td>
                                        <td>
                                            <button onClick={() => this.updateHiddenList(id, 'stations')}>X</button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <div className="stops">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Fjern busstopp</th>
                            </tr>
                        </thead>
                        {
                            stops.map(({
                                name, id, transportMode, departures,
                            }) => (
                                <tbody key={id}>
                                    <tr style={this.getStyle(id, 'stops')} >
                                        <td>{getIcon(transportMode)}</td>
                                        <td>{name}</td>
                                        <td>
                                            <button onClick={() => this.updateHiddenList(id, 'stops')}>X</button>
                                        </td>
                                    </tr>
                                    { departures.map(({ route, type }, index) => (
                                        <tr style={this.getStyle(route, 'routes')} key={index}>
                                            <td>{getIcon(type)}</td>
                                            <td>{route}</td>
                                            <td>
                                                <button onClick={() => this.updateHiddenList(route, 'routes')}>X</button>
                                            </td>
                                        </tr>))}
                                </tbody>
                            ))
                        }
                    </table>
                </div>
            </div>
        )
    }
}

export default AdminPage
