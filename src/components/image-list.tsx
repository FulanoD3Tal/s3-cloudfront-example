'use client';
import { getImages } from '@/repository/api';
import { useQuery } from '@tanstack/react-query';

export default function ImageList() {
  const { data, isLoading, isRefetching } = useQuery({
    queryKey: ['images'],
    queryFn: getImages,
  });
  return (
    <>
      <h2
        className={`text-3xl font-bold mb-4 ${isRefetching && 'animate-pulse'}`}
      >
        My images{' '}
      </h2>
      <ul>
        {isLoading && <span>loading images...</span>}
        {data?.map((img) => (
          <li key={`img-${img}`}>{img}</li>
        ))}
      </ul>
    </>
  );
}
