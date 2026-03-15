'use client';
import { useState } from 'react';
import Link from 'next/link';

interface Order {
    id: number;
    customerName: string;
    phone: string;
    orderType: string;
    address: string;
    items: string;
    notes: string;
    status: string;
    createdAt: string;
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
        if (status === 'pending') return { color: '#F59E0B', icon: '⏳', label: 'Pending', desc: 'Your order is received and waiting to be confirmed.' };
        if (status === 'confirmed') return { color: '#3B82F6', icon: '👨‍🍳', label: 'Confirmed', desc: 'Your order is confirmed and being prepared!' };
        if (status === 'completed') return { color: '#10B981', icon: '✅', label: 'Completed', desc: 'Your order is ready / delivered. Enjoy your meal!' };
        if (status === 'cancelled') return { color: '#EF4444', icon: '❌', label: 'Cancelled', desc: 'Your order was cancelled. Please call us for help.' };
        return { color: '#9A9080', icon: '❓', label: status, desc: '' };
    };

    const handleSearch = async () => {
        if (!search) {
            setError('Please enter your order number or phone!'); return;
        }
        setLoading(true);
        setError('');
        setOrder(null);
        setOrders([]);

        try {
            if (searchType === 'id') {
                const res = await fetch(`http://localhost:8081/api/orders`);
                const data: Order[] = await res.json();
                const found = data.find(o => o.id === parseInt(search));
                if (found) {
                    setOrder(found);
                } else {
                    setError('Order not found! Please check your order number.');
                }
            } else {
                const res = await fetch(`http://localhost:8081/api/orders`);
                const data: Order[] = await res.json();
                const found = data.filter(o => o.phone === search);
                if (found.length > 0) {
                    setOrders(found);
                } else {
                    setError('No orders found for this phone number.');
                }
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
            <div style={{
                background: '#1A1A1A',
                border: `2px solid ${info.color}44`,
                borderRadius: 16, padding: 32, marginBottom: 24
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                    <div>
                        <div style={{ color: '#9A9080', fontSize: 13, marginBottom: 4 }}>Order Number</div>
                        <div style={{ color: '#C9A84C', fontSize: 36, fontWeight: 900, fontFamily: 'Playfair Display, serif' }}>
                            #{o.id}
                        </div>
                    </div>
                    <div style={{
                        background: `${info.color}22`,
                        border: `1px solid ${info.color}44`,
                        borderRadius: 100, padding: '8px 20px',
                        display: 'flex', alignItems: 'center', gap: 8
                    }}>
                        <span style={{ fontSize: 18 }}>{info.icon}</span>
                        <span style={{ color: info.color, fontWeight: 700, fontSize: 15 }}>{info.label}</span>
                    </div>
                </div>

                {/* Status Description */}
                <div style={{
                    background: `${info.color}11`,
                    border: `1px solid ${info.color}22`,
                    borderRadius: 10, padding: '14px 20px',
                    marginBottom: 24
                }}>
                    <p style={{ color: info.color, fontSize: 15, fontWeight: 600 }}>{info.desc}</p>
                </div>

                {/* Progress Bar - only for non-cancelled */}
                {o.status !== 'cancelled' && (
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                            {statusSteps.map((step, i) => {
                                const stepInfo = statusInfo(step);
                                const isActive = i <= stepIndex;
                                return (
                                    <div key={step} style={{ textAlign: 'center', flex: 1 }}>
                                        <div style={{
                                            width: 40, height: 40, borderRadius: '50%',
                                            background: isActive ? stepInfo.color : '#252525',
                                            border: `2px solid ${isActive ? stepInfo.color : '#333'}`,
                                            display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', margin: '0 auto 8px',
                                            fontSize: 18
                                        }}>
                                            {isActive ? stepInfo.icon : '○'}
                                        </div>
                                        <div style={{ color: isActive ? stepInfo.color : '#9A9080', fontSize: 12, fontWeight: isActive ? 700 : 400, textTransform: 'capitalize' }}>
                                            {step}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{ height: 4, background: '#252525', borderRadius: 2, position: 'relative' }}>
                            <div style={{
                                height: '100%', borderRadius: 2,
                                background: info.color,
                                width: stepIndex === 0 ? '0%' : stepIndex === 1 ? '50%' : '100%',
                                transition: 'width 0.5s ease'
                            }} />
                        </div>
                    </div>
                )}

                {/* Order Details */}
                <div style={{ background: '#252525', borderRadius: 10, padding: 20, marginBottom: 16 }}>
                    <div style={{ color: '#C9A84C', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
                        Order Details
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                        <div>
                            <div style={{ color: '#9A9080', fontSize: 12, marginBottom: 2 }}>Customer</div>
                            <div style={{ color: '#E8E0D0', fontSize: 15 }}>{o.customerName}</div>
                        </div>
                        <div>
                            <div style={{ color: '#9A9080', fontSize: 12, marginBottom: 2 }}>Order Type</div>
                            <div style={{ color: '#E8E0D0', fontSize: 15 }}>{o.orderType}</div>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
                        <div style={{ color: '#9A9080', fontSize: 12, marginBottom: 6 }}>Items Ordered</div>
                        <div style={{ color: '#E8E0D0', fontSize: 14, lineHeight: 1.6 }}>{o.items}</div>
                    </div>
                    {o.notes && (
                        <div style={{ marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
                            <div style={{ color: '#9A9080', fontSize: 12, marginBottom: 4 }}>Notes</div>
                            <div style={{ color: '#E8E0D0', fontSize: 14 }}>{o.notes}</div>
                        </div>
                    )}
                </div>

                {/* Cancelled message */}
                {o.status === 'cancelled' && (
                    <div style={{
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: 10, padding: 16, textAlign: 'center'
                    }}>
                        <p style={{ color: '#EF4444', fontSize: 14, marginBottom: 8 }}>
                            Your order was cancelled. Please contact us for assistance.
                        </p>
                        <a href="tel:0771234567" style={{ color: '#EF4444', fontWeight: 700, textDecoration: 'none' }}>
                            📞 Call: 0771 234 567
                        </a>
                    </div>
                )}
            </div>
        );
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
                        <Link key={href} href={href} style={{ color: href === '/track' ? '#C9A84C' : '#9A9080', textDecoration: 'none', fontSize: 14, fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase' }}>
                            {['Home', 'Menu', 'Order', 'Track'][i]}
                        </Link>
                    ))}
                </div>
                <Link href="/order" style={{ background: '#C9A84C', color: '#0D0D0D', padding: '10px 24px', borderRadius: 4, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
                    Order Now
                </Link>
            </nav>

            <section style={{ padding: '60px 60px 80px', maxWidth: 700, margin: '0 auto' }}>

                {/* HEADER */}
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <div style={{ color: '#C9A84C', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>
                        ── Order Tracking ──
                    </div>
                    <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 48, fontWeight: 900, color: '#fff', marginBottom: 16 }}>
                        Track Your <em style={{ color: '#C9A84C' }}>Order</em>
                    </h1>
                    <p style={{ color: '#9A9080', fontSize: 16 }}>
                        Enter your order number or phone number to check your order status
                    </p>
                </div>

                {/* SEARCH */}
                <div style={{ background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 16, padding: 32, marginBottom: 40 }}>

                    {/* Search Type Toggle */}
                    <div style={{ display: 'flex', gap: 0, background: '#252525', borderRadius: 8, padding: 4, marginBottom: 24 }}>
                        {(['id', 'phone'] as const).map(t => (
                            <button key={t} onClick={() => { setSearchType(t); setSearch(''); setError(''); setOrder(null); setOrders([]); }} style={{
                                flex: 1, padding: '10px', borderRadius: 6,
                                border: 'none', cursor: 'pointer',
                                background: searchType === t ? '#C9A84C' : 'transparent',
                                color: searchType === t ? '#0D0D0D' : '#9A9080',
                                fontWeight: searchType === t ? 700 : 500,
                                fontSize: 14, fontFamily: 'DM Sans, sans-serif'
                            }}>
                                {t === 'id' ? '🔢 Order Number' : '📞 Phone Number'}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div style={{ display: 'flex', gap: 12 }}>
                        <input
                            style={{
                                flex: 1, background: '#252525',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: '#E8E0D0', padding: '14px 16px',
                                borderRadius: 8, fontSize: 15,
                                fontFamily: 'DM Sans, sans-serif', outline: 'none'
                            }}
                            placeholder={searchType === 'id' ? 'Enter order number e.g. 5' : 'Enter phone e.g. 0771234567'}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        />
                        <button onClick={handleSearch} disabled={loading} style={{
                            background: '#C9A84C', color: '#0D0D0D',
                            border: 'none', padding: '14px 28px',
                            borderRadius: 8, fontSize: 15,
                            fontWeight: 700, cursor: 'pointer',
                            fontFamily: 'DM Sans, sans-serif',
                            whiteSpace: 'nowrap'
                        }}>
                            {loading ? '...' : '🔍 Track'}
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            color: '#EF4444', padding: '12px 16px',
                            borderRadius: 8, marginTop: 16,
                            fontSize: 14, textAlign: 'center'
                        }}>
                            ⚠️ {error}
                        </div>
                    )}
                </div>

                {/* SINGLE ORDER RESULT */}
                {order && <OrderCard o={order} />}

                {/* MULTIPLE ORDERS BY PHONE */}
                {orders.length > 0 && (
                    <div>
                        <div style={{ color: '#9A9080', fontSize: 14, marginBottom: 20, textAlign: 'center' }}>
                            Found {orders.length} order{orders.length > 1 ? 's' : ''} for this phone number
                        </div>
                        {orders.map(o => <OrderCard key={o.id} o={o} />)}
                    </div>
                )}

                {/* HOW IT WORKS */}
                {!order && orders.length === 0 && !error && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#9A9080', fontSize: 13, marginBottom: 24 }}>Order Status Guide</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                            {[
                                { icon: '⏳', label: 'Pending', desc: 'Order received, waiting confirmation', color: '#F59E0B' },
                                { icon: '👨‍🍳', label: 'Confirmed', desc: 'Order confirmed and being prepared', color: '#3B82F6' },
                                { icon: '✅', label: 'Completed', desc: 'Order ready or delivered!', color: '#10B981' },
                                { icon: '❌', label: 'Cancelled', desc: 'Order was cancelled', color: '#EF4444' },
                            ].map(s => (
                                <div key={s.label} style={{
                                    background: '#1A1A1A', border: `1px solid ${s.color}22`,
                                    borderRadius: 12, padding: 20, textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
                                    <div style={{ color: s.color, fontWeight: 700, marginBottom: 4 }}>{s.label}</div>
                                    <div style={{ color: '#9A9080', fontSize: 13 }}>{s.desc}</div>
                                </div>
                            ))}
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