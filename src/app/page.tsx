import ImageForm from '@/components/image-form';
import Image from 'next/image';

export default function Home() {
  return (
    <main className='p-24'>
      <section className='mb-8'>
        <h1 className='text-3xl font-bold mb-4'>Image portfolio</h1>
        <ImageForm />
        <hr className='flex w-1/2 my-4' />
      </section>
      <section>
        <h2 className='text-3xl font-bold mb-4'>My images</h2>
        {/* TODO: Add image list */}
      </section>
    </main>
  );
}
