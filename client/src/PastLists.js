import React, { Component } from 'react'
import Week from "./Week";
import Item from "./Item";

class PastLists extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          input: "",
          weeks: [],
          items:[]
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
      fetch(`/pastApi/weeks/:${id}`)
        .then(res => res.json())
        .then(json => {
          console.log("json",json)
          this.setState({items: json});
        })
    }

    render() {
      console.log(this.state.weeks.map(week => week.start.split("T")[0]))
      const weeks = this.state.weeks.map(week => 
        (
          <Week key={week.id} weekData={week} weekStart={week.start.split("T")[0]} viewWeek={()=>this.viewWeek()}></Week>
        ))
        const items = this.state.items.map(item => 
          (
            <Item
              key={item.id}
              itemData={item}
            />
          ));

        return (
            <div>
              {!!items.length&&items||weeks}      
            </div>
        )
    }
}

export default PastLists;
