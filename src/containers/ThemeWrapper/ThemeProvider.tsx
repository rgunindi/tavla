import React, { FC, useState, useMemo, useEffect } from 'react'

import { Theme } from '../../types'
import { useSettingsContext } from '../../settings'

type ThemeContextType = {
    themeContext: Theme
    setThemeContext: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextType>({
    themeContext: undefined,
    setThemeContext: (): void => {
        return
    },
})

const ThemeProvider: FC = (props): JSX.Element => {
    const [settings] = useSettingsContext()
    const [themeContext, setThemeContext] = useState<Theme>(undefined)

    useEffect(() => {
        if (settings && settings.theme && themeContext == undefined) {
            setThemeContext(settings.theme)
        }
    }, [settings, themeContext])

    const contextValue = useMemo(
        (): ThemeContextType => ({ themeContext, setThemeContext }),
        [themeContext],
    )
    return (
        <div className={`${themeContext}-theme`}>
            <ThemeContext.Provider value={contextValue} {...props} />
        </div>
    )
}

export const useTheme = (): ThemeContextType => {
    return React.useContext(ThemeContext)
}

export default ThemeProvider