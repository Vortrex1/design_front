import React, { useCallback, useState, useMemo } from "react";
import { Select, MenuItem, Button } from "@mui/material";
import DeleteUserModal from "./usersModals/DeleteUserModal";
import { useRenderCount } from "../../../../hooks/useRenderCount";
import useActions from "../../../../hooks/useActions";
import { toast } from "react-toastify";
import isEqual from "lodash/isEqual";
import PropTypes from 'prop-types';

import REMOTE_HOST_NAME from "../../../../env/index";

const API_URL = REMOTE_HOST_NAME + 'images/userImages/';

const AdminUsersTableRow = React.memo(
    ({ user, roleList }) => {
        const [showDeleteModal, setShowDeleteModal] = useState(false);
        const { changeRoles, getUsers } = useActions();
        const renderCount = useRenderCount();
        const [selectedRole, setSelectedRole] = useState(user.role || '');

        const closeModal = useCallback(() => {
            setShowDeleteModal(false);
        }, []);

        const handleRoleChange = useCallback(
            async (event) => {
                const newRole = event.target.value;
                
                if (newRole === selectedRole) return;

                try {
                    console.log("user.id", user.id);
                    
                    const result = await changeRoles(user.id, newRole);

                    if (result.success) {
                        await getUsers();
                        setSelectedRole(newRole);
                        toast.success("User role updated successfully.");
                    } else {
                        toast.error(result.message || "Failed to update role.");
                    }
                } catch (error) {
                    toast.error("Failed to change roles.");
                }
            },
            [user.id, selectedRole, changeRoles, getUsers]
        );

        const userAvatar = useMemo(() => API_URL  + user.photo, [user.photo]);
        const roleOptions = useMemo(() => roleList.length ? roleList : [{ name: "No Roles Available" }], [roleList]);

        return (
            <>
                <tr>
                    <td style={{ fontWeight: '600' }}>{user.name}</td>
                    <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</td>
                    <td>
                        <Select
                            value={selectedRole}
                            onChange={handleRoleChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Role' }}
                            style={{
                                background: 'var(--card-bg)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                minWidth: '150px'
                            }}
                        >
                            {roleOptions.map((role) => (
                                <MenuItem key={role.name} value={role.name} disabled={role.name === "No Roles Available"}>
                                    {role.name}
                                </MenuItem>
                            )) }
 
                        </Select>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                        <button
                            title="Видалити користувача"
                            className="admin-luxury-action-btn danger"
                            onClick={() => setShowDeleteModal(true)}
                        >
                            <img
                                src="/Icons for functions/free-icon-recycle-bin-3156999.png"
                                alt="Delete"
                                height="18"
                            />
                        </button>
                    </td>
                </tr>
                <DeleteUserModal
                    showModal={showDeleteModal}
                    closeModal={closeModal}
                    userId={user.id}
                />
            </>
        );
    },
    (prevProps, nextProps) =>
        isEqual(prevProps.user, nextProps.user) &&
        isEqual(prevProps.roleList, nextProps.roleList)
);

AdminUsersTableRow.displayName = 'AdminUsersTableRow';

AdminUsersTableRow.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        roles: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired
            })
        ),
        image: PropTypes.shape({
            filePath: PropTypes.string
        })
    }).isRequired,
    roleList: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired
    })).isRequired
};

export default AdminUsersTableRow;