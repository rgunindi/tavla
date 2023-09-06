import { Heading1 } from '@entur/typography'
import classes from './styles.module.css'
import { BoardList } from '../BoardList'
import { TSettings } from 'types/settings'
import dynamic from 'next/dynamic'

function Boards({
    boards,
}: {
    boards: { id: string; settings?: TSettings }[]
}) {
    return (
        <div className={classes.adminWrapper}>
            <Heading1>Mine Tavler</Heading1>
            <div>
                <BoardList boards={boards} />
            </div>
        </div>
    )
}

const NonSSRAdmin = dynamic(() => Promise.resolve(Boards), { ssr: false })

export { NonSSRAdmin as Boards }