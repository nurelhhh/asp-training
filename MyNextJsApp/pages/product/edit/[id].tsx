import { Layout } from "../../shared/layout";
import React from 'react';
import { ProductClient } from "../../../api/shop_api";
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { ProductForm } from "../../../forms/ProductCreateOrUpdateComponent";


class EditProduct extends React.Component<{
    productID: string | string[] | undefined
}, {
    name: string,
    price: string,
    renderFormOk: boolean
}> {
    productID: string;
    prevName: string
    prevPrice: string;

    constructor(props) {
        super(props);
        this.productID = props.productID;
        this.prevName = '';
        this.prevPrice = '';

        this.state = {
            name: '',
            price: '',
            renderFormOk: false
        };
    }

    async componentDidMount() {
        const client = new ProductClient('https://localhost:44324');

        const user = await client.get(this.productID);
        this.prevName = user.name ? user.name : '';
        this.prevPrice = user.price.toString();

        if (user) {
            this.setState({
                name: user.name ? user.name : '',
                price: user.price.toString()
            });

        }

        this.setState({
            renderFormOk: true
        });
    }

    onSubmit = async () => {
        const client = new ProductClient('https://localhost:44324');
        await client.put(this.productID, {
            name: this.state.name,
            price: parseInt(this.state.price)
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
                <h1>Edit product {this.prevName}</h1>

                {
                    this.state.renderFormOk &&

                    <ProductForm
                        values={{
                            name: this.prevName,
                            price: this.prevPrice
                        }}
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
                        clearForm={false}
                        successMsg={'Successfully updated product with name: '}
                        successBtn={'Update'} />
                }
            </div>
        );
    }
}


interface ProductEditParamProps {
    id: string
}

function EditproductPage(props: ProductEditParamProps) {
    return (
        <Layout title="Edit product">
            <EditProduct productID={props.id} />
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps<ProductEditParamProps> = async (context) => {
    let id = '';
    if (context.params) {
        const idRaw = context.params['id'];
        if (idRaw && typeof (idRaw) === 'string') {
            id = idRaw;
        }
    }
    return {
        props: {
            id: id
        }
    };
}

export default EditproductPage;