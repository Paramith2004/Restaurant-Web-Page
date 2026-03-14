'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            router.push('/admin');
        }
    }, [router]);

    const handleLogin = async () => {
        if (!form.email || !form.password) {
            setError('Please fill all fields!');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:8081/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email, password: form.password })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Login failed!');
                setLoading(false);
                return;
            }

            const token = data.token;
            const name = data.name;
            const email = data.email;
            const role = data.role;

            if (role !== 'admin' && role !== 'owner' && role !== 'staff') {
                setError('Access denied!');
                setLoading(false);
                return;
            }

            localStorage.setItem('admin_token', token);
            localStorage.setItem('admin_name', name);
            localStorage.setItem('admin_email', email);
            localStorage.setItem('admin_role', role);

            router.push('/admin');

        } catch {
            setError('Cannot connect to server!');
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

    return (
        <main style={{
            background: '#0D0D0D', minHeight: '100vh',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{ width: '100%', maxWidth: 420, padding: '0 24px' }}>

                {/* LOGO */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <Link href="/" style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: 36, fontWeight: 900,
                        color: '#C9A84C', textDecoration: 'none'
                    }}>
                        Dinu&apos;s <span style={{ color: '#fff', fontStyle: 'italic', fontWeight: 400 }}>Tasty</span>
                    </Link>
                    <div style={{ color: '#9A9080', fontSize: 14, marginTop: 8 }}>
                        Admin Panel Login
                    </div>
                </div>

                {/* FORM */}
                <div style={{
                    background: '#1A1A1A',
                    border: '1px solid rgba(201,168,76,0.2)',
                    borderRadius: 16, padding: 36
                }}>
                    <h2 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: 24, fontWeight: 700,
                        color: '#fff', marginBottom: 28, textAlign: 'center'
                    }}>
                        👑 Staff Login
                    </h2>

                    {error && (
                        <div style={{
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            color: '#EF4444', padding: '12px 16px',
                            borderRadius: 8, marginBottom: 20,
                            fontSize: 14, textAlign: 'center'
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <div style={{ marginBottom: 20 }}>
                        <label style={{
                            display: 'block', fontSize: 12,
                            letterSpacing: 1.5, textTransform: 'uppercase',
                            color: '#9A9080', marginBottom: 8
                        }}>
                            Email
                        </label>
                        <input
                            style={inputStyle}
                            type="email"
                            placeholder="your@email.com"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        />
                    </div>

                    <div style={{ marginBottom: 28 }}>
                        <label style={{
                            display: 'block', fontSize: 12,
                            letterSpacing: 1.5, textTransform: 'uppercase',
                            color: '#9A9080', marginBottom: 8
                        }}>
                            Password
                        </label>
                        <input
                            style={inputStyle}
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        />
                    </div>

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        style={{
                            width: '100%', background: '#C9A84C',
                            color: '#0D0D0D', border: 'none',
                            padding: 16, borderRadius: 8,
                            fontSize: 16, fontWeight: 700,
                            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                        }}>
                        {loading ? 'Logging in...' : '🔐 Login'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <Link href="/" style={{ color: '#9A9080', fontSize: 13, textDecoration: 'none' }}>
                            ← Back to Website
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
