import { Layout } from '../shared/layout';
import React from "react";
import { CustomerClient, CustomerListItem } from '../../api/shop_api';


function RenderCustomerListItemRows(customers: CustomerListItem[]){
    const rows = customers.map(Q => <tr key={Q.customerID}>
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
        const client = new CustomerClient('https://localhost:44324');
        const response = await client.getAll();
        
        this.setState({
            customers: response
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