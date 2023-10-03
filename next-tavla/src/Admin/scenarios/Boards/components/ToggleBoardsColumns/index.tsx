import { IconButton, SecondarySquareButton } from '@entur/button'
import { AdjustmentsIcon, CloseIcon } from '@entur/icons'
import classes from './styles.module.css'
import {
    Popover,
    PopoverCloseButton,
    PopoverContent,
    PopoverTrigger,
} from '@entur/tooltip'
import { Heading4 } from '@entur/typography'
import {
    useBoardsSettings,
    useBoardsSettingsDispatch,
} from '../../utils/context'
import { Checkbox } from '@entur/form'
import { BoardsColumns, TBoardsColumn } from 'Admin/types/boards'

function ToggleBoardsColumns() {
    const { columns } = useBoardsSettings()
    const dispatch = useBoardsSettingsDispatch()

    return (
        <Popover>
            <PopoverTrigger>
                <SecondarySquareButton className="flexColumn">
                    <AdjustmentsIcon />
                </SecondarySquareButton>
            </PopoverTrigger>
            <PopoverContent>
                <div className="p-1">
                    <div className="flexRow">
                        <Heading4 as="h2" className="m-1">
                            Velg kolonner
                        </Heading4>
                        <PopoverCloseButton>
                            <IconButton aria-label="Lukk popover">
                                <CloseIcon aria-hidden="true" />
                            </IconButton>
                        </PopoverCloseButton>
                    </div>
                    <div className={classes.contentList}>
                        {Object.entries(BoardsColumns).map(([column]) => (
                            <Checkbox
                                key={column}
                                checked={columns.includes(
                                    column as TBoardsColumn,
                                )}
                                onChange={() =>
                                    dispatch({
                                        type: 'toggleColumn',
                                        column: column as TBoardsColumn,
                                    })
                                }
                            >
                                {BoardsColumns[column as TBoardsColumn]}
                            </Checkbox>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export { ToggleBoardsColumns }