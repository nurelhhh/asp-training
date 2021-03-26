import { Layout } from "../shared/layout";
import React from 'react';
import { CustomerClient } from "../../api/shop_api";
import Swal from "sweetalert2";
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faChevronUp, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

class CreateCustomer extends React.Component<{}, {
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

    constructor(props) {
        super(props);
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
            await client.post({
                name: form.name,
                email: form.email,
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
            }
        });

        Swal.fire({
            title: 'Success!',
            text: 'Successfully created new custome with name: ' + form.name,
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
                    <button className="btn btn-secondary" type="button">
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <span className="ml-2">
                            Back
                        </span>
                    </button>
                </Link>
                <h1>Create</h1>

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
                                <span className="ml-2">
                                    Create
                                </span>
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        );
    }
}

export default function CreateCustomerPage() {
    return (
        <Layout title="Create Customer">
            <CreateCustomer />
        </Layout>
    );
}