import { request } from '@umijs/max';

interface ILoginParams {
    pageNum: number;
    pageSize: number;
}

export async function fetchUserList(params: ILoginParams) {
    return request('/api/restaurant-admin/user/list', {
        method: 'get',
        params,
    });
}