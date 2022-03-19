import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'

import NavLink from '@components/NavLink'

const Header = () => {
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  return (
    <nav className="flex flex-row justify-between">
      <div>
        <NavLink href="/">Home</NavLink>
        {!loading && session && <NavLink href="/relink">List my pages</NavLink>}
      </div>
      <div>Link Notion Pages</div>
      <div className="flex flex-row">
        {loading && <p>loading user</p>}
        {!loading && !session && (
          <NavLink href="/api/auth/signin">Log in</NavLink>
        )}
        {!loading && session && (
          <div className="flex flex-row space-x-4 items-center">
            <Image
              className="rounded-full"
              src={session!.user!.image!}
              height={32}
              width={32}
            />
            <p>{session!.user!.name}</p>
            <button onClick={() => signOut()}>Sign out</button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Header
