import { useState, useEffect } from 'react';
import api from '../../services/api';
import './styles.css';

export default function EmployeeForm({ onSubmit, initialData }) {
    const [employeeName, setEmployeeName] = useState('');
    const [employeeEmail, setEmployeeEmail] = useState('');
    const [employeePosition, setEmployeePosition] = useState('');
    const [employeeSalary, setEmployeeSalary] = useState('');
    const [employeeTransport, setEmployeeTransport] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [departmentId, setDepartmentId] = useState('');

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await api.get('/departments');
                setDepartments(response.data);
            } catch (error) {
                console.error('Erro ao buscar departamentos:', error);
            }
        };

        fetchDepartments();
    }, []);

    useEffect(() => {
        if (initialData) {
            setEmployeeName(initialData.name);
            setEmployeeEmail(initialData.email);
            setEmployeePosition(initialData.position);
            setEmployeeSalary(initialData.salary);
            setEmployeeTransport(initialData.transportAllowance);
            setDepartmentId(initialData.department_id);
        }
    }, [initialData]);

    const validate = (field, value) => {
        const newErrors = { ...errors };
        switch (field) {
            case 'employeeName':
                if (!value) {
                    newErrors.employeeName = 'Nome completo é obrigatório.';
                } else {
                    delete newErrors.employeeName;
                }
                break;
            case 'employeeEmail':
                if (!value) {
                    newErrors.employeeEmail = 'E-mail é obrigatório.';
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    newErrors.employeeEmail = 'E-mail inválido.';
                } else {
                    delete newErrors.employeeEmail;
                }
                break;
            case 'employeePosition':
                if (!value) {
                    newErrors.employeePosition = 'Cargo é obrigatório.';
                } else {
                    delete newErrors.employeePosition;
                }
                break;
            case 'employeeSalary':
                if (!value) {
                    newErrors.employeeSalary = 'Remuneração é obrigatória.';
                } else {
                    delete newErrors.employeeSalary;
                }
                break;
            case 'departmentId':
                if (!value) {
                    newErrors.departmentId = 'Departamento é obrigatório.';
                } else {
                    delete newErrors.departmentId;
                }
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        validate();

        if (Object.keys(errors).length === 0) {
            await onSubmit({
                name: employeeName,
                email: employeeEmail,
                position: employeePosition,
                salary: parseFloat(employeeSalary),
                transportAllowance: employeeTransport,
                department_id: departmentId,
            });

            setEmployeeName('');
            setEmployeeEmail('');
            setEmployeePosition('');
            setEmployeeSalary('');
            setEmployeeTransport(false);
            setDepartmentId('');
            setErrors({});
        }
    };

    const handleInputChange = (setter, name) => (event) => {
        setter(event.target.value);
        validate(name, event.target.value);
    };

    const handleCheckboxChange = (setter) => (event) => {
        setter(event.target.checked);
        validate('employeeTransport', event.target.checked);
    };

    const isFormValid =
        employeeName !== '' &&
        employeeEmail !== '' &&
        employeePosition !== '' &&
        employeeSalary !== '' &&
        departmentId !== '' &&
        Object.keys(errors).length === 0;

    return (
        <form onSubmit={handleSubmit}>
            <div className="input-block">
                <label htmlFor="employee_name">Nome completo</label>
                <input
                    type="text"
                    name="employee_name"
                    id="employee_name"
                    value={employeeName}
                    onChange={handleInputChange(
                        setEmployeeName,
                        'employeeName'
                    )}
                />
                {errors.employeeName && (
                    <span className="error">{errors.employeeName}</span>
                )}
            </div>

            <div className="input-block">
                <label htmlFor="employee_email">E-mail</label>
                <input
                    type="email"
                    name="employee_email"
                    id="employee_email"
                    value={employeeEmail}
                    onChange={handleInputChange(
                        setEmployeeEmail,
                        'employeeEmail'
                    )}
                />
                {errors.employeeEmail && (
                    <span className="error">{errors.employeeEmail}</span>
                )}
            </div>

            <div className="input-block">
                <label htmlFor="employee_position">Cargo</label>
                <input
                    type="text"
                    name="employee_position"
                    id="employee_position"
                    value={employeePosition}
                    onChange={handleInputChange(
                        setEmployeePosition,
                        'employeePosition'
                    )}
                />
                {errors.employeePosition && (
                    <span className="error">{errors.employeePosition}</span>
                )}
            </div>

            <div className="input-block">
                <label htmlFor="employee_salary">Remuneração (R$)</label>
                <input
                    type="number"
                    name="employee_salary"
                    id="employee_salary"
                    value={employeeSalary}
                    onChange={handleInputChange(
                        setEmployeeSalary,
                        'employeeSalary'
                    )}
                />
                {errors.employeeSalary && (
                    <span className="error">{errors.employeeSalary}</span>
                )}
            </div>

            <div className="input-block">
                <div className="input-label">
                    <label htmlFor="employee_transport">
                        Auxílio Transporte
                    </label>
                    <label className="switch">
                        <input
                            type="checkbox"
                            name="employee_transport"
                            id="employee_transport"
                            checked={employeeTransport}
                            onChange={handleCheckboxChange(
                                setEmployeeTransport
                            )}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>

            <div className="input-block">
                <label htmlFor="employee_department">Departamento</label>
                <select
                    name="employee_department"
                    id="employee_department"
                    value={departmentId}
                    onChange={handleInputChange(
                        setDepartmentId,
                        'departmentId'
                    )}
                >
                    <option value="">Selecione o Departamento</option>
                    {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                            {department.name}
                        </option>
                    ))}
                </select>
                {errors.departmentId && (
                    <span className="error">{errors.departmentId}</span>
                )}
            </div>

            <button disabled={!isFormValid} type="submit">
                SALVAR
            </button>
        </form>
    );
}
