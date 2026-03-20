'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = [
        { href: '/', label: 'Home' },
        { href: '/menu', label: 'Menu' },
        { href: '/order', label: 'Order' },
        { href: '/track', label: 'Track' },
    ];

    return (
        <>
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                padding: '16px 24px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: scrolled ? 'rgba(13,13,13,0.98)' : 'rgba(13,13,13,0.95)',
                borderBottom: '1px solid rgba(201,168,76,0.2)',
                transition: 'all 0.3s'
            }}>
                {/* LOGO */}
                <Link href="/" style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: 24, fontWeight: 900,
                    color: '#C9A84C', textDecoration: 'none'
                }}>
                    Dinu&apos;s <span style={{ color: '#fff', fontStyle: 'italic', fontWeight: 400 }}>Tasty</span>
                </Link>

                {/* DESKTOP LINKS */}
                <div className="desktop-nav" style={{ gap: 32, alignItems: 'center' }}>
                    {links.map(link => (
                        <Link key={link.href} href={link.href} style={{
                            color: pathname === link.href ? '#C9A84C' : '#9A9080',
                            textDecoration: 'none', fontSize: 14,
                            fontWeight: 500, letterSpacing: 1,
                            textTransform: 'uppercase'
                        }}>
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* DESKTOP CTA */}
                <Link href="/order" className="desktop-nav" style={{
                    background: '#C9A84C', color: '#0D0D0D',
                    padding: '10px 24px', borderRadius: 4,
                    fontWeight: 700, textDecoration: 'none', fontSize: 14
                }}>
                    Order Now
                </Link>

                {/* HAMBURGER */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{
                        background: 'transparent', border: 'none',
                        cursor: 'pointer', padding: 8,
                        flexDirection: 'column', gap: 5
                    }}
                >
          <span style={{
              display: 'block', width: 24, height: 2,
              background: '#C9A84C', transition: 'all 0.3s',
              transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none'
          }} />
                    <span style={{
                        display: 'block', width: 24, height: 2,
                        background: '#E8E0D0', transition: 'all 0.3s',
                        opacity: menuOpen ? 0 : 1
                    }} />
                    <span style={{
                        display: 'block', width: 24, height: 2,
                        background: '#C9A84C', transition: 'all 0.3s',
                        transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none'
                    }} />
                </button>
            </nav>

            {/* MOBILE DROPDOWN MENU */}
            {menuOpen && (
                <div style={{
                    position: 'fixed', top: 65, left: 0, right: 0, zIndex: 999,
                    background: '#1A1A1A',
                    borderBottom: '1px solid rgba(201,168,76,0.2)',
                    padding: '16px 24px',
                    display: 'flex', flexDirection: 'column', gap: 0
                }}>
                    {links.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            style={{
                                color: pathname === link.href ? '#C9A84C' : '#E8E0D0',
                                textDecoration: 'none', fontSize: 17,
                                fontWeight: pathname === link.href ? 700 : 500,
                                padding: '16px 0',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                letterSpacing: 1, textTransform: 'uppercase',
                                display: 'block'
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/order"
                        onClick={() => setMenuOpen(false)}
                        style={{
                            background: '#C9A84C', color: '#0D0D0D',
                            padding: '16px 24px', borderRadius: 8,
                            fontWeight: 700, textDecoration: 'none',
                            fontSize: 16, textAlign: 'center',
                            marginTop: 16, display: 'block'
                        }}
                    >
                        📦 Order Now
                    </Link>
                </div>
            )}
        </>
    );
}