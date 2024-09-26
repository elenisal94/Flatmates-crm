import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DrawerComponent from '../layouts/GenericDrawer';

const withEntityManagement = (WrappedComponent, FormComponent, entityName) => {
    return function EntityManagement(props) {
        const [entities, setEntities] = useState([]);
        const [selectedEntity, setSelectedEntity] = useState(null);
        const [open, setOpen] = useState(false);
        const [mode, setMode] = useState('view');
        const [refreshInfo, setRefreshInfo] = useState(false);

        axios.defaults.baseURL = 'http://localhost:5001';
        axios.defaults.withCredentials = true;

        const fetchEntities = async () => {
            try {
                const response = await axios.get(`/api/${entityName}`);
                setEntities(response.data);
            } catch (error) {
                console.error(`Error fetching ${entityName}:`, error);
            }
        };

        // const { data, error, isLoading, mutate } = useSWR(entityName, fetchEntities)

        useEffect(() => {
            fetchEntities();
            setRefreshInfo(false);
        }, [refreshInfo]);

        const handleView = async (entity) => {
            try {
                const response = await axios.get(`/api/${entityName}/${entity._id}`);
                setSelectedEntity(response.data);
                setMode('view');
                setOpen(true);
            } catch (error) {
                console.error(`Failed to fetch ${entityName} details:`, error);
            }
        };

        const handleEdit = async (entity) => {
            try {
                const response = await axios.get(`/api/${entityName}/${entity._id}`);
                setSelectedEntity(response.data);
                setMode('edit');
                setOpen(true);
            } catch (error) {
                console.error(`Failed to fetch ${entityName} details for editing:`, error);
            }
        };

        const handleDelete = async (entity) => {
            try {
                const response = await axios.delete(`/api/${entityName}/${entity._id}`);
                if (response.status === 200) {
                    setEntities(prevEntities =>
                        prevEntities.filter(prevEntity => prevEntity._id !== entity._id)
                    );
                    setRefreshInfo(true);
                } else {
                    console.warn(`Unexpected response status: ${response.status}`);
                }
            } catch (error) {
                console.error('Failed to delete tenant:', error.message || error);
            }
        };

        const handleAddNew = () => {
            setSelectedEntity(null);
            setMode('add');
            setOpen(true);
        };

        const handleClose = () => {
            setOpen(false);
            setSelectedEntity(null);
            setMode('view');
        };

        const handleSave = async (entityData) => {
            try {
                if (mode === 'add') {
                    const response = await axios.post(`/api/${entityName}`, entityData);
                    setEntities(prevEntities => [...prevEntities, response.data]);
                } else if (mode === 'edit') {
                    const response = await axios.put(`/api/${entityName}/${selectedEntity._id}`, entityData);
                    setEntities(prevEntities => prevEntities.map(entity =>
                        entity._id === selectedEntity._id ? response.data : entity
                    ));
                }
                setRefreshInfo(true);
                handleClose();
            } catch (error) {
                console.error(`Failed to save ${entityName}:`, error);
            }
        };

        return (
            <>
                <WrappedComponent
                    {...props}
                    entities={entities}
                    handleView={handleView}
                    handleEdit={handleEdit}
                    handleAddNew={handleAddNew}
                    handleDelete={handleDelete}
                />
                <DrawerComponent open={open} onClose={handleClose}>
                    <FormComponent
                        mode={mode}
                        onClose={handleClose}
                        onSave={handleSave}
                        entityData={selectedEntity}
                        entityName={entityName}
                    />
                </DrawerComponent>
            </>
        );
    };
};

export default withEntityManagement;