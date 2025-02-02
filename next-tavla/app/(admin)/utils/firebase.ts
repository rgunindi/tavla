'use server'
import admin, { auth, firestore } from 'firebase-admin'
import {
    TBoard,
    TBoardID,
    TOrganization,
    TOrganizationID,
    TUser,
} from 'types/settings'
import { getUserFromSessionCookie } from './server'
import {
    getBoardsForOrganization,
    getOrganizationIfUserHasAccess,
} from '../actions'
import { getFormFeedbackForError } from '.'
import { getPrivateBoardsForUser } from '../actions'

initializeAdminApp()

export async function initializeAdminApp() {
    if (admin.apps.length <= 0) {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId: process.env.GOOGLE_PROJECT_ID,
        })
    }
}

export async function getConfig() {
    const doc = await firestore().collection('config').doc('env').get()
    return doc.data() as { bucket: string }
}

export async function verifySession(session?: string) {
    if (!session) return null
    try {
        return await auth().verifySessionCookie(session, true)
    } catch {
        return null
    }
}

export async function getBoard(bid: TBoardID) {
    const board = await firestore().collection('boards').doc(bid).get()
    return { id: board.id, ...board.data() } as TBoard
}

export async function getUser() {
    const user = await getUserFromSessionCookie()
    if (!user) return null
    const userDoc = await firestore().collection('users').doc(user.uid).get()
    return { ...userDoc.data(), uid: userDoc.id } as TUser
}

export async function hasBoardOwnerAccess(bid?: TBoardID) {
    if (!bid) return false

    const user = await getUser()
    const userOwnerAccess = user && user.owner?.includes(bid)

    if (user?.uid && !userOwnerAccess) {
        const organization = await getOrganizationWithBoard(bid)
        return (
            organization &&
            (organization.editors?.includes(user.uid) ||
                organization.owners?.includes(user.uid))
        )
    }
    return userOwnerAccess
}

export async function hasBoardEditorAccess(bid?: TBoardID) {
    if (!bid) return false

    const user = await getUser()
    const userEditorAccess =
        user && (user.editor?.includes(bid) || user.owner?.includes(bid))

    if (user?.uid && !userEditorAccess) {
        const organization = await getOrganizationWithBoard(bid)
        return (
            organization &&
            (organization.editors?.includes(user.uid) ||
                organization.owners?.includes(user.uid))
        )
    }
    return userEditorAccess
}

export async function getOrganizationWithBoard(bid: TBoardID) {
    const ref = await firestore()
        .collection('organizations')
        .where('boards', 'array-contains', bid)
        .get()
    return ref.docs.map((doc) => doc.data() as TOrganization)[0]
}

export async function deleteBoard(bid: TBoardID) {
    const user = await getUserFromSessionCookie()
    const access = await hasBoardOwnerAccess(bid)

    if (!user || !access)
        return getFormFeedbackForError('auth/operation-not-allowed')

    return Promise.all([
        firestore().collection('boards').doc(bid).delete(),
        firestore()
            .collection('users')
            .doc(user.uid)
            .update({
                owner: admin.firestore.FieldValue.arrayRemove(bid),
                editor: admin.firestore.FieldValue.arrayRemove(bid),
            }),
    ])
}

export async function deleteOrganization(oid: TOrganizationID) {
    const access = await userCanEditOrganization(oid)
    if (!access) throw 'auth/operation-not-allowed'
    await deleteOrganizationBoards(oid)
    await firestore().collection('organizations').doc(oid).delete()
}

export async function userCanEditOrganization(oid: TOrganizationID) {
    const user = await getUserFromSessionCookie()
    if (!user) return false

    const organization = await getOrganizationIfUserHasAccess(oid)
    if (!organization) return false
    return true
}

export async function deleteOrganizationBoards(oid: TOrganizationID) {
    const boards = await getBoardsForOrganization(oid)

    return Promise.all(
        boards
            .filter((board) => board !== undefined)
            .map(
                (board) => board?.id && deleteOrganizationBoard(oid, board.id),
            ),
    )
}

export async function deleteOrganizationBoard(
    oid: TOrganizationID,
    bid: TBoardID,
) {
    const access = await userCanEditOrganization(oid)
    if (!access) throw 'auth/operation-not-allowed'
    return firestore().collection('boards').doc(bid).delete()
}

export async function deleteUserBoards() {
    const user = await getUser()
    if (!user) return

    const boards = await getPrivateBoardsForUser()

    return Promise.all(
        boards
            .filter((board) => board !== undefined)
            .map((board) => board?.id && deleteBoard(board.id)),
    )
}
