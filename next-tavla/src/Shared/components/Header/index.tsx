import TavlaLogo from 'assets/logos/Tavla-white.svg'
import TavlaLogoLight from 'assets/logos/Tavla-blue.svg'
import Image from 'next/image'
import classes from './styles.module.css'
import { TTheme } from 'types/settings'
import { Clock } from 'components/Clock'

function Header({ theme, showClock }: { theme?: TTheme; showClock?: boolean }) {
    return (
        <div className={classes.headerWrapper}>
            <div>
                {theme === 'light' ? (
                    <Image
                        src={TavlaLogoLight}
                        alt="Entur Tavla logo"
                        width={117}
                        height={20}
                        className={classes.logo}
                    />
                ) : (
                    <Image
                        src={TavlaLogo}
                        alt="Entur Tavla logo"
                        width={117}
                        height={20}
                        className={classes.logo}
                    />
                )}
            </div>
            {showClock && <Clock />}
        </div>
    )
}

export { Header }
