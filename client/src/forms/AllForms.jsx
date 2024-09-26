import React from 'react';
import AddForm from './AddForm'
import EditForm from './EditForm'
import ViewForm from './ViewForm'

// AllForms component
const AllForms = ({ entityData, mode, onSave, onClose, formFields, entityName }) => {
    switch (mode) {
        case 'add':
            return <AddForm onSave={onSave} onClose={onClose} formFields={formFields} entityName={entityName} />;
        case 'view':
            return <ViewForm entityData={entityData} onClose={onClose} formFields={formFields} entityName={entityName}/>;
        case 'edit':
            return <EditForm entityData={entityData} onSave={onSave} onClose={onClose} formFields={formFields} entityName={entityName} />;
        default:
            return null;
    }
};

export default AllForms;
