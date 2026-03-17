'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface MenuItem {
    id: number;
    name: string;
    price: number;
    category: string;
    emoji: string;
    description: string;
}

function getCategoryImage(category: string): string {
    const images: Record<string, string> = {
        rice: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80',
        noodles: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&q=80',
        short: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80',
        drinks: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80',
        desserts: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&q=80',
    };
    return images[category] || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80';
}

export default function MenuPage() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [activeCategory, setActiveCategory] = useState('all');

    const categories = [
        { key: 'all', label: 'All Items', emoji: '🍽️' },
        { key: 'rice', label: 'Rice & Curry', emoji: '🍛' },
        { key: 'noodles', label: 'Noodles', emoji: '🍜' },
        { key: 'short', label: 'Short Eats', emoji: '🥪' },
        { key: 'drinks', label: 'Drinks', emoji: '🥤' },
        { key: 'desserts', label: 'Desserts', emoji: '🍮' },
    ];

    const fetchItems = useCallback(async (category: string) => {
        try {
            if (category === 'all') {
                const res = await fetch('http://localhost:8081/api/menu');
                setMenuItems(await res.json());
            } else {
                const res = await fetch(`http://localhost:8081/api/menu/category/${category}`);
                setMenuItems(await res.json());
            }
        } catch {
            console.error('Failed to load menu');
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchItems(activeCategory);
        }, 0);
        return () => clearTimeout(timer);
    }, [activeCategory, fetchItems]);

    return (
        <main style={{ background: '#0D0D0D', minHeight: '100vh', paddingTop: 80 }}>

            {/* NAVBAR */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                padding: '20px 60px', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center',
                background: 'rgba(13,13,13,0.95)',
                borderBottom: '1px solid rgba(201,168,76,0.2)'
            }}>
                <Link href="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 900, color: '#C9A84C', textDecoration: 'none' }}>
                    Dinu&apos;s <span style={{ color: '#fff', fontStyle: 'italic', fontWeight: 400 }}>Tasty</span>
                </Link>
                <div style={{ display: 'flex', gap: 32 }}>
                    {(['/', '/menu', '/order', '/track'] as const).map((href, i) => (
                        <Link key={href} href={href} style={{
                            color: href === '/menu' ? '#C9A84C' : '#9A9080',
                            textDecoration: 'none', fontSize: 14,
                            fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase'
                        }}>
                            {['Home', 'Menu', 'Order', 'Track'][i]}
                        </Link>
                    ))}
                </div>
                <Link href="/order" style={{
                    background: '#C9A84C', color: '#0D0D0D',
                    padding: '10px 24px', borderRadius: 4,
                    fontWeight: 700, textDecoration: 'none', fontSize: 14
                }}>Order Now</Link>
            </nav>

            {/* HERO BANNER */}
            <div style={{ position: 'relative', height: 300, overflow: 'hidden' }}>
                <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80"
                    alt="Menu banner"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(13,13,13,0.75)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ color: '#C9A84C', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>── Our Menu ──</div>
                    <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 56, fontWeight: 900, color: '#fff' }}>
                        Crafted With <em style={{ color: '#C9A84C' }}>Passion</em>
                    </h1>
                    <p style={{ color: '#9A9080', fontSize: 16, marginTop: 12 }}>Every dish made fresh daily with love and care</p>
                </div>
            </div>

            {/* CATEGORY FILTER */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: '32px 60px', flexWrap: 'wrap', background: '#1A1A1A' }}>
                {categories.map(cat => (
                    <button key={cat.key} onClick={() => setActiveCategory(cat.key)} style={{
                        padding: '10px 24px', borderRadius: 100,
                        border: '1px solid rgba(201,168,76,0.2)',
                        background: activeCategory === cat.key ? '#C9A84C' : 'transparent',
                        color: activeCategory === cat.key ? '#0D0D0D' : '#9A9080',
                        fontWeight: activeCategory === cat.key ? 700 : 500,
                        fontSize: 14, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                    }}>
                        {cat.emoji} {cat.label}
                    </button>
                ))}
            </div>

            {/* MENU GRID */}
            <section style={{ padding: '40px 60px 80px' }}>
                {menuItems.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#9A9080', padding: 80 }}>
                        <div style={{ fontSize: 64, marginBottom: 16 }}>🍽️</div>
                        <p style={{ fontSize: 18 }}>No items yet — check back soon!</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                        {menuItems.map((item) => (
                            <div key={item.id} style={{
                                background: '#1A1A1A',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: 12, overflow: 'hidden',
                                transition: 'transform 0.3s',
                            }}>
                                <div style={{ height: 220, position: 'relative', overflow: 'hidden' }}>
                                    <img
                                        src={getCategoryImage(item.category)}
                                        alt={item.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                                    />
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: 'linear-gradient(to top, rgba(13,13,13,0.9) 0%, transparent 60%)'
                                    }} />
                                    <div style={{
                                        position: 'absolute', bottom: 12, left: 16, right: 16,
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                    }}>
                                        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: '#fff' }}>
                                            {item.name}
                                        </div>
                                        <div style={{ fontSize: 28 }}>{item.emoji || '🍛'}</div>
                                    </div>
                                </div>
                                <div style={{ padding: 20 }}>
                                    <div style={{ color: '#C9A84C', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>{item.category}</div>
                                    <div style={{ color: '#9A9080', fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>{item.description}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: '#C9A84C' }}>
                                            Rs. {item.price}
                                        </div>
                                        <Link href="/order" style={{
                                            background: '#C9A84C', color: '#0D0D0D',
                                            padding: '8px 20px', borderRadius: 4,
                                            fontWeight: 700, fontSize: 13, textDecoration: 'none'
                                        }}>
                                            Order →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* FOOTER */}
            <footer style={{
                background: '#080808', borderTop: '1px solid rgba(201,168,76,0.15)',
                padding: '40px 60px', textAlign: 'center'
            }}>
                <p style={{ color: '#9A9080', fontSize: 14 }}>© 2026 Dinu&apos;s Tasty | Kandy, Sri Lanka 🇱🇰</p>
            </footer>

        </main>
    );
}