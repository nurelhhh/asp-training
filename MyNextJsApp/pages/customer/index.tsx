import { Layout } from '../shared/layout';
import axios from 'axios';
import React from "react";

interface CustomerListItem {
    customerID: string;
    name: string;
    email: string;
}

function RenderCustomerListItemRows(customers: CustomerListItem[]){
    const rows = customers.map(Q => <tr>
        <td>{Q.customerID}</td>
        <td>{Q.name}</td>
        <td>{Q.email}</td>
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
        const response = await axios.get<CustomerListItem[]>('https://localhost:44324/api/customer');
        this.setState({
            customers: response.data
        })
    }

    render() {
        return (
            <div>
                <table className="table table-hover table-striped table-sm">
                    <thead className="bg-dark text-light">
                        <tr>
                            <th>Customer ID</th>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    {RenderCustomerListItemRows(this.state.customers)}
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