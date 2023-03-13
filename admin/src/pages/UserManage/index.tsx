import { fetchUserList } from '@/services/userManage';
import { EColumnDataIndex } from '@/utils/constants/enum';
import { Table } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import React, { useEffect, useState } from 'react';
import './index.less';
interface DataType {
  name: {
    first: string;
    last: string;
  };
  gender: string;
  email: string;
  login: {
    uuid: string;
  };
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

const columns: ColumnsType<DataType> = [
  {
    title: '头像',
    dataIndex: 'avatar',
  },
  {
    title: '用户名',
    dataIndex: 'username',
    width: '20%',
  },
  {
    title: '创建时间',
    dataIndex: EColumnDataIndex.CREATE_TIME,
  },
];

const getRandomuserParams = (params: TableParams) => ({
  results: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});

const UserManage: React.FC = () => {
  const [data, setData] = useState<DataType[]>();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const fetchData = async () => {
    setLoading(true);
    const res = await fetchUserList({
      pageNum: 1,
      pageSize: 10,
    });
    if (res) {
      const { rows, total } = res;
      setData(rows);
      setLoading(false);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total,
        },
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue>,
    sorter: SorterResult<DataType>,
  ) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  return (
    <Table
      columns={columns}
      rowKey="userId"
      dataSource={data}
      pagination={tableParams.pagination}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

export default UserManage;
