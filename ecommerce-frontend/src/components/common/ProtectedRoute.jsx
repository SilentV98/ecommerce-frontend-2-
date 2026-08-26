import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRole }) {
    // محاكاة استرجاع بيانات المستخدم من التخزين المحلي (LocalStorage) أو الـ Context
    // مثال: const user = { isLoggedIn: true, role: 'customer' };
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : { isLoggedIn: false, role: null };

    // إذا لم يكن المستخدم مسجلاً، وجهه إلى صفحة تسجيل الدخول
    if (!user.isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // إذا كان هناك دور محدد مطلوب ولا يتطابق دور المستخدم، وجهه للرئيسية أو صفحة غير مصرح بها
    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;