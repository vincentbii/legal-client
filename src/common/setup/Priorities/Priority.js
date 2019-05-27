import React, { Component } from "react";

class Priority extends Component {
    
    render() {
        const active = this.props.priority == true ? 'Active' : 'Inactive';
        return (
            <div className="poll-content">
                <div className="poll-header">
                    {this.props.priority.name}
                    {active}
                </div>
            </div>
        )
    }
}

export default Priority;