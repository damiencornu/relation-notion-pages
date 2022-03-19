import Link from 'next/link'
import { useRouter } from 'next/router'

const NavLink: React.FC<{ href: string }> = ({ children, href }) => {
  const router = useRouter()
  const isActive = router.pathname === href

  return (
    <Link href={href}>
      <a
        className={`ml-4 first:ml-0 ${isActive && 'border-b-2 border-current'}`}
      >
        {children}
      </a>
    </Link>
  )
}

export default NavLink
