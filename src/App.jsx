import  { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

// 1. Static imports ki jagah Lazy imports use karein
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const ScanPage = lazy(() => import('./components/ScanPage'));
const TokenStatus = lazy(() => import('./components/TokenStatus'));

// 2. Ek simple Loading component banayein fallback ke liye
const FallbackLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      <p className="text-sm font-medium text-gray-500">Loading...</p>
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      {/* 3. Suspense wrapper lagayein jo component load hone tak fallback dikhayega */}
      <Suspense fallback={<FallbackLoader />}>
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Route */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Public Routes */}
          <Route path="/scan/:businessId" element={<ScanPage />} />
          <Route path="/status/:tokenId" element={<TokenStatus />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}