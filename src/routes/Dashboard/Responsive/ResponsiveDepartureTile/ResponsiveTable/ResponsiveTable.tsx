import React from 'react'
import { Departure } from 'logic/use-stop-place-with-estimated-calls/departure'
import { ResponsiveTableHeader } from './ResponsiveTableHeader/ResponsiveTableHeader'
import { ResponsiveTableRow } from './ResponsiveTableRow/ResponsiveTableRow'
import classes from './ResponsiveTable.module.scss'

const ResponsiveTable: React.FC<{ departures: Departure[] }> = ({
    departures,
}) => (
    <table className={classes.ResponsiveTable}>
        <ResponsiveTableHeader />
        <tbody>
            {departures.map((departure) => (
                <ResponsiveTableRow key={departure.id} departure={departure} />
            ))}
        </tbody>
    </table>
)

export { ResponsiveTable }