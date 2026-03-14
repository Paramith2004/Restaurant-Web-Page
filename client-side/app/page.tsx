'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getOrders, getReservations, getMenuItems,
  updateOrderStatus, updateReservationStatus,
  addMenuItem, deleteMenuItem
} from '@/lib/api';

interface User {
  name: string;
  role: string;
}

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

interface Reservation {
  id: number;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  notes: string;
  status: string;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  emoji: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<'orders' | 'reservations' | 'menu'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newItem, setNewItem] = useState({
    name: '', description: '', price: '',
    category: 'rice', emoji: '🍛'
  });
  const [loading, setLoading] = useState(false);

  const loadAll = useCallback(async () => {
    const [o, r, m] = await Promise.all([
      getOrders(), getReservations(), getMenuItems()
    ]);
    setOrders(o.data);
    setReservations(r.data);
    setMenuItems(m.data);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const role = localStorage.getItem('admin_role');
    const name = localStorage.getItem('admin_name');

    if (!token || !role) {
      router.push('/admin/login');
      return;
    }

    const timer = setTimeout(() => {
      setUser({ name: name || '', role });
      loadAll();
    }, 0);

    return () => clearTimeout(timer);
  }, [router, loadAll]);

  const handleOrderStatus = async (id: number, status: string) => {
    await updateOrderStatus(id, status);
    loadAll();
  };

  const handleResStatus = async (id: number, status: string) => {
    await updateReservationStatus(id, status);
    loadAll();
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price) {
      alert('Please fill name and price!'); return;
    }
    setLoading(true);
    await addMenuItem({ ...newItem, price: parseFloat(newItem.price), available: true });
    setNewItem({ name: '', description: '', price: '', category: 'rice', emoji: '🍛' });
    loadAll();
    setLoading(false);
  };

  const handleDeleteItem = async (id: number) => {
    if (confirm('Delete this item?')) {
      await deleteMenuItem(id);
      loadAll();
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/admin/login');
  };

  const statusColor = (status: string) => {
    if (status === 'pending') return '#F59E0B';
    if (status === 'confirmed') return '#3B82F6';
    if (status === 'completed') return '#10B981';
    if (status === 'cancelled') return '#EF4444';
    return '#9A9080';
  };

  const inputStyle = {
    width: '100%', background: '#252525',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#E8E0D0', padding: '12px 14px',
    borderRadius: 8, fontSize: 14,
    fontFamily: 'DM Sans, sans-serif', outline: 'none'
  };

  const labelStyle = {
    display: 'block', fontSize: 11,
    letterSpacing: 1.5, textTransform: 'uppercase' as const,
    color: '#9A9080', marginBottom: 6
  };

  if (!user) return (
      <div style={{ background: '#0D0D0D', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#C9A84C', fontSize: 18 }}>Loading...</div>
      </div>
  );

  const tabs = [
    { key: 'orders', label: '📦 Orders', count: orders.length },
    { key: 'reservations', label: '🗓️ Reservations', count: reservations.length },
    { key: 'menu', label: '🍛 Menu Items', count: menuItems.length },
  ];

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ color: '#9A9080', fontSize: 14 }}>
            👋 {user.name} <span style={{ color: '#C9A84C' }}>({user.role})</span>
          </span>
            <button onClick={handleLogout} style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#EF4444', padding: '8px 20px',
              borderRadius: 4, fontSize: 14,
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
            }}>
              Logout
            </button>
          </div>
        </nav>

        <section style={{ padding: '40px 60px 80px' }}>

          {/* HEADER */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ color: '#C9A84C', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>── Admin Panel ──</div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 48, fontWeight: 900, color: '#fff' }}>
              Restaurant <em style={{ color: '#C9A84C' }}>Dashboard</em>
            </h1>
          </div>

          {/* STATS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 40 }}>
            {[
              { label: 'Total Orders', value: orders.length, icon: '📦', color: '#C9A84C' },
              { label: 'Reservations', value: reservations.length, icon: '🗓️', color: '#3B82F6' },
              { label: 'Menu Items', value: menuItems.length, icon: '🍛', color: '#10B981' },
            ].map(stat => (
                <div key={stat.label} style={{
                  background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12, padding: 24, display: 'flex',
                  justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <div style={{ color: '#9A9080', fontSize: 13, marginBottom: 8 }}>{stat.label}</div>
                    <div style={{ color: stat.color, fontSize: 36, fontFamily: 'Playfair Display, serif', fontWeight: 900 }}>{stat.value}</div>
                  </div>
                  <div style={{ fontSize: 40 }}>{stat.icon}</div>
                </div>
            ))}
          </div>

          {/* TABS */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
            {tabs.map(t => (
                <button key={t.key} onClick={() => setTab(t.key as 'orders' | 'reservations' | 'menu')} style={{
                  padding: '12px 24px', borderRadius: 8,
                  border: '1px solid rgba(201,168,76,0.2)',
                  background: tab === t.key ? '#C9A84C' : '#1A1A1A',
                  color: tab === t.key ? '#0D0D0D' : '#9A9080',
                  fontWeight: tab === t.key ? 700 : 500,
                  fontSize: 14, cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif'
                }}>
                  {t.label} ({t.count})
                </button>
            ))}
            <button onClick={loadAll} style={{
              padding: '12px 20px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent', color: '#9A9080',
              fontSize: 14, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', marginLeft: 'auto'
            }}>
              🔄 Refresh
            </button>
          </div>

          {/* ORDERS TAB */}
          {tab === 'orders' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {orders.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#9A9080', padding: 60, background: '#1A1A1A', borderRadius: 12 }}>
                      <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                      <p>No orders yet!</p>
                    </div>
                ) : (
                    orders.map(order => (
                        <div key={order.id} style={{
                          background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: 12, padding: 24
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                            <div>
                              <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
                                #{order.id} — {order.customerName}
                              </div>
                              <div style={{ color: '#9A9080', fontSize: 14 }}>
                                📞 {order.phone} &nbsp;|&nbsp; 🛵 {order.orderType}
                                {order.address && ` | 📍 ${order.address}`}
                              </div>
                            </div>
                            <span style={{
                              background: `${statusColor(order.status)}22`,
                              color: statusColor(order.status),
                              border: `1px solid ${statusColor(order.status)}44`,
                              padding: '6px 16px', borderRadius: 100,
                              fontSize: 13, fontWeight: 700, textTransform: 'capitalize'
                            }}>
                      {order.status}
                    </span>
                          </div>
                          <div style={{ background: '#252525', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
                            <div style={{ color: '#C9A84C', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Order Items</div>
                            <div style={{ color: '#E8E0D0', fontSize: 14 }}>{order.items}</div>
                            {order.notes && <div style={{ color: '#9A9080', fontSize: 13, marginTop: 6 }}>📝 {order.notes}</div>}
                          </div>
                          <div style={{ display: 'flex', gap: 10 }}>
                            {['pending', 'confirmed', 'completed', 'cancelled'].map(status => (
                                <button key={status} onClick={() => handleOrderStatus(order.id, status)} style={{
                                  padding: '8px 16px', borderRadius: 6,
                                  border: `1px solid ${statusColor(status)}44`,
                                  background: order.status === status ? `${statusColor(status)}22` : 'transparent',
                                  color: statusColor(status),
                                  fontSize: 13, cursor: 'pointer',
                                  fontFamily: 'DM Sans, sans-serif',
                                  fontWeight: order.status === status ? 700 : 400,
                                  textTransform: 'capitalize'
                                }}>
                                  {status}
                                </button>
                            ))}
                          </div>
                        </div>
                    ))
                )}
              </div>
          )}

          {/* RESERVATIONS TAB */}
          {tab === 'reservations' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {reservations.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#9A9080', padding: 60, background: '#1A1A1A', borderRadius: 12 }}>
                      <div style={{ fontSize: 48, marginBottom: 12 }}>🗓️</div>
                      <p>No reservations yet!</p>
                    </div>
                ) : (
                    reservations.map(res => (
                        <div key={res.id} style={{
                          background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: 12, padding: 24
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                            <div>
                              <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
                                #{res.id} — {res.name}
                              </div>
                              <div style={{ color: '#9A9080', fontSize: 14 }}>
                                📞 {res.phone} &nbsp;|&nbsp; 📅 {res.date} &nbsp;|&nbsp; ⏰ {res.time} &nbsp;|&nbsp; 👥 {res.guests} guests
                              </div>
                              {res.notes && <div style={{ color: '#9A9080', fontSize: 13, marginTop: 4 }}>📝 {res.notes}</div>}
                            </div>
                            <span style={{
                              background: `${statusColor(res.status)}22`,
                              color: statusColor(res.status),
                              border: `1px solid ${statusColor(res.status)}44`,
                              padding: '6px 16px', borderRadius: 100,
                              fontSize: 13, fontWeight: 700, textTransform: 'capitalize'
                            }}>
                      {res.status}
                    </span>
                          </div>
                          <div style={{ display: 'flex', gap: 10 }}>
                            {['pending', 'confirmed', 'completed', 'cancelled'].map(status => (
                                <button key={status} onClick={() => handleResStatus(res.id, status)} style={{
                                  padding: '8px 16px', borderRadius: 6,
                                  border: `1px solid ${statusColor(status)}44`,
                                  background: res.status === status ? `${statusColor(status)}22` : 'transparent',
                                  color: statusColor(status),
                                  fontSize: 13, cursor: 'pointer',
                                  fontFamily: 'DM Sans, sans-serif',
                                  fontWeight: res.status === status ? 700 : 400,
                                  textTransform: 'capitalize'
                                }}>
                                  {status}
                                </button>
                            ))}
                          </div>
                        </div>
                    ))
                )}
              </div>
          )}

          {/* MENU TAB */}
          {tab === 'menu' && (
              <div>
                <div style={{ background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 16, padding: 28, marginBottom: 32 }}>
                  <h3 style={{ color: '#fff', fontFamily: 'Playfair Display, serif', fontSize: 22, marginBottom: 20 }}>
                    ➕ Add New Menu Item
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={labelStyle}>Name *</label>
                      <input style={inputStyle} placeholder="e.g. Rice & Curry"
                             value={newItem.name}
                             onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                    </div>
                    <div>
                      <label style={labelStyle}>Price (Rs.) *</label>
                      <input style={inputStyle} type="number" placeholder="350"
                             value={newItem.price}
                             onChange={e => setNewItem({ ...newItem, price: e.target.value })} />
                    </div>
                    <div>
                      <label style={labelStyle}>Category</label>
                      <select style={inputStyle}
                              value={newItem.category}
                              onChange={e => setNewItem({ ...newItem, category: e.target.value })}>
                        <option value="rice">🍛 Rice & Curry</option>
                        <option value="noodles">🍜 Noodles</option>
                        <option value="short">🥪 Short Eats</option>
                        <option value="drinks">🥤 Drinks</option>
                        <option value="desserts">🍮 Desserts</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 16, marginBottom: 20 }}>
                    <div>
                      <label style={labelStyle}>Description</label>
                      <input style={inputStyle} placeholder="Brief description"
                             value={newItem.description}
                             onChange={e => setNewItem({ ...newItem, description: e.target.value })} />
                    </div>
                    <div>
                      <label style={labelStyle}>Emoji</label>
                      <input style={inputStyle} placeholder="🍛"
                             value={newItem.emoji}
                             onChange={e => setNewItem({ ...newItem, emoji: e.target.value })} />
                    </div>
                  </div>
                  <button onClick={handleAddItem} disabled={loading} style={{
                    background: '#C9A84C', color: '#0D0D0D',
                    border: 'none', padding: '14px 32px',
                    borderRadius: 8, fontSize: 15,
                    fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    {loading ? 'Adding...' : '➕ Add to Menu'}
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {menuItems.map(item => (
                      <div key={item.id} style={{
                        background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 12, overflow: 'hidden'
                      }}>
                        <div style={{
                          height: 120, background: 'linear-gradient(135deg,#1a1200,#2a1e00)',
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: 52
                        }}>
                          {item.emoji || '🍛'}
                        </div>
                        <div style={{ padding: 16 }}>
                          <div style={{ color: '#C9A84C', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>{item.category}</div>
                          <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{item.name}</div>
                          <div style={{ color: '#9A9080', fontSize: 13, marginBottom: 12 }}>{item.description}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ color: '#C9A84C', fontWeight: 700, fontSize: 18 }}>Rs. {item.price}</div>
                            <button onClick={() => handleDeleteItem(item.id)} style={{
                              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                              color: '#EF4444', padding: '6px 14px',
                              borderRadius: 6, fontSize: 13,
                              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                            }}>
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
          )}
        </section>

        <footer style={{ background: '#080808', borderTop: '1px solid rgba(201,168,76,0.15)', padding: '40px 60px', textAlign: 'center' }}>
          <p style={{ color: '#9A9080', fontSize: 14 }}>© 2026 Dinu&apos;s Tasty Admin Panel | Developed by Paramith Kavisha</p>
        </footer>

      </main>
  );
}