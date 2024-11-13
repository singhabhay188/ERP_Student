'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const page = () => {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('user');
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    setTimeout(() => {
      router.push('/');
    }, 1500);
  }, [router]);

  return (
    <div className='p-8 space-y-4'>
      <h1 className='text-2xl font-bold'>Logging out...</h1>
      <Button 
        onClick={() => router.push('/')}
      >
        Go to Homepage
      </Button>
    </div>
  );
};

export default page;