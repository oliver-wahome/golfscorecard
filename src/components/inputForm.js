import React, { Component } from 'react';
import localStorage from 'local-storage';
import {withRouter} from 'react-router';
import PlayerInput from './playerInput';
import ScoringSystem from './scoringSystem';
import InputEvent from './inputEvent';

class inputForm extends Component{

    constructor(props){
        super(props)
        this.state={
            cardOptions: localStorage.get("cardOptions") || "",
            playerNum: localStorage.get("playerNum") || 0,
            players: localStorage.get("players") || [],
            scoringSystem: localStorage.get("scoringSystem") || "",
            tournament: localStorage.get("tournament") || ""
        }
        this.setPlayers = this.setPlayers.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.clearData = this.clearData.bind(this);
    }

    componentDidMount(){
        fetch(this.props.url)
        .then(results => {
            //selecting one the scoringSystem radio buttons on component mount
            if(this.state.scoringSystem === "Medal"){
                document.getElementById("radio1").checked = true;
            }
            else if(this.state.scoringSystem === "StableFord"){
                document.getElementById("radio2").checked = true;
            }else;

            //selecting one of the cardOptions radio buttons on component mount
            if(this.state.cardOptions === "Generic"){
                document.getElementById("genericRadio").checked = true;
            }
            else if(this.state.cardOptions === "Machakos"){
                document.getElementById("machakosRadio").checked = true;
            }else;
        })
    }

    clearData(){
        localStorage.clear();
        window.location.reload();
    }

    setPlayers(x){
        this.setState({playerNum: x}, ()=>{
            localStorage.set("playerNum", x);
        });
    }

    handleSubmit(e){
        e.preventDefault();
        let pNum = this.state.playerNum;
        var eventName = e.target.eventName.value;
        var pList = [], lsList = [];
        
        if(localStorage.get("players") != null){
            lsList = localStorage.get("players");
        }

        //setting value for strokes and scores of players in localStorage
        if(pNum > 0){
            for(var i=1; i<pNum+1; i++){
                pList.push({id:i, name:e.target["playerName"+i].value, handicap:e.target["handicap"+i].value, 
                    strokes: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                    score: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]
                });
            }

            if(lsList.length > 0){
                if(pList.length === lsList.length){
                    pList = lsList;
                }
                else if(pList.length > lsList.length){
                    for(var x =0; x<lsList.length; x++){
                        pList[x] = lsList[x];
                    }
                }
                else if(pList.length < lsList.length){
                    for(var y=0; y<pList.length; y++){
                        pList[y] = lsList[y];
                    }
                }
            }
            
            this.setState({players: pList}, ()=>{
                localStorage.set("players", pList);
                console.log("pList: ", pList);
                console.log("lsList: ", lsList);
            });
        }

        //setting value for cardOptions in localStorage
        if(document.getElementById("genericRadio").checked){
            this.setState({cardOptions: "Generic"}, ()=>{
                localStorage.set("cardOptions", "Generic");
            });
        }
        else if(document.getElementById("machakosRadio").checked){
            this.setState({cardOptions: "Machakos"}, ()=>{
                localStorage.set("cardOptions", "Machakos");
            });            
        }else;

        //setting value for scoringSystem in localStorage
        if(e.target.radio1.checked){
            this.setState({scoringSystem: "Medal"}, ()=>{
                localStorage.set("scoringSystem", "Medal");
            });
        }
        else if(e.target.radio2.checked){
            this.setState({scoringSystem: "StableFord"}, ()=>{
                localStorage.set("scoringSystem", "StableFord");
            });
        }

        //setting value for tournament in localStorage
        this.setState({tournament: eventName}, () =>{
            localStorage.set("tournament", eventName);
            if(document.getElementById("machakosRadio").checked){
                this.props.history.push('/inputTable');
            }
            else if(document.getElementById("genericRadio").checked){
                this.props.history.push('/genericTable');
            }
            //console.log("State: ", this.state);
            if(this.props.onSubmit){
                this.props.onSubmit(this.state);
            }
        });
        
    }

    render(){

        return(
            //form to input user details
            <div className="container">
                <div className="p-3 text-center">
                    <h4 className="">
                        <strong>Scorecard Input Form</strong>
                    </h4>
                </div>

                <form className = "border border-dark rounded p-3" onSubmit={this.handleSubmit}>

                    {/*Card Type or Location section */}
                    <div className="row my-2 align-items-center">
                        <div className="col-sm-4">
                            <p><strong>Select Scoring System:</strong></p>
                        </div>
                        <div className="col-sm-8 btn-group" role="group" aria-label="radio toggle">
                            <input type="radio" className="btn-check" name="radio" id="genericRadio" autoComplete="off" required/>
                            <label className="btn btn-outline-dark" htmlFor="genericRadio">Generic Card</label>

                            <input type="radio" className="btn-check" name="radio" id="machakosRadio" autoComplete="off" required/>
                            <label className="btn btn-outline-dark" htmlFor="machakosRadio">Machakos Golf Club Card</label>
                        </div>
                    </div>

                    <div className="bg-dark my-3" style={{height: "2px"}}></div>

                    {/* Player Number input section */}
                    <div className="row my-2 align-items-center">
                        <label htmlFor="staticEmail" className="col-sm-4"><strong>Select the number of players :</strong></label>
                        {/* button group to select number of players on card*/}
                        <div className="col-sm-8 px-2">
                            <div className="btn-group" role="group" aria-label="playerNumGroup">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((e, i) => (
                                    <button key={i} className="btn btn-dark" type="button" onClick={()=>{this.setPlayers({e})}}>{e}</button>
                                ))}
                                {/* <button className="btn btn-dark" type="button" onClick={()=>{this.setPlayers(1)}}>1</button>
                                <button className="btn btn-dark" type="button" onClick={()=>{this.setPlayers(2)}}>2</button>
                                <button className="btn btn-dark" type="button" onClick={()=>{this.setPlayers(3)}}>3</button>
                                <button className="btn btn-dark" type="button" onClick={()=>{this.setPlayers(4)}}>4</button> */}
                            </div>
                        </div>
                    </div>
                    
                    {/* Player name and handicap input. 
                        The input labels should dynamically change depending on number input */}
                    {[...Array(this.state.playerNum)].map((e, i) => (
                        <PlayerInput key={i} num={i} players={this.state.players}/>
                    ))}
                    
                    <div className="bg-dark my-3" style={{height: "2px"}}></div>

                    {/* Scoring system selection radio button group */}
                    <ScoringSystem scoringSystem={this.state.scoringSystem}/>

                    <div className="bg-dark my-3" style={{height: "2px"}}></div>

                    {/* Input of event / tournament name */}
                    <InputEvent event={this.state.tournament} />


                    <button type="submit" className="btn btn-dark m-0 my-3">
                        Submit
                    </button>
                    <button onClick={this.clearData} type="button" className="float-end btn btn-outline-danger my-3">
                        Clear Data
                    </button>
                </form>
            </div>
        );
    }

}

export default withRouter(inputForm);