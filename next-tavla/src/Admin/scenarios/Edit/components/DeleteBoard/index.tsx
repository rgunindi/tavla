import { useToggle } from 'hooks/useToggle'
import { PrimaryButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { TavlaError } from 'Admin/types/error'
import { useToast } from '@entur/alert'
import { useRouter } from 'next/router'
import { DeleteModal } from 'Admin/components/DeleteModal'
import { TBoard, TBoardID } from 'types/settings'
import { fetchDeleteBoard } from 'Admin/utils/fetch'

function DeleteBoard({ board }: { board: TBoard }) {
    const [showModal, openModal, closeModal] = useToggle()
    const { addToast } = useToast()
    const router = useRouter()

    const removeBoard = async () => {
        try {
            if (!board.id)
                throw new TavlaError({
                    code: 'NOT_FOUND',
                    message: 'Board not found',
                })
            await fetchDeleteBoard(board.id as TBoardID)
            router.push('/edit/boards')
        } catch (error) {
            addToast({
                title: 'Noe gikk galt',
                content: 'Kunne ikke slette tavle',
                variant: 'info',
            })
        }
    }

    return (
        <>
            <PrimaryButton onClick={openModal}>
                Slett tavle
                <DeleteIcon />
            </PrimaryButton>
            <DeleteModal
                board={board}
                isOpen={showModal}
                closeModal={closeModal}
                deleteHandler={removeBoard}
            />
        </>
    )
}

export { DeleteBoard }
