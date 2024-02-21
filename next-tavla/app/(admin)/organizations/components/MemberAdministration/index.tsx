import { Heading2, Paragraph } from '@entur/typography'
import { MemberList } from './MemberList'
import { TOrganizationID, TUser, TUserID } from 'types/settings'
import { InviteUser } from './InviteUser'
import { Contrast } from 'Admin/components/Contrast'

function MemberAdministration(props: {
    oid?: TOrganizationID
    uid?: TUserID
    members: TUser[]
}) {
    return (
        <Contrast className="flexColumn g-4">
            <Heading2>Administrer medlemmer</Heading2>

            <Paragraph>
                Her kan du administrere medlemmer av organisasjonen. Du kan se
                hvem som er medlem, legge til medlemmer og fjerne medlemmer.
            </Paragraph>

            <InviteUser oid={props.oid} />
            <MemberList {...props} />
        </Contrast>
    )
}

export { MemberAdministration }