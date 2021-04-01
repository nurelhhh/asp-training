import { faChevronUp, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Swal from 'sweetalert2';
import Joi, { string } from 'joi';


interface ProductFormValues {
    name: string;
    price: string;
}

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
    successMsg: string,
    successBtn: string
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
                name: this.data.values ? this.data.values.name : '',
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
        const schema: {
            [key in keyof ProductFormValues]?: Joi.SchemaLike
        } = {
            name: '',
            price: ''
        };

        schema.name = Joi
            .string()
            .empty()
            .min(1)
            .max(255)
            .messages({
                'string.empty': 'Nama tidak boleh kosong',
                'string.min': 'Nama minimal harus 1 karakter',
                'string.max': 'Nama maksimal harus 255 karakter',
            });
        schema.price = Joi
            .number()
            .integer()
            .min(0)
            .max(10_000_000_000)
            .messages({
                'number.base': 'Harga tidak boleh kosong',
                'number.min': 'Harga minimal adalah Rp 0',
                'number.max': 'Harga maksimal adalah Rp 10.000.000.000'
            });

        const validation = Joi
            .object(schema);

        const validationResult = validation.validate(this.state.form, {
            abortEarly: false
        });

        const err = validationResult.error;

        console.log(typeof (err));
        console.log(err?.details);

        if (!err) {
            return undefined;
        }

        const errors = {
            name: '',
            price: ''
        };

        for (const detail of err.details) {
            if (detail.path.toString() in errors) {
                errors[detail.path.toString()] = detail.message;
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
            return <FontAwesomeIcon icon={faSpinner} pulse={true} />;
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
                        <input type="text" value={this.state.form.name} onChange={this.onNameChanged} id="name" className={'form-control ' + this.hasErrorClassName(this.state.errors.name, this.state.dirty.name)} />
                        {this.state.errors.name &&
                            <span className="text-danger small">{this.state.errors.name}</span>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="price">Price</label>
                        <input type="number" value={this.state.form.price} onChange={this.onPriceChanged} id="price" className={'form-control ' + this.hasErrorClassName(this.state.errors.price, this.state.dirty.price)} />
                        {this.state.errors.price &&
                            <span className="text-danger small">{this.state.errors.price}</span>}
                    </div>
                    <div className="mb-3">
                        <button className="btn btn-primary" type="submit">
                            <this.getSubmitButtonIcon />
                            <span className="ms-2">
                                {this.props.successBtn}
                            </span>
                        </button>
                    </div>
                </fieldset>
            </form>
        );
    }
}