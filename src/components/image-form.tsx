'use client';

type Form = {
  imageFile: FileList;
};
import { SubmitHandler, useForm } from 'react-hook-form';
export default function ImageForm() {
  const { register, handleSubmit } = useForm<Form>();

  const onSubmit: SubmitHandler<Form> = ({ imageFile }) => {
    // TODO: Upload image
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
      </fieldset>
      <button
        type='submit'
        className='bg-white text-black rounded-sm py-1 px-4 mt-2'
      >
        Upload image
      </button>
    </form>
  );
}