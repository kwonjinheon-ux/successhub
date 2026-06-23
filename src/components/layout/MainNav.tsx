import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/community", label: "Community" },
  { href: "/market", label: "Market" },
  { href: "/profile", label: "Profile" }
];

export function MainNav() {
  return (
    <nav className="main-nav" aria-label="Primary navigation">
      <Link className="brand" href="/">
        Success Hub 2026
      </Link>
      <div className="nav-links">
        {links.map((link) => (
          <Link href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
