import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import Swal, { SweetAlertResult } from "sweetalert2";
import { ProductClient, ProductListItem } from "../../api/shop_api";
import { Layout } from "../shared/layout";


const ProductDeleteButton: React.FunctionComponent<{
    productID: string,
    name?: string,
    onDeleted: () => void
}> = (props) => {

    const onClick = async () => {
        const confirm = await Swal.fire<SweetAlertResult>({
            title: 'Confirm delete?',
            text: `Delete product ${props.name}? This action cannot be undone`,
            icon: 'warning',
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'Delete' 
        });

        if (confirm.isConfirmed === false) {
            return;   
        }

        const client = new ProductClient('https://localhost:44324');
        await client.delete(props.productID);

        Swal.fire<SweetAlertResult>({
            toast: true,
            timerProgressBar: true,
            timer: 5000,
            showConfirmButton: false,
            position: 'top-right',
            icon: 'success',
            title: 'Successfully deleted product ' + props.name
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

const ProductEditButton: React.FunctionComponent<{
    productID: string
}> = (props) => {

    
    return (
        <Link href={`/product/edit/${props.productID}`}>
            <button className="btn btn-secondary">
                <FontAwesomeIcon icon={faEdit} />
            </button>
        </Link>
    );
}

const RenderProductList: React.FunctionComponent<{
    list: ProductListItem[],
    onDeleted: () => void
}> = (props) => {

    const rows = props.list.map(Q => (
        <tr key={Q.productID}>
            <td>{Q.productID}</td>
            <td>{Q.name}</td>
            <td>{Q.price}</td>
            <td>
                <ProductEditButton productID={Q.productID} />
                <ProductDeleteButton productID={Q.productID} name={Q.name} onDeleted={props.onDeleted} />
            </td>
        </tr>
    ));

    return <tbody>{rows}</tbody>;
}

class Product extends React.Component<{}, {
    productList: ProductListItem[]
}> {
    constructor(props) {
        super(props);
        this.state = {
            productList: []
        }
    }

    async componentDidMount() {
        await this.getProductList();
    }

    async getProductList() {
        const client = new ProductClient('https://localhost:44324');
        const response = await client.getAll();
        this.setState({
            productList: response
        })
    }

    onProductListChanged = async () => {
        await this.getProductList();
    }

    render() {
        return (
            <div>
                <h1>Product</h1>
                <Link href="/product/create">
                    <button className="btn btn-dark" type="button">
                        <FontAwesomeIcon icon={faPlus} />
                        <span className="ms-2">
                            Manage Products
                        </span>
                    </button>
                </Link>
    
                <table className="my-4 table table-hover table-striped table-md">
                    <thead className="bg-dark text-light">
                        <tr>
                            <th>Product ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th></th>
                        </tr>
                    </thead>
                    <RenderProductList list={this.state.productList} onDeleted={this.onProductListChanged}/>
                </table>
            </div>
        );
    }
}

export default function ProductIndexPage() {
    return (
        <Layout title="Products">
            <Product></Product>
        </Layout>
    );
}