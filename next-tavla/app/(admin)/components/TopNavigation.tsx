'use client'
import Link from 'next/link'
import Image from 'next/image'
import TavlaLogoBlue from 'assets/logos/Tavla-blue.svg'
import { SideNavBar } from './SideNavBar'
import { HorizontalNavBar } from './HorizontalNavBar'
import { Login } from './Login'
import { TopNavigationItem } from '@entur/menu'
import { usePathname } from 'next/navigation'

function TopNavigation({ loggedIn }: { loggedIn: boolean }) {
    const pathname = usePathname()
    return (
        <nav className="container mx-auto flex flex-row justify-between items-center py-8">
            <Link href="/" aria-label="Tilbake til landingssiden">
                <Image src={TavlaLogoBlue} height={32} alt="" />
            </Link>
            <div className="flex flex-row items-center">
                <SideNavBar loggedIn={loggedIn} />
                <HorizontalNavBar loggedIn={loggedIn} />
                <div className="flex flex-row sm:gap-10">
                    {!loggedIn && (
                        <TopNavigationItem
                            active={pathname?.includes('/demo')}
                            as={Link}
                            href="/demo"
                        >
                            Prøv Tavla
                        </TopNavigationItem>
                    )}
                    <Login loggedIn={loggedIn} />
                </div>
            </div>
        </nav>
    )
}

export { TopNavigation }
