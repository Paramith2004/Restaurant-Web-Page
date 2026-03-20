'use client';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
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

export default function Home() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const fetchMenu = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:8081/api/menu');
      const data = await res.json();
      setMenuItems(data);
    } catch {
      console.error('Failed to load menu');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { fetchMenu(); }, 0);
    return () => clearTimeout(timer);
  }, [fetchMenu]);

  return (
      <main style={{ background: '#0D0D0D', minHeight: '100vh' }}>

        <Navbar />

        {/* HERO */}
        <section style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          padding: '80px 24px 60px', position: 'relative', overflow: 'hidden',
          background: '#0D0D0D'
        }}>
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0,
            width: '55%', zIndex: 0
          }} className="desktop-nav">
            <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80"
                alt="Restaurant"
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to right, #0D0D0D 30%, rgba(13,13,13,0.3) 100%)'
            }} />
          </div>

          <div style={{ maxWidth: 650, position: 'relative', zIndex: 1, width: '100%' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.3)',
              padding: '8px 20px', borderRadius: 100, fontSize: 12,
              color: '#C9A84C', letterSpacing: 2,
              textTransform: 'uppercase', marginBottom: 24
            }}>
              ✦ Kandy&apos;s Finest Restaurant
            </div>
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(40px, 7vw, 90px)',
              fontWeight: 900, lineHeight: 1.05,
              color: '#fff', marginBottom: 20
            }}>
              Every Meal is<br />
              <em style={{ color: '#C9A84C' }}>A Masterpiece</em>
            </h1>
            <p style={{
              fontSize: 16, color: '#9A9080',
              lineHeight: 1.7, marginBottom: 36, maxWidth: 480
            }}>
              Welcome to Dinu&apos;s Tasty — where authentic flavors meet warm hospitality.
              Experience the best cuisine in the heart of Kandy, Sri Lanka. 🇱🇰
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/menu" style={{
                background: '#C9A84C', color: '#0D0D0D',
                padding: '14px 28px', borderRadius: 4,
                fontWeight: 700, fontSize: 15, textDecoration: 'none'
              }}>
                🍛 Explore Menu
              </Link>
              <Link href="/order" style={{
                border: '1px solid rgba(201,168,76,0.4)', color: '#C9A84C',
                padding: '14px 28px', borderRadius: 4,
                fontWeight: 600, fontSize: 15, textDecoration: 'none'
              }}>
                📦 Order Now
              </Link>
            </div>
          </div>
        </section>

        {/* INFO CARDS */}
        <section style={{ padding: '60px 24px', background: '#1A1A1A' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 16
          }}>
            {[
              { icon: '📍', title: 'Location', desc: 'Kandy, Sri Lanka' },
              { icon: '⏰', title: 'Hours', desc: '8am – 10pm Daily' },
              { icon: '📞', title: 'Phone', desc: '0771 234 567' },
              { icon: '🚗', title: 'Delivery', desc: 'PickMe & Uber Eats' },
            ].map((item) => (
                <div key={item.title} style={{
                  background: '#252525',
                  border: '1px solid rgba(201,168,76,0.15)',
                  borderRadius: 12, padding: '20px 16px', textAlign: 'center'
                }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{item.icon}</div>
                  <div style={{ color: '#C9A84C', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
                    {item.title}
                  </div>
                  <div style={{ color: '#E8E0D0', fontSize: 14, fontWeight: 600 }}>{item.desc}</div>
                </div>
            ))}
          </div>
        </section>

        {/* MENU PREVIEW */}
        <section style={{ padding: '60px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ color: '#C9A84C', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>
              ── Our Menu ──
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, color: '#fff' }}>
              Crafted With <em style={{ color: '#C9A84C' }}>Passion</em>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {menuItems.slice(0, 4).map((item) => (
                <div key={item.id} style={{
                  background: '#1A1A1A',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12, overflow: 'hidden'
                }}>
                  <div style={{ height: 180, position: 'relative', overflow: 'hidden' }}>
                    <img
                        src={getCategoryImage(item.category)}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(13,13,13,0.8), transparent)'
                    }} />
                    <div style={{
                      position: 'absolute', bottom: 10, right: 10,
                      fontSize: 24, background: 'rgba(0,0,0,0.6)',
                      borderRadius: '50%', width: 40, height: 40,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {item.emoji || '🍛'}
                    </div>
                  </div>
                  <div style={{ padding: 16 }}>
                    <div style={{ color: '#C9A84C', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
                      {item.category}
                    </div>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                      {item.name}
                    </div>
                    <div style={{ color: '#9A9080', fontSize: 13, marginBottom: 12 }}>
                      {item.description}
                    </div>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: '#C9A84C' }}>
                      Rs. {item.price}
                    </div>
                  </div>
                </div>
            ))}
          </div>
          {menuItems.length === 0 && (
              <div style={{ textAlign: 'center', color: '#9A9080', padding: 40 }}>
                No menu items yet!
              </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link href="/menu" style={{
              background: '#C9A84C', color: '#0D0D0D',
              padding: '14px 32px', borderRadius: 4,
              fontWeight: 700, fontSize: 15, textDecoration: 'none'
            }}>
              View Full Menu →
            </Link>
          </div>
        </section>

        {/* ABOUT */}
        <section style={{ padding: '60px 24px', background: '#1A1A1A' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 40, alignItems: 'center'
          }}>
            <div style={{ borderRadius: 16, overflow: 'hidden', height: 360 }}>
              <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
                  alt="Restaurant"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div style={{ color: '#C9A84C', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>── About Us ──</div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#fff', marginBottom: 16 }}>
                Taste the <em style={{ color: '#C9A84C' }}>Difference</em>
              </h2>
              <p style={{ color: '#9A9080', fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                Dinu&apos;s Tasty has been serving the people of Kandy with exceptional food
                and warm hospitality every day from 8am to 10pm.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { icon: '🌿', title: 'Fresh Ingredients', desc: 'Locally sourced daily' },
                  { icon: '👨‍🍳', title: 'Expert Chefs', desc: 'Authentic recipes' },
                  { icon: '⏰', title: 'Open Every Day', desc: '8am – 10pm' },
                  { icon: '🚗', title: 'Fast Delivery', desc: 'PickMe & Uber Eats' },
                ].map(f => (
                    <div key={f.title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 40, height: 40, flexShrink: 0,
                        background: 'rgba(201,168,76,0.1)',
                        border: '1px solid rgba(201,168,76,0.2)',
                        borderRadius: 8,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18
                      }}>
                        {f.icon}
                      </div>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{f.title}</div>
                        <div style={{ color: '#9A9080', fontSize: 12 }}>{f.desc}</div>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section style={{ padding: '60px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ color: '#C9A84C', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>── Gallery ──</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#fff' }}>
              Food That <em style={{ color: '#C9A84C' }}>Speaks</em>
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 12
          }}>
            {[
              'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80',
              'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80',
              'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80',
              'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80',
              'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80',
              'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
            ].map((src, i) => (
                <div key={i} style={{
                  borderRadius: 10, overflow: 'hidden',
                  height: 180, position: 'relative'
                }}>
                  <img src={src} alt="Food" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{
          background: '#080808',
          borderTop: '1px solid rgba(201,168,76,0.15)',
          padding: '48px 24px 32px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 36, marginBottom: 36
          }}>
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 900, color: '#C9A84C', marginBottom: 12 }}>
                Dinu&apos;s <span style={{ color: '#fff', fontStyle: 'italic', fontWeight: 400 }}>Tasty</span>
              </div>
              <p style={{ color: '#9A9080', fontSize: 14, lineHeight: 1.7 }}>
                Kandy&apos;s finest restaurant serving authentic Sri Lankan cuisine.
              </p>
            </div>
            <div>
              <div style={{ color: '#C9A84C', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Quick Links</div>
              {[['Home', '/'], ['Menu', '/menu'], ['Order', '/order'], ['Track Order', '/track']].map(([label, href]) => (
                  <div key={label} style={{ marginBottom: 10 }}>
                    <Link href={href} style={{ color: '#9A9080', textDecoration: 'none', fontSize: 14 }}>{label}</Link>
                  </div>
              ))}
            </div>
            <div>
              <div style={{ color: '#C9A84C', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Contact</div>
              {['📞 0771 234 567', '📍 Kandy, Sri Lanka', '⏰ 8am – 10pm Daily'].map(item => (
                  <div key={item} style={{ color: '#9A9080', fontSize: 14, marginBottom: 10 }}>{item}</div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 20, textAlign: 'center' }}>
            <p style={{ color: '#9A9080', fontSize: 13 }}>
              © 2026 Dinu&apos;s Tasty. Developed by Paramith Kavisha
            </p>
          </div>
        </footer>

      </main>
  );
}