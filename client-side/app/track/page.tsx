'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

interface Order {
    id: number;
    customerName: string;
    phone: string;
    orderType: string;
    address: string;
    items: string;
    notes: string;
    status: string;
}

export default function TrackPage() {
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState<'id' | 'phone'>('id');
    const [order, setOrder] = useState<Order | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const statusSteps = ['pending', 'confirmed', 'completed'];

    const statusInfo = (status: string) => {
        if (status === 'pending') return { color: '#F59E0B', icon: '⏳', label: 'Pending', desc: 'Order received — waiting to be confirmed.' };
        if (status === 'confirmed') return { color: '#3B82F6', icon: '👨‍🍳', label: 'Confirmed', desc: 'Order confirmed and being prepared!' };
        if (status === 'completed') return { color: '#10B981', icon: '✅', label: 'Completed', desc: 'Order ready / delivered. Enjoy your meal!' };
        if (status === 'cancelled') return { color: '#EF4444', icon: '❌', label: 'Cancelled', desc: 'Order cancelled. Please call us for help.' };
        return { color: '#9A9080', icon: '❓', label: status, desc: '' };
    };

    const handleSearch = async () => {
        if (!search) { setError('Please enter order number or phone!'); return; }
        setLoading(true);
        setError('');
        setOrder(null);
        setOrders([]);
        try {
            const res = await fetch('http://localhost:8081/api/orders');
            const data: Order[] = await res.json();
            if (searchType === 'id') {
                const found = data.find(o => o.id === parseInt(search));
                found ? setOrder(found) : setError('Order not found!');
            } else {
                const found = data.filter(o => o.phone === search);
                found.length > 0 ? setOrders(found) : setError('No orders found for this phone.');
            }
        } catch {
            setError('Cannot connect to server!');
        }
        setLoading(false);
    };

    const OrderCard = ({ o }: { o: Order }) => {
        const info = statusInfo(o.status);
        const stepIndex = statusSteps.indexOf(o.status);
        return (
            <div style={{ background: '#1A1A1A', border: `2px solid ${info.color}44`, borderRadius: 14, padding: '24px 20px', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <div style={{ color: '#9A9080', fontSize: 12, marginBottom: 4 }}>Order Number</div>
                        <div style={{ color: '#C9A84C', fontSize: 32, fontWeight: 900, fontFamily: 'Playfair Display, serif' }}>#{o.id}</div>
                    </div>
                    <div style={{ background: `${info.color}22`, border: `1px solid ${info.color}44`, borderRadius: 100, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 16 }}>{info.icon}</span>
                        <span style={{ color: info.color, fontWeight: 700, fontSize: 14 }}>{info.label}</span>
                    </div>
                </div>

                <div style={{ background: `${info.color}11`, border: `1px solid ${info.color}22`, borderRadius: 8, padding: '12px 16px', marginBottom: 20 }}>
                    <p style={{ color: info.color, fontSize: 14, fontWeight: 600 }}>{info.desc}</p>
                </div>

                {o.status !== 'cancelled' && (
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                            {statusSteps.map((step, i) => {
                                const si = statusInfo(step);
                                const isActive = i <= stepIndex;
                                return (
                                    <div key={step} style={{ textAlign: 'center', flex: 1 }}>
                                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: isActive ? si.color : '#252525', border: `2px solid ${isActive ? si.color : '#333'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', fontSize: 16 }}>
                                            {isActive ? si.icon : '○'}
                                        </div>
                                        <div style={{ color: isActive ? si.color : '#9A9080', fontSize: 11, fontWeight: isActive ? 700 : 400, textTransform: 'capitalize' }}>{step}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{ height: 3, background: '#252525', borderRadius: 2 }}>
                            <div style={{ height: '100%', borderRadius: 2, background: info.color, width: stepIndex === 0 ? '0%' : stepIndex === 1 ? '50%' : '100%' }} />
                        </div>
                    </div>
                )}

                <div style={{ background: '#252525', borderRadius: 8, padding: 16 }}>
                    <div style={{ color: '#C9A84C', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Order Details</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                        <div>
                            <div style={{ color: '#9A9080', fontSize: 11, marginBottom: 2 }}>Customer</div>
                            <div style={{ color: '#E8E0D0', fontSize: 14 }}>{o.customerName}</div>
                        </div>
                        <div>
                            <div style={{ color: '#9A9080', fontSize: 11, marginBottom: 2 }}>Type</div>
                            <div style={{ color: '#E8E0D0', fontSize: 14 }}>{o.orderType}</div>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
                        <div style={{ color: '#9A9080', fontSize: 11, marginBottom: 6 }}>Items</div>
                        <div style={{ color: '#E8E0D0', fontSize: 13, lineHeight: 1.6 }}>{o.items}</div>
                    </div>
                </div>

                {o.status === 'cancelled' && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: 14, textAlign: 'center', marginTop: 16 }}>
                        <p style={{ color: '#EF4444', fontSize: 13, marginBottom: 6 }}>Order cancelled. Contact us for help.</p>
                        <a href="tel:0771234567" style={{ color: '#EF4444', fontWeight: 700, textDecoration: 'none' }}>📞 0771 234 567</a>
                    </div>
                )}
            </div>
        );
    };

    return (
        <main style={{ background: '#0D0D0D', minHeight: '100vh', paddingTop: 65 }}>

            <Navbar />

            {/* HERO BANNER */}
            <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                <img
                    src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1600&q=80"
                    alt="Track"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,13,13,0.75)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
                    <div style={{ color: '#C9A84C', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>── Order Tracking ──</div>
                    <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#fff' }}>
                        Track Your <em style={{ color: '#C9A84C' }}>Order</em>
                    </h1>
                </div>
            </div>

            <section style={{ padding: '40px 20px 80px', maxWidth: 680, margin: '0 auto' }}>

                {/* SEARCH BOX */}
                <div style={{ background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 14, padding: '24px 20px', marginBottom: 32 }}>
                    <div style={{ display: 'flex', background: '#252525', borderRadius: 8, padding: 4, marginBottom: 20 }}>
                        {(['id', 'phone'] as const).map(t => (
                            <button key={t} onClick={() => { setSearchType(t); setSearch(''); setError(''); setOrder(null); setOrders([]); }} style={{ flex: 1, padding: '10px', borderRadius: 6, border: 'none', cursor: 'pointer', background: searchType === t ? '#C9A84C' : 'transparent', color: searchType === t ? '#0D0D0D' : '#9A9080', fontWeight: searchType === t ? 700 : 500, fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}>
                                {t === 'id' ? '🔢 Order Number' : '📞 Phone Number'}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                        <input
                            style={{ flex: 1, background: '#252525', border: '1px solid rgba(255,255,255,0.08)', color: '#E8E0D0', padding: '13px 14px', borderRadius: 8, fontSize: 15, fontFamily: 'DM Sans, sans-serif', outline: 'none' }}
                            placeholder={searchType === 'id' ? 'Enter order number e.g. 5' : 'Enter phone e.g. 0771234567'}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        />
                        <button onClick={handleSearch} disabled={loading} style={{ background: '#C9A84C', color: '#0D0D0D', border: 'none', padding: '13px 20px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}>
                            {loading ? '...' : '🔍 Track'}
                        </button>
                    </div>

                    {error && (
                        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', padding: '12px 16px', borderRadius: 8, marginTop: 14, fontSize: 14, textAlign: 'center' }}>
                            ⚠️ {error}
                        </div>
                    )}
                </div>

                {order && <OrderCard o={order} />}

                {orders.length > 0 && (
                    <div>
                        <div style={{ color: '#9A9080', fontSize: 14, marginBottom: 16, textAlign: 'center' }}>
                            Found {orders.length} order{orders.length > 1 ? 's' : ''}
                        </div>
                        {orders.map(o => <OrderCard key={o.id} o={o} />)}
                    </div>
                )}

                {!order && orders.length === 0 && !error && (
                    <div>
                        <div style={{ color: '#9A9080', fontSize: 13, marginBottom: 20, textAlign: 'center' }}>Order Status Guide</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
                            {[
                                { icon: '⏳', label: 'Pending', desc: 'Waiting confirmation', color: '#F59E0B' },
                                { icon: '👨‍🍳', label: 'Confirmed', desc: 'Being prepared', color: '#3B82F6' },
                                { icon: '✅', label: 'Completed', desc: 'Ready or delivered!', color: '#10B981' },
                                { icon: '❌', label: 'Cancelled', desc: 'Order cancelled', color: '#EF4444' },
                            ].map(s => (
                                <div key={s.label} style={{ background: '#1A1A1A', border: `1px solid ${s.color}22`, borderRadius: 10, padding: 16, textAlign: 'center' }}>
                                    <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
                                    <div style={{ color: s.color, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{s.label}</div>
                                    <div style={{ color: '#9A9080', fontSize: 12 }}>{s.desc}</div>
                                </div>
                            ))}
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