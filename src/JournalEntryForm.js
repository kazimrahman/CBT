import React from 'react';
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
                "situation": event.target.situation.value,
                "rational_response": {"rr": event.target.rational_response.value, "value": 10}
            }
            event.target.situation.value = ""
            event.target.title.value = ""
            event.target.rational_response.value = ""
            event.preventDefault()
            console.log(this.state.user)
            
            axios.post(apiEndpoint + '/journalentries/' + this.state.user,  form_data)
                .then(res => {
                    console.log(res.data);
                }
            )
    
            this.fetchEntries()
        }
        
    }

    fetchEntries = () => {
        axios.get(apiEndpoint + '/journalentries/' + this.state.user)
            .then(res => {
                console.log(res.data)
                if(res.data.length > 0 && res.data.length != this.state.entries.length){
                    this.setState({entries: res.data})
                }
            }
        )
    }

    renderEntries = () => {
        return (
        <div>
            {
            Object.keys(this.state.entries).map((value,index)=>(
                <p>title is {this.state.entries[value].title} ; situation is {this.state.entries[value].situation} ; date logged is {this.state.entries[value].date_logged}</p>
            ))
            }
            </div>
        )
    }

    render(){
        return(
            <div>
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" name="title" placeholder="Title" /><br></br>
                        <input type="text" name="situation" placeholder="Situation" /><br></br>
                        <input type="text" name="rational_response" placeholder="Rational Response"/><br></br>
                        <input type="text" name="rr_strength" placeholder="How strongly do you believe this?" pattern="/^[0-9\b]+$/"/>
                        <div><input type = "submit" value = "Submit"/></div>
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