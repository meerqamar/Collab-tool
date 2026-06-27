'use client'; 
export default function Error({
 error,
 reset,
}: {
 error: Error & { digest?: string };
 reset: () => void;
}) {
 return (
 <div className='text-center py-12'>
 <h2 className='text-2xl font-bold text-red-600 mb-4'>Something went wrong!</h2>
 <p className='text-gray-600 mb-6'>{error.message}</p>
 <button
 onClick={() => reset()}
 className='bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700'
 >
 Try again
 </button>
 </div>
 );
}
