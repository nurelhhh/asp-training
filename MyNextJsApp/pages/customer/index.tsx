import { Layout } from '../shared/layout';
import React from "react";
import { CustomerClient, CustomerListItem } from '../../api/shop_api';
import Link from 'next/link';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUserEdit, faTrash } from '@fortawesome/free-solid-svg-icons';


const EditCustomerButton: React.FunctionComponent<{
    customerID: string,
}> = (props) => {
    return (
        <Link href={`/customer/edit/[id]`} as={`/customer/edit/${props.customerID}`}>
             <button className="btn btn-secondary">
                <FontAwesomeIcon icon={faUserEdit}></FontAwesomeIcon>
            </button>
        </Link>
    );
};

const DeleteCustomerButton: React.FunctionComponent<{
    customerID: string,
    name?: string,
    onDeleted: () => void
}> = (props) => {

    const onClick = async () => {
        const confirm = await Swal.fire<SweetAlertResult>({
            title: 'Confirm delete?',
            text: `Delete customer ${props.name}? This action cannot be undone`,
            icon: 'warning',
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'Delete' 
        });

        if (confirm.isConfirmed === false) {
            return;   
        }

        const client = new CustomerClient('https://localhost:44324');
        await client.delete(props.customerID);

        Swal.fire<SweetAlertResult>({
            toast: true,
            timerProgressBar: true,
            timer: 5000,
            showConfirmButton: false,
            position: 'top-right',
            icon: 'success',
            title: 'Successfully deleted customer ' + props.name
        });

        if (props.onDeleted) {
            props.onDeleted();
        }
    };

    return (
            <button onClick={onClick} className="btn btn-danger mx-2" type="button">
                <FontAwesomeIcon icon={faTrash} />
            </button>
    );
};

function RenderCustomerListItemRows(
    customers: CustomerListItem[],
    onDeleted: () => void
){
    const rows = customers.map(Q => <tr key={Q.customerID}>
        <td>{Q.customerID}</td>
        <td>{Q.name}</td>
        <td>{Q.email}</td>
        <td>
            <EditCustomerButton customerID={Q.customerID} name={Q.name} email={Q.email} />
            <DeleteCustomerButton customerID={Q.customerID} name={Q.name} onDeleted={onDeleted}/>
        </td>
    </tr>);

    return <tbody>{rows}</tbody>;
}

class Customer extends React.Component<{}, {
    customers: CustomerListItem[]
}> {
    constructor(props) {
        super(props);
        this.state = {
            customers: []
        };
    }

    async componentDidMount() {
        const client = new CustomerClient('https://localhost:44324');
        const response = await client.getAll();
        
        this.setState({
            customers: response
        })
    }

    onReloadCustomerData = async () => {
        const client = new CustomerClient('https://localhost:44324');
        const response = await client.getAll();
        
        this.setState({
            customers: response
        })
    }

    render() {
        return (
            <div>
                <h1>Manage Customers</h1>
                <p>
                    <Link href="/customer/create">
                        <button className="btn btn-dark">
                            <FontAwesomeIcon icon={faPlus} />
                            <span className="ms-2">Manage Customer</span></button>
                    </Link>
                </p>
                <table className="table table-hover table-striped table-md">
                    <thead className="bg-dark text-light">
                        <tr>
                            <th>Customer ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th></th>
                        </tr>
                    </thead>
                    {RenderCustomerListItemRows(this.state.customers, this.onReloadCustomerData)}
                </table>
            </div>
        );
    }
}

export default function CustomerPage() {
    return (
        <Layout title="Customers">
            <Customer />
        </Layout>
    );
}