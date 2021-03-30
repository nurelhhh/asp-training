import { Layout } from "../shared/layout";
import React from 'react';
import { ProductClient } from "../../api/shop_api";
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ProductForm } from "../../forms/ProductCreateOrUpdateComponent";


class CreateProduct extends React.Component<{}, {
    name: string,
    price: string
}> {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            price: ''
        };
    }

    onSubmit = async () => {
        const client = new ProductClient('https://localhost:44324');
        await client.post({
            name: this.state.name,
            price: parseInt(this.state.price),
        });
    }

    render() {
        return (
            <div>
                <Link href="/product">
                    <button className="btn btn-link" type="button">
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <span className="ms-2">
                            Back
                        </span>
                    </button>
                </Link>
                <h1>Create Product</h1>


                <ProductForm
                    setValues={{
                        name: (e?: React.ChangeEvent<HTMLInputElement>) => {
                            this.setState({
                                name: e ? e.target.value : ''
                            })
                        },
                        price: (e?: React.ChangeEvent<HTMLInputElement>) => {
                            this.setState({
                                price: e ? e.target.value : ''
                            })
                        }
                    }}
                    onSubmit={this.onSubmit}
                    clearForm={true}
                    successMsg={'Successfully created new product with name: '}
                    successBtn={'Create'} />

            </div>
        );
    }
}

export default function CreateProductPage() {
    return (
        <Layout title="Create Product">
            <CreateProduct />
        </Layout>
    );
}