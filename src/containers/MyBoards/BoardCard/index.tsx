import React, { useState, useCallback, useEffect } from 'react'

import { Heading3 } from '@entur/typography'
import { LinkIcon, ClockIcon } from '@entur/icons'

import { Settings } from '../../../settings'
import { ThemeDashbboardPreview } from '../../../assets/icons/ThemeDashboardPreview'
import { persist } from '../../../settings/FirestoreStorage'

import './styles.scss'

const DAYS = ['søn', 'man', 'tir', 'ons', 'tor', 'fre', 'lør']

const MONTHS = [
    'januar',
    'februar',
    'mars',
    'april',
    'mai',
    'juni',
    'juli',
    'august',
    'september',
    'oktober',
    'november',
    'desember',
]

function createTimeString(date: Date, modified: boolean): string {
    const currentYear = new Date().getFullYear()

    const dateString = `${DAYS[date.getDay()]} ${date.getDate()}. ${
        MONTHS[date.getMonth()]
    }`
    const hours = `${date.getHours()}`.padStart(2, '0')
    const minutes = `${date.getMinutes()}`.padStart(2, '0')
    const timeString = `${hours}:${minutes}`
    const yearString =
        currentYear == date.getFullYear() ? '' : `${date.getFullYear()}`
    const prependWords = modified ? 'Sist endret' : 'Ble laget'
    return `${prependWords} ${dateString} ${yearString} ${timeString}`
}

function BoardCard({
    settings,
    id,
    timestamp,
    created,
    className,
    history,
}: Props): JSX.Element {
    const [titleEditMode, setTitleEditMode] = useState<boolean>(false)
    const [boardTitle, setBoardTitle] = useState<string>('Uten tittel')

    useEffect(() => {
        if (!settings.boardName) return
        setBoardTitle(settings.boardName)
    }, [settings.boardName])

    const onClickPreview = useCallback(() => {
        event.preventDefault()
        history.push(`/t/${id}`)
    }, [id, history])

    const onClickTitle = useCallback(() => {
        event.preventDefault()
        setTitleEditMode(true)
    }, [setTitleEditMode])

    const onChangeTitle = useCallback(
        (e) => {
            event.preventDefault()
            const newTitle = e.target.value
            setTitleEditMode(false)
            if (newTitle == settings.boardName) return

            setBoardTitle(newTitle)
            persist(id, 'boardName', newTitle)
        },
        [id, settings.boardName],
    )

    const preview = ThemeDashbboardPreview(settings.theme)
    const dashboardType = settings.dashboard || 'Chrono'
    const preferredDate = timestamp ? timestamp : created
    const timeString =
        preferredDate != undefined
            ? createTimeString(
                  preferredDate.toDate(),
                  preferredDate == timestamp,
              )
            : 'Ikke endret'
    const boardTitleElement = titleEditMode ? (
        <input
            className="board-card__text-container__title"
            defaultValue={boardTitle}
            autoFocus={true}
            onBlur={onChangeTitle}
            onKeyUp={(e): void => {
                e.preventDefault
                if (e.keyCode == 13) onChangeTitle(e)
            }}
        />
    ) : (
        <Heading3 className="board-card__text-container__title" margin="none">
            {boardTitle}
        </Heading3>
    )

    return (
        <div className={`board-card ${className ? className : ''}`}>
            <div onClick={onClickPreview}>
                <img
                    className="board-card__preview"
                    src={preview[`${dashboardType}`]}
                />
            </div>

            <div className="board-card__text-container">
                <span onClick={onClickTitle}>{boardTitleElement}</span>

                <div className="board-card__text-container__text">
                    <ClockIcon className="board-card__text-container__text__icon" />
                    <span className="board-card__text-container__text__description">
                        {timeString}
                    </span>
                </div>
                <div className="board-card__text-container__text">
                    <LinkIcon className="board-card__text-container__text__icon" />
                    <span className="board-card__text-container__text__description">
                        {`${window.location.host}/t/${id}`}
                    </span>
                </div>
            </div>
        </div>
    )
}

interface Props {
    settings: Settings
    id: string
    timestamp: firebase.firestore.Timestamp
    created: firebase.firestore.Timestamp
    className?: string
    history: any
}

export default BoardCard
