import { request } from '@umijs/max';

interface ILoginParams {
  username: string;
  password: string;
}

export async function login(data: ILoginParams) {
  return request('/api/restaurant-admin/login', {
    method: 'POST',
    data,
  });
}