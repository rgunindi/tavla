import { CLIENT_NAME } from 'utils/constants'
import { TTile } from '../types/tile'

export function addUUID(tile: TTile, index?: number) {
    return {
        ...tile,
        uuid: index ? `${Date.now()}_${index}` : Date.now().toString(),
    }
}

const endpoint = process.env.GEOCODER_HOST ?? 'https://api.entur.io/geocoder/v1'

type TPartialGeoResponse = {
    features: Array<{
        properties: {
            id?: string
            label?: string
        }
    }>
}

export async function fetchItems(
    text: string,
): Promise<Array<{ value?: string; label: string }>> {
    if (!text || text.length < 3) return []

    const searchParams = new URLSearchParams({
        lang: 'no',
        size: '5',
        layers: 'venue',
        text,
    })

    return fetch(`${endpoint}/autocomplete?${searchParams}`, {
        headers: {
            'ET-Client-Name': CLIENT_NAME,
        },
    })
        .then((res) => res.json())
        .then((data: TPartialGeoResponse) => {
            const features = data['features']
            const items = features.map(({ properties }) => ({
                value: properties.id,
                label: properties.label || '',
            }))

            return items
        })
}