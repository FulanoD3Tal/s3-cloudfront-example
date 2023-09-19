import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export async function uploadFile(image: File) {
  const form = new FormData();
  form.append('image-file', image);
  const response = await api.post<Record<string, unknown>>(
    '/upload-image',
    form
  );
  return response.data;
}

export async function getImages() {
  const response = await api.get<string[]>('/image');
  return response.data;
}
