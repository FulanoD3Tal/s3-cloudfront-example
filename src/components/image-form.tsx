'use client';
import { uploadFile } from '@/repository/api';
import { useMutation } from '@tanstack/react-query';
type Form = {
  imageFile: FileList;
};
import { SubmitHandler, useForm } from 'react-hook-form';
export default function ImageForm() {
  const { register, handleSubmit, reset } = useForm<Form>();

  const { mutateAsync, isLoading, isSuccess } = useMutation({
    mutationFn: uploadFile,
  });

  const onSubmit: SubmitHandler<Form> = async ({ imageFile }) => {
    try {
      await mutateAsync(imageFile[0]);
      reset({ imageFile: undefined });
    } catch (error) {}
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset className='flex flex-col gap-2'>
        <label htmlFor='image'>Select and image</label>
        <input
          type='file'
          id='image'
          accept='image/png'
          {...register('imageFile', { required: true })}
        />
        <span>{isSuccess && 'Image uploaded'}</span>
      </fieldset>
      <button
        type='submit'
        disabled={isLoading}
        className='bg-white text-black rounded-sm py-1 px-4 mt-2'
      >
        {isLoading ? 'Uploading...' : 'Upload image'}
      </button>
    </form>
  );
}
