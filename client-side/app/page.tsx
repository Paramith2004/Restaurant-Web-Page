'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';

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
    const timer = setTimeout(() => { fetchItems(activeCategory); }, 0);
    return () => clearTimeout(timer);
  }, [activeCategory, fetchItems]);

  return (
      <main style={{ background: '#0D0D0D', minHeight: '100vh', paddingTop: 65 }}>

        <Navbar />

        {/* HERO BANNER */}
        <div style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
          <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80"
              alt="Menu"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(13,13,13,0.75)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '0 24px', textAlign: 'center'
          }}>
            <div style={{ color: '#C9A84C', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>── Our Menu ──</div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 900, color: '#fff' }}>
              Crafted With <em style={{ color: '#C9A84C' }}>Passion</em>
            </h1>
            <p style={{ color: '#9A9080', fontSize: 15, marginTop: 10 }}>Every dish made fresh daily with love and care</p>
          </div>
        </div>

        {/* CATEGORY FILTER */}
        <div style={{
          display: 'flex', justifyContent: 'center',
          gap: 10, padding: '24px 16px',
          flexWrap: 'wrap', background: '#1A1A1A'
        }}>
          {categories.map(cat => (
              <button key={cat.key} onClick={() => setActiveCategory(cat.key)} style={{
                padding: '8px 16px', borderRadius: 100,
                border: '1px solid rgba(201,168,76,0.2)',
                background: activeCategory === cat.key ? '#C9A84C' : 'transparent',
                color: activeCategory === cat.key ? '#0D0D0D' : '#9A9080',
                fontWeight: activeCategory === cat.key ? 700 : 500,
                fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
              }}>
                {cat.emoji} {cat.label}
              </button>
          ))}
        </div>

        {/* MENU GRID */}
        <section style={{ padding: '32px 20px 80px' }}>
          {menuItems.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#9A9080', padding: 80 }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🍽️</div>
                <p style={{ fontSize: 18 }}>No items yet!</p>
              </div>
          ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                {menuItems.map((item) => (
                    <div key={item.id} style={{
                      background: '#1A1A1A',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 12, overflow: 'hidden'
                    }}>
                      <div style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
                        <img
                            src={getCategoryImage(item.category)}
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'linear-gradient(to top, rgba(13,13,13,0.9) 0%, transparent 60%)'
                        }} />
                        <div style={{
                          position: 'absolute', bottom: 12, left: 14, right: 14,
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: '#fff' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: 24 }}>{item.emoji || '🍛'}</div>
                        </div>
                      </div>
                      <div style={{ padding: 16 }}>
                        <div style={{ color: '#C9A84C', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>{item.category}</div>
                        <div style={{ color: '#9A9080', fontSize: 13, lineHeight: 1.5, marginBottom: 14 }}>{item.description}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: '#C9A84C' }}>
                            Rs. {item.price}
                          </div>
                          <Link href="/order" style={{
                            background: '#C9A84C', color: '#0D0D0D',
                            padding: '8px 18px', borderRadius: 4,
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
        <footer style={{ background: '#080808', borderTop: '1px solid rgba(201,168,76,0.15)', padding: '32px 24px', textAlign: 'center' }}>
          <p style={{ color: '#9A9080', fontSize: 14 }}>© 2026 Dinu&apos;s Tasty | Kandy, Sri Lanka 🇱🇰</p>
        </footer>

      </main>
  );
}