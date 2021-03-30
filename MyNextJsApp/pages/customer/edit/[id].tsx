import { Layout } from "../../shared/layout";
import React from 'react';
import { CustomerClient } from "../../../api/shop_api";
import Swal from "sweetalert2";
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faChevronUp, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";


/**
 * How this edit page works:
 * 1. Access this edit page with the supplied URL route parameter.
 * 2. Since you provides getServerSideProps, Next.js will determine that this page requires a blocking data requirements, so you can obtain the URL route.
 * 3. Render this page's included components (from EditCustomerPage -> Layout -> EditCustomer -> etc....).
 */


class EditCustomer extends React.Component<{
    customerID: string | string[] | undefined
}, {
    form: {
        name: string,
        email: string
    },
    errors: {
        name: string,
        email:string
    },
    dirty: {
        name: boolean,
        email: boolean
    },
    busy: boolean
}> {

    customerID: string;
    prevName: string

    constructor(props) {
        super(props);
        this.customerID = props.customerID;
        this.prevName = '';

        this.state = {
            form: {
                name: '',
                email: ''
            },
            errors: {
                name: '',
                email: ''
            },
            dirty: {
                name: false,
                email: false
            },
            busy: false
        };
    }

    async componentDidMount() {        
        const client = new CustomerClient('https://localhost:44324');

        if (this.customerID === undefined) {
            this.customerID = 'wkwkkwkw';
        }

        const user = await client.get(this.customerID);
        this.prevName = user.name? user.name : '';

        const form = this.state.form;
        form.name = user.name ? user.name : '';
        form.email = user.email ? user.email : '';

        this.setState({
            form: form
        });
    }

    onNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const form = this.state.form;
        form.name = e.target.value;

        const dirty = this.state.dirty;
        dirty.name = true;

        this.setState({
            form: form,
            dirty: dirty
        });

        this.validate();
    }

    onEmailChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const form = this.state.form;
        form.email = e.target.value;

        const dirty = this.state.dirty;
        dirty.email = true;

        this.setState({
            form: form,
            dirty: dirty
        });

        this.validate();
    }

    async validate() {
        const errors = {
            name: '',
            email: ''
        }

        if (!this.state.form.name) {
            errors.name = 'Name is required';
        }
        
        if (!this.state.form.email) {
            errors.email = 'Email is required';
        } else {
            const index = this.state.form.email.indexOf('@');
            if (index === -1) {
                errors.email = 'Email field constains non valid email';
            }
        }

        await new Promise((ok, reject) => {
            this.setState({
                errors: errors
            });
        });
    }

    hasErrorClassName(hasError: string | boolean, isDirty: boolean) {
        if (isDirty) {
            if (hasError) {
                return 'is-invalid';
            } else {
                return 'is-valid';
            }
        } else {
            return '';
        }
    }

    onSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        this.validate();

        let hasError = false;
        for (let key in this.state.errors) {
            if (this.state.errors[key]) {
                hasError = true;
            }
        }

        const dirty = this.state.dirty;

        for (let key in this.state.dirty) {
            dirty[key] = true;
        }

        this.setState({
            dirty: dirty
        });

        const form = this.state.form;

        if (!form.name || !form.email) {
            hasError = true;
        }

        if (hasError) {
            return;
        }


        this.setState({
            busy: true
        });
        
        try {
            const client = new CustomerClient('https://localhost:44324');
            await client.put(this.customerID, {
                name: form.name,
                email: form.email
            });
        } catch (error) {
            Swal.fire({
                title: 'Submit failed',
                text: 'An error has occured. Please try again or contact administrator',
                icon: 'error'
            });

            return;
        } finally {
            this.setState({
                busy: false
            });
        }
        

        this.setState({
            errors: {
                name: '',
                email: ''
            },
            dirty: {
                name: false,
                email: false
            }
        });

        Swal.fire({
            title: 'Success!',
            text: 'Successfully updated user!',
            icon: 'success'
        });
    }

    getSubmitButtonIcon = () => {
        if (this.state.busy) {
            return <FontAwesomeIcon icon={faSpinner} pulse={true}/>;
        } else {
            return <FontAwesomeIcon icon={faChevronUp} />;
        }
    }

    render() {
        return (
            <div>
                <Link href="/customer">
                    <button className="btn btn-link" type="button">
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <span className="ms-2">
                            Back
                        </span>
                    </button>
                </Link>
                <h1>Edit customer {this.prevName}</h1>

                <form onSubmit={this.onSubmit} >
                    <fieldset disabled={this.state.busy}>
                        <div className="mb-3">
                            <label htmlFor="name">Name</label>
                            <input type="text" value={this.state.form.name} onChange={this.onNameChanged} id="name" className={'form-control ' + this.hasErrorClassName(this.state.errors.name, this.state.dirty.name)}/>
                            { this.state.errors.name && 
                            <span className="text-danger small">{this.state.errors.name}</span> }
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email">Email</label>
                            <input type="email" value={this.state.form.email} onChange={this.onEmailChanged} id="email" className={'form-control ' + this.hasErrorClassName(this.state.errors.email, this.state.dirty.email)}/>
                            { this.state.errors.email && 
                            <span className="text-danger small">{this.state.errors.email}</span> }
                        </div>
                        <div className="mb-3">
                            <button className="btn btn-primary" type="submit">
                                <this.getSubmitButtonIcon />
                                <span className="ms-2">
                                    Update
                                </span>
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        );
    }
}


/**
 * Function component for edit customer page.
 * @param param0 
 * @returns 
 */

function EditCustomerPage () {
    // Use useRouter to obtain the URL parameters.
    // You can also use withRouter instead.
    // Reference: https://nextjs.org/docs/api-reference/next/router#userouter.
    const { id } = useRouter().query;

    // To obtain the URL route parameter name, the object name must have the same name as the .tsx file name of this page.
    // In this case, our .tsx file is named [id].tsx, so we must bind the router.query object with name 'id'.
    return (
        <Layout title="Edit Customer">
            <EditCustomer customerID={id}></EditCustomer>
        </Layout>
    ); 
}


// The getServerSideProps must be present in the page if we want to acquire the URL route parameter value on the initial page load due to Automatic Static Optimization.
// Reference: https://nextjs.org/docs/advanced-features/automatic-static-optimization.
/**
 * If you export an async function called getServerSideProps from a page, Next.js will pre-render this page on each request using the data returned by getServerSideProps.
 * Reference: https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering.
 * @param context 
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: {
        }
    };
}

export default EditCustomerPage;