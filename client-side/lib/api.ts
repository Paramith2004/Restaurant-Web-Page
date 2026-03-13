import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Menu
export const getMenuItems = () => api.get('/menu');
export const getMenuByCategory = (category: string) => api.get(`/menu/category/${category}`);
export const addMenuItem = (item: any) => api.post('/menu', item);
export const updateMenuItem = (id: number, item: any) => api.put(`/menu/${id}`, item);
export const deleteMenuItem = (id: number) => api.delete(`/menu/${id}`);

// Orders
export const getOrders = () => api.get('/orders');
export const placeOrder = (order: any) => api.post('/orders', order);
export const updateOrderStatus = (id: number, status: string) => api.put(`/orders/${id}/status?status=${status}`);

// Reservations
export const getReservations = () => api.get('/reservations');
export const makeReservation = (reservation: any) => api.post('/reservations', reservation);
export const updateReservationStatus = (id: number, status: string) => api.put(`/reservations/${id}/status?status=${status}`);