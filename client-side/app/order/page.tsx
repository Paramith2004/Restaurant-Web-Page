'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

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
        { key: 'rice', label: 'Rice & Curry', emoji: '🍛' },
        { key: 'noodles', label: 'Noodles', emoji: '🍜' },
        { key: 'short', label: 'Short Eats', emoji: '🥪' },
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
            if (existing) {
                return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id: number) => {
        setCart(prev => {
            const existing = prev.find(c => c.id === id);
            if (existing && existing.quantity > 1) {
                return prev.map(c => c.id === id ? { ...c, quantity: c.quantity - 1 } : c);
            }
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
                            color: href === '/order' ? '#C9A84C' : '#9A9080',
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
                }}>Order Now</Link>
            </nav>

            <section style={{ padding: '60px 60px 80px' }}>

                {/* HEADER */}
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <div style={{ color: '#C9A84C', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>── Order Online ──</div>
                    <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 48, fontWeight: 900, color: '#fff' }}>
                        Order or <em style={{ color: '#C9A84C' }}>Reserve</em>
                    </h1>
                </div>

                {/* TABS */}
                <div style={{ display: 'flex', gap: 0, background: '#1A1A1A', borderRadius: 10, padding: 4, maxWidth: 500, margin: '0 auto 40px' }}>
                    {(['order', 'reservation'] as const).map(t => (
                        <button key={t} onClick={() => { setTab(t); setSuccess(''); setOrderId(null); }} style={{
                            flex: 1, padding: '14px', borderRadius: 8,
                            border: 'none', cursor: 'pointer',
                            background: tab === t ? '#C9A84C' : 'transparent',
                            color: tab === t ? '#0D0D0D' : '#9A9080',
                            fontWeight: tab === t ? 700 : 500,
                            fontSize: 15, fontFamily: 'DM Sans, sans-serif'
                        }}>
                            {t === 'order' ? '📦 Place Order' : '🗓️ Reserve Table'}
                        </button>
                    ))}
                </div>

                {/* ORDER SUCCESS */}
                {success === 'order' && orderId && (
                    <div style={{
                        background: '#1A1A1A', border: '2px solid #C9A84C',
                        borderRadius: 16, padding: 48, textAlign: 'center',
                        maxWidth: 600, margin: '0 auto 40px'
                    }}>
                        <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
                        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 900, color: '#C9A84C', marginBottom: 8 }}>
                            Order Placed!
                        </h2>
                        <p style={{ color: '#9A9080', fontSize: 15, marginBottom: 24 }}>
                            Your order has been received successfully!
                        </p>
                        <div style={{ background: '#252525', borderRadius: 12, padding: '20px 32px', marginBottom: 24, display: 'inline-block' }}>
                            <div style={{ color: '#9A9080', fontSize: 13, marginBottom: 4, letterSpacing: 1 }}>ORDER NUMBER</div>
                            <div style={{ color: '#C9A84C', fontSize: 48, fontWeight: 900, fontFamily: 'Playfair Display, serif' }}>
                                #{orderId}
                            </div>
                        </div>
                        <p style={{ color: '#9A9080', fontSize: 14, lineHeight: 1.8, marginBottom: 28 }}>
                            A WhatsApp message has been sent to the restaurant. 📱<br />
                            We will confirm your order shortly!
                        </p>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
                            <div style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, padding: '12px 20px', color: '#C9A84C', fontSize: 14 }}>
                                📞 0771 234 567
                            </div>
                            <div style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, padding: '12px 20px', color: '#C9A84C', fontSize: 14 }}>
                                ⏰ Ready in 30-45 mins
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/track" style={{
                                background: '#C9A84C', color: '#0D0D0D',
                                padding: '12px 28px', borderRadius: 8,
                                fontSize: 14, fontWeight: 700, textDecoration: 'none'
                            }}>
                                🔍 Track My Order
                            </Link>
                            <button onClick={() => { setSuccess(''); setOrderId(null); }} style={{
                                background: 'transparent', border: '1px solid rgba(201,168,76,0.4)',
                                color: '#C9A84C', padding: '12px 28px', borderRadius: 8,
                                fontSize: 14, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                            }}>
                                ← Place Another Order
                            </button>
                        </div>
                    </div>
                )}

                {/* RESERVATION SUCCESS */}
                {success === 'reservation' && (
                    <div style={{
                        background: '#1A1A1A', border: '2px solid #3B82F6',
                        borderRadius: 16, padding: 48, textAlign: 'center',
                        maxWidth: 600, margin: '0 auto 40px'
                    }}>
                        <div style={{ fontSize: 72, marginBottom: 16 }}>🗓️</div>
                        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 900, color: '#3B82F6', marginBottom: 8 }}>
                            Table Reserved!
                        </h2>
                        <p style={{ color: '#9A9080', fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                            Your reservation has been received! A WhatsApp message has been sent to the restaurant. 📱<br />
                            We will confirm your booking shortly!
                        </p>
                        <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, padding: '12px 20px', color: '#3B82F6', fontSize: 14, display: 'inline-block', marginBottom: 28 }}>
                            📞 For queries: 0771 234 567
                        </div>
                        <br />
                        <button onClick={() => setSuccess('')} style={{
                            background: 'transparent', border: '1px solid rgba(59,130,246,0.4)',
                            color: '#3B82F6', padding: '12px 28px', borderRadius: 8,
                            fontSize: 14, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                        }}>
                            ← Make Another Reservation
                        </button>
                    </div>
                )}

                {/* ORDER FORM */}
                {tab === 'order' && !success && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, maxWidth: 1100, margin: '0 auto' }}>

                        {/* LEFT - Menu Selection */}
                        <div>
                            <h3 style={{ color: '#fff', fontFamily: 'Playfair Display, serif', fontSize: 24, marginBottom: 20 }}>
                                Select Your Items
                            </h3>
                            <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                                {categories.map(cat => (
                                    <button key={cat.key} onClick={() => setActiveCategory(cat.key)} style={{
                                        padding: '8px 18px', borderRadius: 100,
                                        border: '1px solid rgba(201,168,76,0.2)',
                                        background: activeCategory === cat.key ? '#C9A84C' : 'transparent',
                                        color: activeCategory === cat.key ? '#0D0D0D' : '#9A9080',
                                        fontWeight: activeCategory === cat.key ? 700 : 500,
                                        fontSize: 13, cursor: 'pointer',
                                        fontFamily: 'DM Sans, sans-serif'
                                    }}>
                                        {cat.emoji} {cat.label}
                                    </button>
                                ))}
                            </div>
                            {filteredItems.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#9A9080', padding: 40 }}>
                                    No items yet — check back soon!
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    {filteredItems.map(item => {
                                        const cartItem = cart.find(c => c.id === item.id);
                                        return (
                                            <div key={item.id} style={{
                                                background: '#1A1A1A',
                                                border: `1px solid ${cartItem ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.06)'}`,
                                                borderRadius: 12, overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    height: 120, background: 'linear-gradient(135deg,#1a1200,#2a1e00)',
                                                    display: 'flex', alignItems: 'center',
                                                    justifyContent: 'center', fontSize: 52
                                                }}>
                                                    {item.emoji || '🍛'}
                                                </div>
                                                <div style={{ padding: 14 }}>
                                                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{item.name}</div>
                                                    <div style={{ color: '#C9A84C', fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Rs. {item.price}</div>
                                                    {cartItem ? (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                            <button onClick={() => removeFromCart(item.id)} style={{
                                                                width: 32, height: 32, borderRadius: '50%',
                                                                border: '1px solid rgba(201,168,76,0.4)',
                                                                background: 'transparent', color: '#C9A84C',
                                                                fontSize: 18, cursor: 'pointer', fontWeight: 700
                                                            }}>−</button>
                                                            <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{cartItem.quantity}</span>
                                                            <button onClick={() => addToCart(item)} style={{
                                                                width: 32, height: 32, borderRadius: '50%',
                                                                background: '#C9A84C', border: 'none',
                                                                color: '#0D0D0D', fontSize: 18,
                                                                cursor: 'pointer', fontWeight: 700
                                                            }}>+</button>
                                                        </div>
                                                    ) : (
                                                        <button onClick={() => addToCart(item)} style={{
                                                            width: '100%', background: '#C9A84C',
                                                            color: '#0D0D0D', border: 'none',
                                                            padding: '8px', borderRadius: 6,
                                                            fontWeight: 700, fontSize: 13,
                                                            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                                                        }}>
                                                            + Add
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* RIGHT - Cart & Form */}
                        <div>
                            <div style={{ background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
                                <h3 style={{ color: '#fff', fontFamily: 'Playfair Display, serif', fontSize: 20, marginBottom: 16 }}>
                                    🛒 Your Order
                                </h3>
                                {cart.length === 0 ? (
                                    <p style={{ color: '#9A9080', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>
                                        No items selected yet!
                                    </p>
                                ) : (
                                    <>
                                        {cart.map(item => (
                                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                                <div>
                                                    <span style={{ color: '#fff', fontSize: 14 }}>{item.emoji} {item.name}</span>
                                                    <span style={{ color: '#9A9080', fontSize: 12 }}> x{item.quantity}</span>
                                                </div>
                                                <span style={{ color: '#C9A84C', fontWeight: 700 }}>Rs. {item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12, marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: '#fff', fontWeight: 700 }}>Total</span>
                                            <span style={{ color: '#C9A84C', fontWeight: 900, fontSize: 18 }}>Rs. {totalPrice}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div style={{ background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 16, padding: 24 }}>
                                <h3 style={{ color: '#fff', fontFamily: 'Playfair Display, serif', fontSize: 20, marginBottom: 20 }}>
                                    Your Details
                                </h3>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={labelStyle}>Name *</label>
                                    <input style={inputStyle} placeholder="Your name"
                                           value={orderForm.customerName}
                                           onChange={e => setOrderForm({ ...orderForm, customerName: e.target.value })} />
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={labelStyle}>Phone *</label>
                                    <input style={inputStyle} placeholder="077 123 4567"
                                           value={orderForm.phone}
                                           onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })} />
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={labelStyle}>Order Type</label>
                                    <select style={inputStyle}
                                            value={orderForm.orderType}
                                            onChange={e => setOrderForm({ ...orderForm, orderType: e.target.value })}>
                                        <option>Delivery</option>
                                        <option>Dine In</option>
                                        <option>Takeaway</option>
                                    </select>
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={labelStyle}>Address</label>
                                    <input style={inputStyle} placeholder="Your address in Kandy"
                                           value={orderForm.address}
                                           onChange={e => setOrderForm({ ...orderForm, address: e.target.value })} />
                                </div>
                                <div style={{ marginBottom: 20 }}>
                                    <label style={labelStyle}>Notes</label>
                                    <input style={inputStyle} placeholder="Less spicy, extra rice..."
                                           value={orderForm.notes}
                                           onChange={e => setOrderForm({ ...orderForm, notes: e.target.value })} />
                                </div>
                                <button onClick={handleOrder} disabled={loading} style={{
                                    width: '100%', background: '#C9A84C', color: '#0D0D0D',
                                    border: 'none', padding: 18, borderRadius: 8,
                                    fontSize: 16, fontWeight: 700, cursor: 'pointer',
                                    fontFamily: 'DM Sans, sans-serif'
                                }}>
                                    {loading ? 'Placing...' : '📦 Place Order via WhatsApp'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* RESERVATION FORM */}
                {tab === 'reservation' && !success && (
                    <div style={{ maxWidth: 600, margin: '0 auto' }}>
                        <div style={{ background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 16, padding: 40 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                                <div>
                                    <label style={labelStyle}>Full Name *</label>
                                    <input style={inputStyle} placeholder="Your name"
                                           value={resForm.name}
                                           onChange={e => setResForm({ ...resForm, name: e.target.value })} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Phone *</label>
                                    <input style={inputStyle} placeholder="077 XXX XXXX"
                                           value={resForm.phone}
                                           onChange={e => setResForm({ ...resForm, phone: e.target.value })} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                                <div>
                                    <label style={labelStyle}>Date *</label>
                                    <input type="date" style={inputStyle}
                                           value={resForm.date}
                                           onChange={e => setResForm({ ...resForm, date: e.target.value })} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Time *</label>
                                    <input type="time" style={inputStyle}
                                           value={resForm.time}
                                           onChange={e => setResForm({ ...resForm, time: e.target.value })} />
                                </div>
                            </div>
                            <div style={{ marginBottom: 20 }}>
                                <label style={labelStyle}>Guests</label>
                                <select style={inputStyle}
                                        value={resForm.guests}
                                        onChange={e => setResForm({ ...resForm, guests: e.target.value })}>
                                    {['1', '2', '3', '4', '5', '6+'].map(g => <option key={g}>{g}</option>)}
                                </select>
                            </div>
                            <div style={{ marginBottom: 28 }}>
                                <label style={labelStyle}>Special Requests</label>
                                <input style={inputStyle} placeholder="Birthday, anniversary..."
                                       value={resForm.notes}
                                       onChange={e => setResForm({ ...resForm, notes: e.target.value })} />
                            </div>
                            <button onClick={handleReservation} disabled={loading} style={{
                                width: '100%', background: '#C9A84C', color: '#0D0D0D',
                                border: 'none', padding: 18, borderRadius: 8,
                                fontSize: 16, fontWeight: 700, cursor: 'pointer',
                                fontFamily: 'DM Sans, sans-serif'
                            }}>
                                {loading ? 'Reserving...' : '🗓️ Reserve via WhatsApp'}
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* FOOTER */}
            <footer style={{ background: '#080808', borderTop: '1px solid rgba(201,168,76,0.15)', padding: '40px 60px', textAlign: 'center' }}>
                <p style={{ color: '#9A9080', fontSize: 14 }}>© 2026 Dinu&apos;s Tasty | Kandy, Sri Lanka 🇱🇰</p>
            </footer>

        </main>
    );
}