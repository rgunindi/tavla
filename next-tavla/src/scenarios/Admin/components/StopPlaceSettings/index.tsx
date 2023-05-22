import React, { useEffect, useState } from 'react'
import {
    DndContext,
    useSensors,
    type DragEndEvent,
    useSensor,
    PointerSensor,
    KeyboardSensor,
    DraggableAttributes,
} from '@dnd-kit/core'
import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import {
    restrictToHorizontalAxis,
    restrictToParentElement,
} from '@dnd-kit/modifiers'
import { uniqBy, xor } from 'lodash'
import { fieldsNotNull } from 'utils/typeguards'
import { ColumnSettings } from '../ColumnSettings'
import { Columns, TColumn, TStopPlaceTile, TColumnSetting } from 'types/tile'
import { AddColumn } from '../AddColumn'
import { DeleteIcon } from '@entur/icons'
import { Loader } from '@entur/loader'
import { Switch } from '@entur/form'
import { ExpandablePanel } from '@entur/expand'
import { SortableTileWrapper } from '../SortableTileWrapper'
import classes from './styles.module.css'
import { TStopPlaceSettingsData } from 'types/graphql'
import { stopPlaceSettingsQuery } from 'graphql/queries/stopPlaceSettings'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { DraggableIcon } from '@entur/icons'

function StopPlaceSettings({
    tile,
    setTile,
    removeSelf,
}: {
    tile: TStopPlaceTile
    setTile: (newTile: TStopPlaceTile) => void
    removeSelf: () => void
}) {
    const columns = tile.columns ?? []

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    const [data, setData] = useState<TStopPlaceSettingsData | undefined>(
        undefined,
    )

    useEffect(() => {
        if (!tile.placeId) return
        stopPlaceSettingsQuery({ id: tile.placeId }).then(setData)
    }, [tile.placeId])

    const handleColumnSwap = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = columns.findIndex((col) => col.type === active.id)
            const newIndex = columns.findIndex((col) => col.type === over.id)

            setTile({
                ...tile,
                columns: arrayMove(columns, oldIndex, newIndex),
            })
        }
    }

    const addColumn = (newColumn: TColumn) => {
        setTile({
            ...tile,
            columns: [...(tile.columns || []), { type: newColumn }],
        })
    }

    const deleteColumn = (columnToDelete: TColumn) => {
        setTile({
            ...tile,
            columns: columns.filter((column) => column.type !== columnToDelete),
        })
    }

    const toggleLine = (line: string) => {
        if (!tile.whitelistedLines)
            return setTile({ ...tile, whitelistedLines: [line] })

        return setTile({
            ...tile,
            whitelistedLines: xor(tile.whitelistedLines, [line]),
        })
    }

    const lines =
        data?.stopPlace?.quays
            ?.flatMap((q) => q?.lines)
            .filter(fieldsNotNull) || []

    const uniqLines = uniqBy(lines, 'id').sort((a, b) =>
        a.publicCode.localeCompare(b.publicCode, 'no-NB', { numeric: true }),
    )

    const [handle, setHandle] = useState<
        | {
              attributes: DraggableAttributes
              listeners: SyntheticListenerMap | undefined
          }
        | undefined
    >(undefined)

    return (
        <SortableTileWrapper id={tile.uuid} setHandle={setHandle}>
            <div className={classes.stopPlaceTile}>
                <div className={classes.tileHeader}>
                    {!data ? <Loader /> : data.stopPlace?.name ?? tile.placeId}
                    <div className="flexBetween">
                        <button className="button" onClick={removeSelf}>
                            <DeleteIcon size={16} />
                        </button>
                        {handle && (
                            <div
                                className="button"
                                {...handle.attributes}
                                {...handle.listeners}
                                aria-label="TODO: tile endre rekkefolge"
                            >
                                <DraggableIcon size={16} />
                            </div>
                        )}
                    </div>
                </div>
                <div className={classes.lineToggleContainer}>
                    <ExpandablePanel title="Velg linjer">
                        {uniqLines.map((line) => (
                            <div key={line.id}>
                                <Switch
                                    checked={tile.whitelistedLines?.includes(
                                        line.id,
                                    )}
                                    onChange={() => {
                                        toggleLine(line.id)
                                    }}
                                >
                                    {line.publicCode} {line.name}
                                </Switch>
                            </div>
                        ))}
                    </ExpandablePanel>
                </div>
                <div className={classes.columnContainer}>
                    <DndContext
                        onDragEnd={handleColumnSwap}
                        sensors={sensors}
                        modifiers={[
                            restrictToHorizontalAxis,
                            restrictToParentElement,
                        ]}
                    >
                        <SortableContext
                            items={columns.map(({ type }) => type)}
                            strategy={horizontalListSortingStrategy}
                        >
                            {columns.map((column: TColumnSetting) => (
                                <ColumnSettings
                                    key={column.type}
                                    column={column}
                                    deleteColumn={() =>
                                        deleteColumn(column.type)
                                    }
                                />
                            ))}
                        </SortableContext>
                        {columns.length < Object.keys(Columns).length && (
                            <AddColumn
                                addColumn={addColumn}
                                selectedColumns={columns.map(
                                    ({ type }) => type,
                                )}
                            />
                        )}
                    </DndContext>
                </div>
            </div>
        </SortableTileWrapper>
    )
}

export { StopPlaceSettings }