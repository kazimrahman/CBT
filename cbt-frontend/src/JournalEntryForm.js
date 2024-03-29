import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import Delete from './Delete'
import axios from 'axios'
var apiEndpoint = 'http://localhost:5000'

class JournalEntryForm extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            user: props.user.email,
            rationalResponse: {},
            situation: "",
            title: "",
            entries: []
        }
    }

    componentDidMount = () => {
        this.fetchEntries()
    }

    handleChildChange = () => {
        this.fetchEntries()
        console.log(this.state.entries)
    }


    handleSubmit = (event) => {
        if(event.target.situation.value.length === 0 && event.target.title.value.length === 0){
            console.log("we empty")
            event.preventDefault()
        }else{
            var form_data = {
                "title" : event.target.title.value,
                "situation": event.target.situation.value
                //"rational_response": {"rr": event.target.rational_response.value, "value": 10}
            }
            
            event.target.situation.value = ""
            event.target.title.value = ""
            //event.target.rational_response.value = ""
            event.preventDefault()
            console.log(this.state.user)
            
            axios.post(apiEndpoint + '/journalentries/' + this.state.user,  form_data)
                .then(res => {
                    this.fetchEntries()
                }
            )
        }
        
    }

    fetchEntries = () => {
        axios.get(apiEndpoint + '/journalentries/' + this.state.user)
            .then(res => {
                if(res.data.length != this.state.entries.length){
                    this.setState({entries: res.data.reverse()}, () => this.forceUpdate())
                    console.log(this.state.entries)
                }
            }
        )
    }

    expand = () =>{
        console.log("poop")
    }

    prettyDate = (date) => {
        var new_date = new Date(Date.parse(date))

        //return month + " " + day + ", " + year
        new_date = new_date.toString()
        return new_date.substring(0, new_date.indexOf("GMT"))
        //return new_date
    }

    deleteEntry = (id, email) => {
        console.log("delete")
        //console.log(this.state.entry)
        //console.log(this.state.entry._id)
        
        axios.delete(apiEndpoint + '/journalentries/' + email + '/delete/' + id)
            .then(res => {
                console.log(res)
                
                this.fetchEntries()
            }
        )
        //this.setState(reset, "true")

    }

    renderEntries = () => {
        return (
        <div>
            <Table striped bordered hover align="right">
                <thead>
                    <tr>
                    <th>Title</th>
                    <th>Situation</th>
                    <th>Date Logged</th>
                    <th>Delete</th>
                    </tr>
                    
                </thead>
                <tbody>
                    {
                    Object.keys(this.state.entries).map((value,index)=>(
                        <tr>
                            <td width="25%" style={{cursor:"pointer"}} onClick={() => { this.expand() }}>{this.state.entries[value].title}</td>
                            <td width="50%" style={{cursor:"pointer"}} onClick={() => { this.expand() }}>{this.state.entries[value].situation}</td>
                            <td width="20%" style={{cursor:"pointer"}} onClick={() => { this.expand() }}>{this.prettyDate(this.state.entries[value].date_logged)}</td>
                            <td width="5%"><Button variant="outline-danger" onClick={() => { this.deleteEntry(this.state.entries[value]._id, this.state.entries[value].email) }}>X</Button></td>
                        </tr>
                    ))
                    }
                </tbody>
            </Table>
            </div>
        )
    }

    render(){
        return(
            <div>
                <div>
                    <Form onSubmit={this.handleSubmit}>
                        <div>
                        <Form.Control type="text" name = "title" placeholder="Title"/>
                        <Form.Control type="text" name="situation" placeholder="Situation" />
                        </div>
                        <Button variant="outline-info" type="submit">Add a new Thought Journal</Button>
                    </Form>
                </div>
                <br/>
                <div>
                    {this.state.entries.length > 0 && this.renderEntries()}
                </div>
            </div>
        )
    }
}

export default JournalEntryForm