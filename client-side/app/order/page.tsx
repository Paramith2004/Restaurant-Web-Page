'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

interface MenuItem {
    id: number;
    name: string;
    price: number;
    category: string;
    emoji: string;
    description: string;
}

interface CartItem extends MenuItem {
    quantity: number;
}

function getCategoryImage(category: string): string {
    const images: Record<string, string> = {
        rice: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80',
        noodles: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80',
        short: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80',
        drinks: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80',
        desserts: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80',
    };
    return images[category] || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80';
}

export default function OrderPage() {
    const [tab, setTab] = useState<'order' | 'reservation'>('order');
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [orderForm, setOrderForm] = useState({
        customerName: '', phone: '',
        orderType: 'Delivery', address: '', notes: ''
    });
    const [resForm, setResForm] = useState({
        name: '', phone: '', date: '',
        time: '', guests: '2', notes: ''
    });
    const [success, setSuccess] = useState('');
    const [orderId, setOrderId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const categories = [
        { key: 'all', label: 'All', emoji: '🍽️' },
        { key: 'rice', label: 'Rice', emoji: '🍛' },
        { key: 'noodles', label: 'Noodles', emoji: '🍜' },
        { key: 'short', label: 'Snacks', emoji: '🥪' },
        { key: 'drinks', label: 'Drinks', emoji: '🥤' },
        { key: 'desserts', label: 'Desserts', emoji: '🍮' },
    ];

    useEffect(() => {
        fetch('http://localhost:8081/api/menu')
            .then(res => res.json())
            .then(data => setMenuItems(data))
            .catch(() => console.error('Failed to load menu'));
    }, []);

    const filteredItems = activeCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === activeCategory);

    const addToCart = (item: MenuItem) => {
        setCart(prev => {
            const existing = prev.find(c => c.id === item.id);
            if (existing) return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id: number) => {
        setCart(prev => {
            const existing = prev.find(c => c.id === id);
            if (existing && existing.quantity > 1) return prev.map(c => c.id === id ? { ...c, quantity: c.quantity - 1 } : c);
            return prev.filter(c => c.id !== id);
        });
    };

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartSummary = cart.map(c => `${c.quantity}x ${c.name} (Rs.${c.price})`).join(', ');

    const handleOrder = async () => {
        if (!orderForm.customerName || !orderForm.phone || cart.length === 0) {
            alert('Please fill name, phone and select at least one item!'); return;
        }
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8081/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...orderForm, items: cartSummary })
            });
            const data = await res.json();
            const newOrderId = data.id;
            const msg = `🍽️ *New Order - Dinu's Tasty*\n\n🔢 Order ID: #${newOrderId}\n👤 Name: ${orderForm.customerName}\n📞 Phone: ${orderForm.phone}\n🛵 Type: ${orderForm.orderType}\n📍 Address: ${orderForm.address}\n\n🍛 Order:\n${cartSummary}\n\n💰 Total: Rs. ${totalPrice}\n\n📝 Notes: ${orderForm.notes || 'None'}`;
            window.open(`https://wa.me/94771234567?text=${encodeURIComponent(msg)}`, '_blank');
            setOrderId(newOrderId);
            setSuccess('order');
            setCart([]);
            setOrderForm({ customerName: '', phone: '', orderType: 'Delivery', address: '', notes: '' });
        } catch {
            alert('Something went wrong!');
        }
        setLoading(false);
    };

    const handleReservation = async () => {
        if (!resForm.name || !resForm.phone || !resForm.date || !resForm.time) {
            alert('Please fill all required fields!'); return;
        }
        setLoading(true);
        try {
            await fetch('http://localhost:8081/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(resForm)
            });
            const msg = `🗓️ *Table Reservation - Dinu's Tasty*\n\n👤 Name: ${resForm.name}\n📞 Phone: ${resForm.phone}\n📅 Date: ${resForm.date}\n⏰ Time: ${resForm.time}\n👥 Guests: ${resForm.guests}\n📝 Notes: ${resForm.notes || 'None'}`;
            window.open(`https://wa.me/94771234567?text=${encodeURIComponent(msg)}`, '_blank');
            setSuccess('reservation');
            setResForm({ name: '', phone: '', date: '', time: '', guests: '2', notes: '' });
        } catch {
            alert('Something went wrong!');
        }
        setLoading(false);
    };

    const inputStyle = {
        width: '100%', background: '#252525',
        border: '1px solid rgba(255,255,255,0.08)',
        color: '#E8E0D0', padding: '14px 16px',
        borderRadius: 8, fontSize: 15,
        fontFamily: 'DM Sans, sans-serif', outline: 'none'
    };

    const labelStyle = {
        display: 'block', fontSize: 12,
        letterSpacing: 1.5, textTransform: 'uppercase' as const,
        color: '#9A9080', marginBottom: 8
    };

    return (
        <main style={{ background: '#0D0D0D', minHeight: '100vh', paddingTop: 65 }}>

            <Navbar />

            {/* HERO BANNER */}
            <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                <img
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80"
                    alt="Order"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(13,13,13,0.75)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    textAlign: 'center', padding: '0 24px'
                }}>
                    <div style={{ color: '#C9A84C', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>── Order Online ──</div>
                    <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#fff' }}>
                        Order or <em style={{ color: '#C9A84C' }}>Reserve</em>
                    </h1>
                </div>
            </div>

            <section style={{ padding: '32px 20px 80px' }}>

                {/* TABS */}
                <div style={{ display: 'flex', background: '#1A1A1A', borderRadius: 10, padding: 4, maxWidth: 500, margin: '0 auto 32px' }}>
                    {(['order', 'reservation'] as const).map(t => (
                        <button key={t} onClick={() => { setTab(t); setSuccess(''); setOrderId(null); }} style={{
                            flex: 1, padding: '12px', borderRadius: 8,
                            border: 'none', cursor: 'pointer',
                            background: tab === t ? '#C9A84C' : 'transparent',
                            color: tab === t ? '#0D0D0D' : '#9A9080',
                            fontWeight: tab === t ? 700 : 500,
                            fontSize: 14, fontFamily: 'DM Sans, sans-serif'
                        }}>
                            {t === 'order' ? '📦 Place Order' : '🗓️ Reserve Table'}
                        </button>
                    ))}
                </div>

                {/* ORDER SUCCESS */}
                {success === 'order' && orderId && (
                    <div style={{
                        background: '#1A1A1A', border: '2px solid #C9A84C',
                        borderRadius: 16, padding: '36px 24px', textAlign: 'center',
                        maxWidth: 560, margin: '0 auto 32px'
                    }}>
                        <div style={{ fontSize: 60, marginBottom: 12 }}>🎉</div>
                        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 900, color: '#C9A84C', marginBottom: 8 }}>
                            Order Placed!
                        </h2>
                        <div style={{ background: '#252525', borderRadius: 12, padding: '16px 24px', margin: '20px auto', display: 'inline-block' }}>
                            <div style={{ color: '#9A9080', fontSize: 12, marginBottom: 4 }}>ORDER NUMBER</div>
                            <div style={{ color: '#C9A84C', fontSize: 44, fontWeight: 900, fontFamily: 'Playfair Display, serif' }}>#{orderId}</div>
                        </div>
                        <p style={{ color: '#9A9080', fontSize: 14, lineHeight: 1.8, marginBottom: 24 }}>
                            WhatsApp message sent to restaurant! 📱<br />We will confirm shortly.
                        </p>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
                            <div style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, padding: '10px 16px', color: '#C9A84C', fontSize: 13 }}>
                                📞 0771 234 567
                            </div>
                            <div style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, padding: '10px 16px', color: '#C9A84C', fontSize: 13 }}>
                                ⏰ Ready in 30-45 mins
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/track" style={{
                                background: '#C9A84C', color: '#0D0D0D',
                                padding: '12px 24px', borderRadius: 8,
                                fontSize: 14, fontWeight: 700, textDecoration: 'none'
                            }}>
                                🔍 Track Order
                            </Link>
                            <button onClick={() => { setSuccess(''); setOrderId(null); }} style={{
                                background: 'transparent', border: '1px solid rgba(201,168,76,0.4)',
                                color: '#C9A84C', padding: '12px 24px', borderRadius: 8,
                                fontSize: 14, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                            }}>
                                ← Order More
                            </button>
                        </div>
                    </div>
                )}

                {/* RESERVATION SUCCESS */}
                {success === 'reservation' && (
                    <div style={{
                        background: '#1A1A1A', border: '2px solid #3B82F6',
                        borderRadius: 16, padding: '36px 24px', textAlign: 'center',
                        maxWidth: 560, margin: '0 auto 32px'
                    }}>
                        <div style={{ fontSize: 60, marginBottom: 12 }}>🗓️</div>
                        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 900, color: '#3B82F6', marginBottom: 12 }}>
                            Table Reserved!
                        </h2>
                        <p style={{ color: '#9A9080', fontSize: 14, lineHeight: 1.8, marginBottom: 20 }}>
                            WhatsApp sent! We will confirm shortly. 📱
                        </p>
                        <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, padding: '12px 20px', color: '#3B82F6', fontSize: 14, display: 'inline-block', marginBottom: 20 }}>
                            📞 0771 234 567
                        </div>
                        <br />
                        <button onClick={() => setSuccess('')} style={{
                            background: 'transparent', border: '1px solid rgba(59,130,246,0.4)',
                            color: '#3B82F6', padding: '12px 24px', borderRadius: 8,
                            fontSize: 14, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                        }}>
                            ← Another Reservation
                        </button>
                    </div>
                )}

                {/* ORDER FORM */}
                {tab === 'order' && !success && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, maxWidth: 1100, margin: '0 auto' }}>

                        {/* LEFT - Menu */}
                        <div>
                            <h3 style={{ color: '#fff', fontFamily: 'Playfair Display, serif', fontSize: 22, marginBottom: 16 }}>
                                Select Items
                            </h3>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                                {categories.map(cat => (
                                    <button key={cat.key} onClick={() => setActiveCategory(cat.key)} style={{
                                        padding: '7px 14px', borderRadius: 100,
                                        border: '1px solid rgba(201,168,76,0.2)',
                                        background: activeCategory === cat.key ? '#C9A84C' : 'transparent',
                                        color: activeCategory === cat.key ? '#0D0D0D' : '#9A9080',
                                        fontWeight: activeCategory === cat.key ? 700 : 500,
                                        fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                                    }}>
                                        {cat.emoji} {cat.label}
                                    </button>
                                ))}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
                                {filteredItems.map(item => {
                                    const cartItem = cart.find(c => c.id === item.id);
                                    return (
                                        <div key={item.id} style={{
                                            background: '#1A1A1A',
                                            border: `1px solid ${cartItem ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.06)'}`,
                                            borderRadius: 10, overflow: 'hidden'
                                        }}>
                                            <div style={{ height: 100, position: 'relative', overflow: 'hidden' }}>
                                                <img
                                                    src={getCategoryImage(item.category)}
                                                    alt={item.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,13,13,0.8), transparent)' }} />
                                                <div style={{ position: 'absolute', bottom: 6, left: 8, color: '#fff', fontWeight: 700, fontSize: 12 }}>
                                                    {item.emoji}
                                                </div>
                                            </div>
                                            <div style={{ padding: 10 }}>
                                                <div style={{ color: '#fff', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{item.name}</div>
                                                <div style={{ color: '#C9A84C', fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Rs. {item.price}</div>
                                                {cartItem ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                                                        <button onClick={() => removeFromCart(item.id)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.4)', background: 'transparent', color: '#C9A84C', fontSize: 16, cursor: 'pointer', fontWeight: 700 }}>−</button>
                                                        <span style={{ color: '#fff', fontWeight: 700 }}>{cartItem.quantity}</span>
                                                        <button onClick={() => addToCart(item)} style={{ width: 28, height: 28, borderRadius: '50%', background: '#C9A84C', border: 'none', color: '#0D0D0D', fontSize: 16, cursor: 'pointer', fontWeight: 700 }}>+</button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => addToCart(item)} style={{ width: '100%', background: '#C9A84C', color: '#0D0D0D', border: 'none', padding: '7px', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                                                        + Add
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* RIGHT - Cart + Form */}
                        <div>
                            {/* CART */}
                            <div style={{ background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 14, padding: 20, marginBottom: 20 }}>
                                <h3 style={{ color: '#fff', fontFamily: 'Playfair Display, serif', fontSize: 18, marginBottom: 14 }}>🛒 Your Order</h3>
                                {cart.length === 0 ? (
                                    <p style={{ color: '#9A9080', fontSize: 14, textAlign: 'center', padding: '16px 0' }}>No items selected!</p>
                                ) : (
                                    <>
                                        {cart.map(item => (
                                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                                <span style={{ color: '#fff', fontSize: 14 }}>{item.emoji} {item.name} <span style={{ color: '#9A9080' }}>x{item.quantity}</span></span>
                                                <span style={{ color: '#C9A84C', fontWeight: 700 }}>Rs. {item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10, marginTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: '#fff', fontWeight: 700 }}>Total</span>
                                            <span style={{ color: '#C9A84C', fontWeight: 900, fontSize: 18 }}>Rs. {totalPrice}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* FORM */}
                            <div style={{ background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 14, padding: 20 }}>
                                <h3 style={{ color: '#fff', fontFamily: 'Playfair Display, serif', fontSize: 18, marginBottom: 16 }}>Your Details</h3>
                                <div style={{ marginBottom: 14 }}>
                                    <label style={labelStyle}>Name *</label>
                                    <input style={inputStyle} placeholder="Your name" value={orderForm.customerName} onChange={e => setOrderForm({ ...orderForm, customerName: e.target.value })} />
                                </div>
                                <div style={{ marginBottom: 14 }}>
                                    <label style={labelStyle}>Phone *</label>
                                    <input style={inputStyle} placeholder="077 123 4567" value={orderForm.phone} onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })} />
                                </div>
                                <div style={{ marginBottom: 14 }}>
                                    <label style={labelStyle}>Order Type</label>
                                    <select style={inputStyle} value={orderForm.orderType} onChange={e => setOrderForm({ ...orderForm, orderType: e.target.value })}>
                                        <option>Delivery</option>
                                        <option>Dine In</option>
                                        <option>Takeaway</option>
                                    </select>
                                </div>
                                <div style={{ marginBottom: 14 }}>
                                    <label style={labelStyle}>Address</label>
                                    <input style={inputStyle} placeholder="Your address" value={orderForm.address} onChange={e => setOrderForm({ ...orderForm, address: e.target.value })} />
                                </div>
                                <div style={{ marginBottom: 18 }}>
                                    <label style={labelStyle}>Notes</label>
                                    <input style={inputStyle} placeholder="Less spicy..." value={orderForm.notes} onChange={e => setOrderForm({ ...orderForm, notes: e.target.value })} />
                                </div>
                                <button onClick={handleOrder} disabled={loading} style={{ width: '100%', background: '#C9A84C', color: '#0D0D0D', border: 'none', padding: 16, borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                                    {loading ? 'Placing...' : '📦 Place Order via WhatsApp'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* RESERVATION FORM */}
                {tab === 'reservation' && !success && (
                    <div style={{ maxWidth: 560, margin: '0 auto' }}>
                        <div style={{ background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 14, padding: 28 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                                <div>
                                    <label style={labelStyle}>Full Name *</label>
                                    <input style={inputStyle} placeholder="Your name" value={resForm.name} onChange={e => setResForm({ ...resForm, name: e.target.value })} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Phone *</label>
                                    <input style={inputStyle} placeholder="077 XXX XXXX" value={resForm.phone} onChange={e => setResForm({ ...resForm, phone: e.target.value })} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                                <div>
                                    <label style={labelStyle}>Date *</label>
                                    <input type="date" style={inputStyle} value={resForm.date} onChange={e => setResForm({ ...resForm, date: e.target.value })} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Time *</label>
                                    <input type="time" style={inputStyle} value={resForm.time} onChange={e => setResForm({ ...resForm, time: e.target.value })} />
                                </div>
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>Guests</label>
                                <select style={inputStyle} value={resForm.guests} onChange={e => setResForm({ ...resForm, guests: e.target.value })}>
                                    {['1', '2', '3', '4', '5', '6+'].map(g => <option key={g}>{g}</option>)}
                                </select>
                            </div>
                            <div style={{ marginBottom: 24 }}>
                                <label style={labelStyle}>Special Requests</label>
                                <input style={inputStyle} placeholder="Birthday, anniversary..." value={resForm.notes} onChange={e => setResForm({ ...resForm, notes: e.target.value })} />
                            </div>
                            <button onClick={handleReservation} disabled={loading} style={{ width: '100%', background: '#C9A84C', color: '#0D0D0D', border: 'none', padding: 16, borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                                {loading ? 'Reserving...' : '🗓️ Reserve via WhatsApp'}
                            </button>
                        </div>
                    </div>
                )}
            </section>

            <footer style={{ background: '#080808', borderTop: '1px solid rgba(201,168,76,0.15)', padding: '32px 24px', textAlign: 'center' }}>
                <p style={{ color: '#9A9080', fontSize: 14 }}>© 2026 Dinu&apos;s Tasty | Kandy, Sri Lanka 🇱🇰</p>
            </footer>

        </main>
    );
}