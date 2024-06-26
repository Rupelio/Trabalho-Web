import { useState, useEffect } from 'react';
import api from './services/api';

import './css/global.css';
import './css/app.css';
import './css/sidebar.css';
import './css/main.css';

import EmployeeForm from './components/EmployeeForm';
import EmployeeItem from './components/EmployeeItem';

function App() {
    const [employeesList, setEmployeesList] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [employeesEdit, setEmployeesEdit] = useState(null);
    const [employeeId, setEmployeeId] = useState(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await api.get('/employees');
                setEmployeesList(response.data);
            } catch (error) {
                console.log('Erro ao buscar funcionários', error);
            }
        };
        fetchEmployees();
    }, [employees]);

    async function handleAddEmployee(data) {
        const response = await api.post('/employees', data);
        setEmployees([...employees, response.data]);
        setEmployeesList([...employeesList, response.data]);
    }

    async function handleDeleteEmployee(id) {
        setEmployeesList(
            employeesList.filter((employees) => employees.id !== id)
        );
    }

    async function handleEditEmployee(employee) {
        setEmployeeId(employee.id);
        setEmployeesEdit(employee);
    }

    async function handleUpdateEmployee(data) {
        try {
            const response = await api.put(`/employees/${employeeId}`, data);
            setEmployeesList(
                employeesList.map((employee) =>
                    employee.id === employeeId ? response.data : employee
                )
            );
            setEmployeesEdit(null);
        } catch (error) {
            console.error('Erro ao editar funcionário:', error);
        }
    }

    return (
        <div id="app">
            <aside>
                <strong>
                    {employeesEdit
                        ? 'Editar Funcionário'
                        : 'Cadastro de Funcionário'}
                </strong>
                <EmployeeForm
                    onSubmit={
                        employeesEdit ? handleUpdateEmployee : handleAddEmployee
                    }
                    initialData={employeesEdit}
                />
            </aside>
            <main>
                <ul>
                    {employeesList.map((employee) => (
                        <EmployeeItem
                            key={employee.id}
                            employee={employee}
                            onEdit={handleEditEmployee}
                            onDelete={handleDeleteEmployee}
                        />
                    ))}
                </ul>
            </main>
        </div>
    );
}

export default App;
