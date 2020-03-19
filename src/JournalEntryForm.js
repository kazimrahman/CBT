import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
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
                    console.log(res.data);
                    this.fetchEntries()
                }
            )
        }
        
    }

    fetchEntries = () => {
        axios.get(apiEndpoint + '/journalentries/' + this.state.user)
            .then(res => {
                console.log(res.data)
                if(res.data.length > 0 && res.data.length != this.state.entries.length){
                    this.setState({entries: res.data.reverse()}, () => this.forceUpdate())
                }
            }
        )
    }

    expand = () =>{
        console.log("poop")
    }

    renderEntries = () => {
        return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Title</th>
                    <th>Situation</th>
                    <th>Date Logged</th>
                    </tr>
                    
                </thead>
                <tbody>
                    {
                    Object.keys(this.state.entries).map((value,index)=>(
                        <tr onClick={this.expand}>
                            <td width="20%">{this.state.entries[value].title} </td>
                            <td width="50%">{this.state.entries[value].situation}</td>
                            <td width="30%">{this.state.entries[value].date_logged}</td>
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
                    Register a new Thought
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" name="title" placeholder="Title" /><br></br>
                        <input type="text" name="situation" placeholder="Situation" /><br></br>
                         <div><input type="submit" value="New Thought"/></div>
                    </form>
                </div>
                <div>
                    {this.state.entries.length > 0 && this.renderEntries()}
                </div>
            </div>
        )
    }
}

export default JournalEntryForm