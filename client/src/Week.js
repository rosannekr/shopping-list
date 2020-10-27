import React, { Component } from 'react'

export default class Week extends Component {

view () {
    let weekId = this.props.weekData.id
    return this.props.viewWeek(weekId)
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
