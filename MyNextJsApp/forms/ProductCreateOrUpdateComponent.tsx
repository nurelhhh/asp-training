import { faChevronUp, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Swal from 'sweetalert2';


interface ProductFormProps {
    values?: {
        name: string,
        price: string
    },
    setValues: {
        name: (e?: React.ChangeEvent<HTMLInputElement>) => void,
        price: (e?: React.ChangeEvent<HTMLInputElement>) => void,
    },
    onSubmit: () => void,
    clearForm: boolean,
    successMsg: string
}

export class ProductForm extends React.Component<ProductFormProps, {
    form: {
        name: string,
        price: string,
    },
    errors: {
        name: string,
        price: string
    },
    dirty: {
        name: boolean,
        price: boolean
    },
    busy: boolean
}> {

    data: ProductFormProps;

    constructor(props) {
        super(props);

        this.data = props;
        this.state = {
            form: {
                name: this.data.values ? this.data.values.name : '' ,
                price: this.data.values ? this.data.values.price : '',
            },
            errors: {
                name: '',
                price: ''
            },
            dirty: {
                name: false,
                price: false
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

        this.data.setValues.name(e); 

        this.validate();
    }

    onPriceChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const form = this.state.form;
        form.price = e.target.value;

        const dirty = this.state.dirty;
        dirty.price = true;

        this.setState({
            form: form,
            dirty: dirty
        });

        this.data.setValues.price(e);

        this.validate();
    }

    async validate() {
        const errors = {
            name: '',
            price: ''
        }

        if (!this.state.form.name) {
            errors.name = 'Name is required';
        }
        
        if (!this.state.form.price) {
            errors.price = 'Price is required';
        } else {
            if (parseInt(this.state.form.price) < 0) {
                errors.price = 'Price is not valid';
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

    onSubmitForm = async (e: React.SyntheticEvent) => {
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

        if (!this.state.form.name || !this.state.form.price) {
            hasError = true;
        }

        if (hasError) {
            return;
        }


        this.setState({
            busy: true
        });
        
        try {
            this.data.onSubmit();

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

        Swal.fire({
            title: 'Success!',
            text: this.data.successMsg + this.state.form.name,
            icon: 'success'
        });


        if (this.data.clearForm) {
            this.setState({
                form: {
                    name: '',
                    price: ''
                },
                errors: {
                    name: '',
                    price: ''
                },
                dirty: {
                    name: false,
                    price: false
                },
                busy: false
            });

            this.data.setValues.name();
            this.data.setValues.price();
        }
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
            <form onSubmit={this.onSubmitForm} >
                <fieldset disabled={this.state.busy}>
                    <div className="mb-3">
                        <label htmlFor="name">Name</label>
                        <input type="text" value={this.state.form.name} onChange={this.onNameChanged} id="name" className={'form-control ' + this.hasErrorClassName(this.state.errors.name, this.state.dirty.name)}/>
                        { this.state.errors.name && 
                        <span className="text-danger small">{this.state.errors.name}</span> }
                    </div>
                    <div className="mb-3">
                        <label htmlFor="price">Price</label>
                        <input type="number" value={this.state.form.price} onChange={this.onPriceChanged} id="price" className={'form-control ' + this.hasErrorClassName(this.state.errors.price, this.state.dirty.price)}/>
                        { this.state.errors.price && 
                        <span className="text-danger small">{this.state.errors.price}</span> }
                    </div>
                    <div className="mb-3">
                        <button className="btn btn-primary" type="submit">
                            <this.getSubmitButtonIcon />
                            <span className="ms-2">
                                Create
                            </span>
                        </button>
                    </div>
                </fieldset>
            </form>
        );
    }
}