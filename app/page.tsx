import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  // have a search so a user can find their league
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='space-x-2'>
        <Link href='/register' className='text-primary'>
          Register
        </Link>
        <Link href='/login' className='text-secondary'>
          Login
        </Link>
        <Link href='/league/NBA' className='text-secondary'>
          league
        </Link>
      </div>
    </main>
  );
}
