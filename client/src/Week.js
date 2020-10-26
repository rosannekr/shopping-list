import React, { Component } from 'react'

export default class Week extends Component {

view () {
return this.props.viewWeek(this.props.weekData.id)
}

    render() {
        let start = this.props.weekStart
        return (
            <div>
                <input value={start}></input>
                <button onClick={() => this.view()}>view</button>
            </div>
        )
    }
}
