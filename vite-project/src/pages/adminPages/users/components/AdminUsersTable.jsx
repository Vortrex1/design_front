import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../../../../store/state/actions/userActions.js';
import AdminUsersTableRow from './AdminUsersTableRow.jsx';

const AdminUsersTable = () => {
  const userList = useSelector((state) => state.users.userList);
  const roleList = useSelector((state) => state.role.roleList);
  
  if (!Array.isArray(userList) || userList.length === 0) {
    return <div className="admin-luxury-empty">Користувачі відсутні</div>;
  }

  return (
    <div className="admin-luxury-table-container">
      <table className="admin-luxury-table">
        <thead>
          <tr>
            <th>Ім'я</th>
            <th>Email</th>
            <th>Ролі</th>
            <th style={{ width: '200px', textAlign: 'center' }}>Дії</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user) => (
            <AdminUsersTableRow key={user.id} user={user} roleList={roleList} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(AdminUsersTable);