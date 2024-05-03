import { TTransportMode, TTransportSubmode } from 'types/graphql-schema'
import { TransportIcon } from 'components/TransportIcon'

const transportModeNames: Record<TTransportMode, string> = {
    air: 'Fly',
    bus: 'Buss',
    cableway: 'Taubane',
    water: 'Båt',
    funicular: 'Kabelbane',
    lift: 'Heis',
    rail: 'Tog',
    metro: 'T-bane',
    tram: 'Trikk',
    trolleybus: 'Trolley-buss',
    monorail: 'Énskinnebane',
    coach: 'Langdistansebuss',
    unknown: 'Ukjent',
}

function TravelTag({
    transportMode,
    publicCode,
    transportSubmode,
}: {
    transportMode: TTransportMode
    publicCode: string
    transportSubmode?: TTransportSubmode
}) {
    return (
        <div
            aria-label={`${transportModeNames[transportMode]} - linje ${publicCode}`}
            className={`flex items-center justify-between w-full h-full pl-2 rounded-sm font-bold text-background bg-${
                transportMode ?? 'unknown'
            }`}
        >
            <TransportIcon
                className="w-em-2 h-em-2 fill-background"
                transportMode={transportMode}
                transportSubmode={transportSubmode}
            />
            <div className="flex flex-row items-center justify-center w-full h-full">
                {publicCode}
            </div>
        </div>
    )
}

export { TravelTag }
