import { useState } from 'react';
import { format } from 'date-fns';
import { Modal } from 'antd';
import api from '../../services/api';
import './styles.css';

const formatSalary = (salary) => {
    if (salary) {
        return salary.replace('.', ',');
    }
    return '';
};

export default function EmployeeItem({ employee, onDelete, onEdit }) {
    const [openModal, setOpenModal] = useState(false);
    const formattedSalary = formatSalary(employee.salary);
    const hireDate = new Date(employee.hireDate);

    const formattedHireDate = !isNaN(hireDate.getTime())
        ? format(hireDate, 'dd/MM/yyyy')
        : '';

    const deleteEmployee = async () => {
        try {
            await api.delete(`/employees/${employee.id}`);
            onDelete(employee.id);
        } catch (error) {
            console.error('Erro ao deletar funcionario:', error);
        }
    };

    const handleEditClick = async () => {
        onEdit(employee);
    };

    const handleModalOpen = () => {
        setOpenModal(true);
    };

    const handleModalClose = () => {
        setOpenModal(false);
    };

    return (
        <li className="employee-item">
            <header>
                <div className="employees-info">
                    <div className="name-icons">
                        <strong>{employee.name}</strong>
                        <span className="icon-buttons">
                            <i
                                onClick={handleEditClick}
                                className="fas fa-edit"
                            ></i>
                            <i
                                onClick={handleModalOpen}
                                className="fas fa-trash-alt"
                            ></i>
                        </span>
                    </div>
                    <span className="title">{employee.position}</span>
                </div>
            </header>
            <Modal
                tittle="Atenção"
                open={openModal}
                onOk={deleteEmployee}
                onCancel={handleModalClose}
                okText="Sim"
                cancelText="Cancelar"
            >
                <p>Tem certeza que deseja excluir esse funcionario?</p>
            </Modal>
            <div>
                <p>E-mail: {employee.email}</p>
                <p>Remuneração: R$ {formattedSalary}</p>
                <p>Data Contratação: {formattedHireDate}</p>
                <p>Departamento: {employee.department_name}</p>
            </div>
        </li>
    );
}
