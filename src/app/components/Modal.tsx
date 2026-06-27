'use client';
import { useRouter } from 'next/navigation';

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={() => router.back()}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-md w-full relative" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" 
          onClick={() => router.back()}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
