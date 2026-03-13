'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getMenuItems } from '@/lib/api';

export default function Home() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    getMenuItems().then(res => setMenuItems(res.data));
  }, []);

  return (
      <main style={{ background: '#0D0D0D', minHeight: '100vh' }}>

        {/* NAVBAR */}
        <nav style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          padding: '20px 60px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(13,13,13,0.95)',
          borderBottom: '1px solid rgba(201,168,76,0.2)'
        }}>
        <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 900, color: '#C9A84C' }}>
          Dinu's <span style={{ color: '#fff', fontStyle: 'italic', fontWeight: 400 }}>Tasty</span>
        </span>
          <div style={{ display: 'flex', gap: 32 }}>
            {['/', '/menu', '/order', '/admin'].map((href, i) => (
                <Link key={href} href={href} style={{ color: '#9A9080', textDecoration: 'none', fontSize: 14, fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase' }}>
                  {['Home', 'Menu', 'Order', 'Admin'][i]}
                </Link>
            ))}
          </div>
          <Link href="/order" style={{
            background: '#C9A84C', color: '#0D0D0D',
            padding: '10px 24px', borderRadius: 4,
            fontWeight: 700, textDecoration: 'none', fontSize: 14
          }}>
            Order Now
          </Link>
        </nav>

        {/* HERO */}
        <section style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          padding: '0 60px',
          background: 'radial-gradient(ellipse at 70% 50%, rgba(201,168,76,0.08) 0%, transparent 60%), #0D0D0D'
        }}>
          <div style={{ maxWidth: 700 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)',
              padding: '8px 20px', borderRadius: 100, fontSize: 13,
              color: '#C9A84C', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 28
            }}>
              ✦ Kandy's Finest Restaurant
            </div>
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(52px, 7vw, 90px)',
              fontWeight: 900, lineHeight: 1.05, color: '#fff', marginBottom: 24
            }}>
              Every Meal is<br />
              <em style={{ color: '#C9A84C' }}>A Masterpiece</em>
            </h1>
            <p style={{ fontSize: 18, color: '#9A9080', lineHeight: 1.7, marginBottom: 44, maxWidth: 480 }}>
              Welcome to Dinu's Tasty — where authentic flavors meet warm hospitality.
              Experience the best cuisine in the heart of Kandy, Sri Lanka. 🇱🇰
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              <Link href="/menu" style={{
                background: '#C9A84C', color: '#0D0D0D',
                padding: '16px 36px', borderRadius: 4,
                fontWeight: 700, fontSize: 15, textDecoration: 'none'
              }}>
                🍛 Explore Menu
              </Link>
              <Link href="/order" style={{
                border: '1px solid rgba(201,168,76,0.4)', color: '#C9A84C',
                padding: '16px 36px', borderRadius: 4,
                fontWeight: 600, fontSize: 15, textDecoration: 'none'
              }}>
                📦 Order Now
              </Link>
            </div>
          </div>
        </section>

        {/* INFO CARDS */}
        <section style={{ padding: '80px 60px', background: '#1A1A1A' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {[
              { icon: '📍', title: 'Location', desc: 'Kandy, Sri Lanka' },
              { icon: '⏰', title: 'Hours', desc: 'Every day 8am – 10pm' },
              { icon: '📞', title: 'Phone', desc: '0771 234 567' },
              { icon: '🚗', title: 'Delivery', desc: 'PickMe & Uber Eats' },
            ].map((item) => (
                <div key={item.title} style={{
                  background: '#252525', border: '1px solid rgba(201,168,76,0.15)',
                  borderRadius: 12, padding: 28, textAlign: 'center'
                }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div>
                  <div style={{ color: '#C9A84C', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>{item.title}</div>
                  <div style={{ color: '#E8E0D0', fontSize: 16, fontWeight: 600 }}>{item.desc}</div>
                </div>
            ))}
          </div>
        </section>

        {/* MENU PREVIEW */}
        <section style={{ padding: '80px 60px' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ color: '#C9A84C', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>── Our Menu ──</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 48, fontWeight: 900, color: '#fff' }}>
              Crafted With <em style={{ color: '#C9A84C' }}>Passion</em>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
            {menuItems.slice(0, 4).map((item: any) => (
                <div key={item.id} style={{
                  background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12, overflow: 'hidden'
                }}>
                  <div style={{
                    height: 160, background: 'linear-gradient(135deg,#1a1200,#2a1e00)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64
                  }}>
                    {item.emoji || '🍛'}
                  </div>
                  <div style={{ padding: 20 }}>
                    <div style={{ color: '#C9A84C', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>{item.category}</div>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{item.name}</div>
                    <div style={{ color: '#9A9080', fontSize: 13, marginBottom: 16 }}>{item.description}</div>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: '#C9A84C' }}>Rs. {item.price}</div>
                  </div>
                </div>
            ))}
          </div>
          {menuItems.length === 0 && (
              <div style={{ textAlign: 'center', color: '#9A9080', padding: 40 }}>
                No menu items yet — add some from the Admin panel! 😊
              </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/menu" style={{
              background: '#C9A84C', color: '#0D0D0D',
              padding: '16px 36px', borderRadius: 4,
              fontWeight: 700, fontSize: 15, textDecoration: 'none'
            }}>
              View Full Menu →
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{
          background: '#080808', borderTop: '1px solid rgba(201,168,76,0.15)',
          padding: '40px 60px', textAlign: 'center'
        }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 900, color: '#C9A84C', marginBottom: 12 }}>
            Dinu's <span style={{ color: '#fff', fontStyle: 'italic', fontWeight: 400 }}>Tasty</span>
          </div>
          <p style={{ color: '#9A9080', fontSize: 14, marginBottom: 8 }}>Kandy, Sri Lanka 🇱🇰 | 0771 234 567 | Every day 8am – 10pm</p>
          <p style={{ color: '#9A9080', fontSize: 12 }}>© 2026 Dinu's Tasty. Developed by Paramith Kavisha</p>
        </footer>

      </main>
  );
}