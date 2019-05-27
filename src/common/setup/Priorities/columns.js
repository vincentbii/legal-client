import { Popconfirm, Switch, Divider } from "antd";
import React from 'react';


export const test = (state, renderColumns, edit, cancel, save, destroy) => {
  return [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => renderColumns(text, record, 'name'),
    },
    {
      title: 'Active',
      dataIndex: 'active',
      // render: (text, record) => renderColumns(text, record, 'name'),
      render: (e, record) => (< Switch checked={e} />)
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
    },
    {
      title: 'Action',
      dataIndex: 'action',

      render: (text, record) => {
        const { editable } = record;
        return (
          <div className="editable-row-operations">
            {
              editable ?
                <span>
                  <a onClick={() => save(record.url)}>Save</a>
                  <Divider type="vertical" />
                  <Popconfirm title="Sure to cancel?" onConfirm={() => cancel(record.url)}>
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
                :
                <span>
                  <a onClick={() => edit(record.url)}>Edit</a>
                  <Divider type="vertical" />
                  <Popconfirm title="Sure to Delete?" onConfirm={() => destroy(record.url)}>
                    <a>Delete</a>
                  </Popconfirm>
                </span>
            }
          </div>
        );
      },
    },
  ]
};