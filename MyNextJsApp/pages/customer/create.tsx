import { Layout } from "../shared/layout";
import React from 'react';
import { CustomerClient } from "../../api/shop_api";
import Swal from "sweetalert2";

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
    }
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
            }
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

        if (hasError) {
            return;
        }

        const form = this.state.form;
        const client = new CustomerClient('https://localhost:44324');
        await client.post({
            name: form.name,
            email: form.email,
        });

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

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit} >
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
                        <button className="btn btn-primary" type="submit">Create</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default function CreateCustomerPage() {
    return (
        <Layout title="Create Customer">
            <h1>Create</h1>
            <CreateCustomer />
        </Layout>
    );
}