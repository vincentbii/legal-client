import React from 'react';
import { Popconfirm } from 'antd';

export const columns = (state,handleDelete) => {
    
    return [
        {
            title: 'Name',
            dataIndex: 'name',
            editable: true,
            // render: (text, record) => renderColumns(text, record, 'name'),
          },
          {
            title: 'Active',
            dataIndex: 'active',
            editable: true,
            // render: (e, record) => (< Switch checked={e} />)
          },
          {
            title: 'operation',
            dataIndex: 'operation',
            render: (text, record) =>
              state.religions.length >= 1 ? (
                <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                  <a href="javascript:;">Delete</a>
                </Popconfirm>
              ) : null,
          },
    ]};