'use client';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  emoji: string;
  description: string;
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
    const timer = setTimeout(() => {
      fetchMenu();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchMenu]);

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
          Dinu&apos;s <span style={{ color: '#fff', fontStyle: 'italic', fontWeight: 400 }}>Tasty</span>
        </span>
          <div style={{ display: 'flex', gap: 32 }}>
            {(['/', '/menu', '/order', '/track'] as const).map((href, i) => (
                <Link key={href} href={href} style={{
                  color: href === '/' ? '#C9A84C' : '#9A9080',
                  textDecoration: 'none', fontSize: 14,
                  fontWeight: 500, letterSpacing: 1,
                  textTransform: 'uppercase'
                }}>
                  {['Home', 'Menu', 'Order', 'Track'][i]}
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
          padding: '0 60px', position: 'relative', overflow: 'hidden',
          background: '#0D0D0D'
        }}>
          {/* Right side image */}
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0,
            width: '55%', zIndex: 0
          }}>
            <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80"
                alt="Restaurant interior"
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to right, #0D0D0D 30%, rgba(13,13,13,0.4) 100%)'
            }} />
          </div>

          {/* Left content */}
          <div style={{ maxWidth: 650, position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.3)',
              padding: '8px 20px', borderRadius: 100, fontSize: 13,
              color: '#C9A84C', letterSpacing: 2,
              textTransform: 'uppercase', marginBottom: 28
            }}>
              ✦ Kandy&apos;s Finest Restaurant
            </div>
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(52px, 7vw, 90px)',
              fontWeight: 900, lineHeight: 1.05,
              color: '#fff', marginBottom: 24
            }}>
              Every Meal is<br />
              <em style={{ color: '#C9A84C' }}>A Masterpiece</em>
            </h1>
            <p style={{
              fontSize: 18, color: '#9A9080',
              lineHeight: 1.7, marginBottom: 44, maxWidth: 480
            }}>
              Welcome to Dinu&apos;s Tasty — where authentic flavors meet warm hospitality.
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
                  background: '#252525',
                  border: '1px solid rgba(201,168,76,0.15)',
                  borderRadius: 12, padding: 28, textAlign: 'center'
                }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div>
                  <div style={{ color: '#C9A84C', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
                    {item.title}
                  </div>
                  <div style={{ color: '#E8E0D0', fontSize: 16, fontWeight: 600 }}>{item.desc}</div>
                </div>
            ))}
          </div>
        </section>

        {/* MENU PREVIEW */}
        <section style={{
          padding: '80px 60px',
          background: '#0D0D0D',
          position: 'relative'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ color: '#C9A84C', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>
              ── Our Menu ──
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 48, fontWeight: 900, color: '#fff' }}>
              Crafted With <em style={{ color: '#C9A84C' }}>Passion</em>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
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
                      fontSize: 28, background: 'rgba(0,0,0,0.6)',
                      borderRadius: '50%', width: 44, height: 44,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {item.emoji || '🍛'}
                    </div>
                  </div>
                  <div style={{ padding: 20 }}>
                    <div style={{ color: '#C9A84C', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
                      {item.category}
                    </div>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                      {item.name}
                    </div>
                    <div style={{ color: '#9A9080', fontSize: 13, marginBottom: 16 }}>
                      {item.description}
                    </div>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: '#C9A84C' }}>
                      Rs. {item.price}
                    </div>
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

        {/* ABOUT SECTION */}
        <section style={{
          padding: '80px 60px',
          background: '#1A1A1A',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 60, alignItems: 'center'
        }}>
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', height: 500 }}>
            <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
                alt="Our restaurant"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(13,13,13,0.6), transparent)'
            }} />
          </div>
          <div>
            <div style={{ color: '#C9A84C', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>
              ── About Us ──
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 44, fontWeight: 900, color: '#fff', marginBottom: 20 }}>
              Taste the <em style={{ color: '#C9A84C' }}>Difference</em>
            </h2>
            <p style={{ color: '#9A9080', fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
              Dinu&apos;s Tasty has been serving the people of Kandy with exceptional food
              and warm hospitality every day from 8am to 10pm. Our chefs craft each dish
              with the finest ingredients and traditional recipes.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {[
                { icon: '🌿', title: 'Fresh Ingredients', desc: 'Locally sourced, fresh every day' },
                { icon: '👨‍🍳', title: 'Expert Chefs', desc: 'Skilled in authentic recipes' },
                { icon: '⏰', title: 'Open Every Day', desc: '8am – 10pm, 365 days' },
                { icon: '🚗', title: 'Fast Delivery', desc: 'Via PickMe & Uber Eats' },
              ].map(f => (
                  <div key={f.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 44, height: 44, flexShrink: 0,
                      background: 'rgba(201,168,76,0.1)',
                      border: '1px solid rgba(201,168,76,0.2)',
                      borderRadius: 8,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20
                    }}>
                      {f.icon}
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{f.title}</div>
                      <div style={{ color: '#9A9080', fontSize: 13 }}>{f.desc}</div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section style={{ padding: '80px 60px', background: '#0D0D0D' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ color: '#C9A84C', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>── Gallery ──</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 44, fontWeight: 900, color: '#fff' }}>
              Food That <em style={{ color: '#C9A84C' }}>Speaks</em>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(2, 200px)', gap: 16 }}>
            {[
              { src: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80', span: '1 / 3', rowSpan: '1 / 3' },
              { src: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80', span: '3 / 4', rowSpan: '1 / 2' },
              { src: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80', span: '4 / 5', rowSpan: '1 / 2' },
              { src: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80', span: '3 / 5', rowSpan: '2 / 3' },
            ].map((img, i) => (
                <div key={i} style={{
                  gridColumn: img.span,
                  gridRow: img.rowSpan,
                  borderRadius: 12, overflow: 'hidden',
                  position: 'relative'
                }}>
                  <img src={img.src} alt="Food" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />
                </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{
          background: '#080808',
          borderTop: '1px solid rgba(201,168,76,0.15)',
          padding: '60px 60px 36px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 900, color: '#C9A84C', marginBottom: 16 }}>
                Dinu&apos;s <span style={{ color: '#fff', fontStyle: 'italic', fontWeight: 400 }}>Tasty</span>
              </div>
              <p style={{ color: '#9A9080', fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
                Kandy&apos;s finest restaurant serving authentic Sri Lankan cuisine. Open every day for your dining pleasure.
              </p>
            </div>
            <div>
              <div style={{ color: '#C9A84C', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>Quick Links</div>
              {[['Home', '/'], ['Menu', '/menu'], ['Order', '/order'], ['Track Order', '/track']].map(([label, href]) => (
                  <div key={label} style={{ marginBottom: 12 }}>
                    <Link href={href} style={{ color: '#9A9080', textDecoration: 'none', fontSize: 14 }}>{label}</Link>
                  </div>
              ))}
            </div>
            <div>
              <div style={{ color: '#C9A84C', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>Contact</div>
              {[
                '📞 0771 234 567',
                '📍 Kandy, Sri Lanka',
                '⏰ 8am – 10pm Daily',
              ].map(item => (
                  <div key={item} style={{ color: '#9A9080', fontSize: 14, marginBottom: 12 }}>{item}</div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, textAlign: 'center' }}>
            <p style={{ color: '#9A9080', fontSize: 13 }}>
              © 2026 Dinu&apos;s Tasty. Developed by Paramith Kavisha
            </p>
          </div>
        </footer>

      </main>
  );
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