import React, { useEffect } from "react";
import useActions from "../../../../hooks/useActions";
import AdminUsersTable from "./AdminUsersTable";

const AdminUsersTableContainer = () => {
  const { getUsers, getRolesData } = useActions();

  useEffect(() => {
    getUsers();
    getRolesData();
  }, []);

  return <AdminUsersTable />;
};

export default AdminUsersTableContainer;
