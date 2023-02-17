import React, {Component} from 'react';
import localStorage from 'local-storage';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import GenericTable from './components/GenericTable';
import InputForm from './components/inputForm';
import InputTable from './components/InputTable';

class App extends Component{
  constructor(props){
    super(props);
    this.state={
      cardOptions: localStorage.get("cardOptions") || {id:0, name:"", holeColumn:[], siColumn:[], parColumn:[]},
      playerNum: localStorage.get("playerNum") || 0,
      players: localStorage.get("players") || [],
      scoringSystem: localStorage.get("scoringSystem") || "",
      tournament: localStorage.get("tournament") || ""
    }
  }

  render(){

    const eventhandler = (data) =>{
      this.setState({cardOptions: data.cardOptions, playerNum: data.playerNum, players: data.players, scoringSystem: data.scoringSystem, tournament: data.tournament});
    }


    return(
      <BrowserRouter>
        <Switch>
          {/*Route to input form*/}
          <Route exact path='/'>
            <InputForm onSubmit={eventhandler}/>
          </Route>

          {/*Route to Machakos Golf Club Card*/}
          <Route path='/inputTable'>
            <InputTable cardOptions={this.state.cardOptions} playerNum={this.state.playerNum} players={this.state.players} scoringSystem={this.state.scoringSystem} tournament={this.state.tournament} />
          </Route>

          {/*Route to Generic Card*/}
          <Route path='/genericTable'>
            <GenericTable cardOptions={this.state.cardOptions} playerNum={this.state.playerNum} players={this.state.players} tournament={this.state.tournament} />
          </Route>

        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
