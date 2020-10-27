import React, { Component } from 'react'
import Week from "./Week";
import PastItem from "./PastItem";

class PastLists extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          items: [],
          input: "",
          weeks: [],
          selectedWeek: 0
        };
      }

    componentDidMount() {
        //change to fetch weeks
      fetch("/pastApi/weeks")
        .then(res => res.json())
        .then(json => {
          this.setState({weeks: json});
        })
    }
    viewWeek(id) {
      this.setState({selectedWeek: id});
      fetch(`/pastApi/weeks/${id}`)
        .then(res => res.json())
        .then(json => {
          console.log("json",json)
          this.setState({items: json});
        })
    }

    render() {
      const weeks = this.state.weeks.map(week => (
          <Week key={week.id} weekData={week} weekStart={week.start.split("T")[0]} viewWeek={(id)=>this.viewWeek(id)}></Week>
        ))
      const items = this.state.items.map(item => (
            <PastItem key={item.id} itemData={item}
            />
          ));

        return (
            <div>
              {!!this.state.items.length && items || weeks}      
            </div>
        )
    }
}

export default PastLists;
