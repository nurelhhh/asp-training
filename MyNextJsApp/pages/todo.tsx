import React from 'react';
import Layout from "../shared/layout";
import Link from 'next/link';

interface TodoListItem {
    name: string,
    checked: boolean
}

interface TodoState {
    textInput: string,
    todoList: TodoListItem[]
}

const TodoItem: React.FunctionComponent<{
    item: TodoListItem,
    onRemoveButtonClick?: (item: TodoListItem) => void
}> = (props) => {
    const onClick = () => {
        if (props.onRemoveButtonClick) {
            props.onRemoveButtonClick(props.item);
        }
    };

    return (
        <div className="m-2">
            <span className="mx-2">{props.item.name}</span>
            <button className="btn btn-danger" onClick={onClick} type="button">Remove</button>
        </div>
    );
};


const TodoList: React.FunctionComponent<{
    list: TodoListItem[],
    onChange?: (list: TodoListItem[]) => void
}> = (props) => {
    
    const onRemoveButtonClick = (item: TodoListItem) => {
        const index = props.list.findIndex(Q => Q === item);
        props.list.splice(index, 1);
        
        if (props.onChange) {
            props.onChange(props.list);
        }
    }

    const todos = props.list.map(Q => <TodoItem item={Q} onRemoveButtonClick={onRemoveButtonClick}/>);
    return (
        <div>{todos}</div>
    );
};

class Todo extends React.Component<{}, TodoState> {
    constructor(props) {
        super(props);
        this.state = {
            textInput: '',
            todoList: []
        };
    }
    onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            textInput: e.target.value
        });
    };

    addToList = () => {
        const updatedList = this.state.todoList;
        updatedList.push({
            name: this.state.textInput,
            checked: false
        });

        this.setState({
            textInput: '',
            todoList: updatedList
        });
    };

    onListChanged = (newList: TodoListItem[]) => {
        this.setState({
            todoList: newList
        });
    };

    render() {
        return (
            <div>
                <div>
                    <input value={this.state.textInput} onChange={this.onTextChange}/>
                    <button className="btn btn-primary" onClick={this.addToList} type="button">Add</button>
                    <h2>{this.state.textInput}</h2>
                </div>
                <TodoList onChange={this.onListChanged} list={this.state.todoList} />
            </div>
        );
    }
}


export default function TodoPage() {
    return (
        <Layout title="Todo">
            <Todo />
            <Link href="/">
                <a>Go to Home</a>
            </Link>
        </Layout>
    );
}