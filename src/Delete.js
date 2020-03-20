import React from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios'

var apiEndpoint = 'http://localhost:5000'
class Delete extends React.Component {
    constructor(props){
        super(props)
        console.log(props)
        this.state = {
            entry: props.entry
        }
    }

    deleteEntry = () => {
        console.log("delete")
        console.log(this.state.entry)
        console.log(this.state.entry._id)
        
        axios.delete(apiEndpoint + '/journalentries/' + this.state.entry.email + '/delete/' + this.state.entry._id)
            .then(res => {
                console.log(res)
                this.props.callback()
            }
        )
    }

    render(){
        return(
            <Button variant="outline-danger" onClick={() => { this.deleteEntry() }}>X</Button>
        )
    }
}

export default Delete