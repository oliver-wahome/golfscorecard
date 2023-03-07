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
            cardOptions: localStorage.get("cardOptions") || {id:0, name:"", holeColumn:[], siColumn:[], parColumn:[]},
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

    //set value for cardOptions in localStorage and state
    setCard(cardDetails){
        this.setState({cardOptions: cardDetails}, ()=>{
            localStorage.set("cardOptions", cardDetails);
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
                    score: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
                    strokesBg: ["transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent",
                                "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent"]
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
        // if(document.getElementById("genericRadio").checked){
        //     this.setState({cardOptions: "Generic"}, ()=>{
        //         localStorage.set("cardOptions", "Generic");
        //     });
        // }
        // else if(document.getElementById("machakosRadio").checked){
        //     this.setState({cardOptions: "Machakos"}, ()=>{
        //         localStorage.set("cardOptions", "Machakos");
        //     });            
        // }else;

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
            if(this.state.cardOptions.name !== "Generic"){
                this.props.history.push('/inputTable');
            }
            else if(this.state.cardOptions.name === "Generic"){
                this.props.history.push('/genericTable');
            }
            
            if(this.props.onSubmit){
                this.props.onSubmit(this.state);
            }
        });
        
    }

    render(){

        let holeColumnArr = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "OUT",
                            "10", "11", "12", "13", "14", "15", "16", "17", "18", "IN", "OUT", "TOTAL"];

        let cardData = [
            {
                id: 1,
                name: "Generic",
                holeColumn: holeColumnArr
            },
            {
                id: 2,
                name: "Machakos Golf Club",
                holeColumn: holeColumnArr,
                siColumn: ["9", "17", "7", "5", "13", "3", "1", "11", "15", "",
                            "12", "18", "8", "6", "14", "4", "2", "10", "16", "", "", ""],
                parColumn: ["5", "3", "4", "4", "4", "4", "4", "3", "5", "36",
                            "5", "3", "4", "4", "4", "4", "4", "3", "5", "36", "36", "72"],
            }, 
            {
                id: 3,
                name: "Limuru Country Club",
                holeColumn: holeColumnArr,
                siColumn: ["3", "11", "9", "1", "17", "7", "13", "5", "15", "",
                            "4", "16", "8", "2", "18", "6", "14", "10", "12", "", "", ""],
                parColumn: ["4", "4", "5", "5", "3", "4", "3", "4", "4", "36",
                            "4", "4", "4", "4", "3", "5", "3", "4", "5", "36", "36", "72"],
            },
            {
                id: 4,
                name: "Railways Golf Club",
                holeColumn: holeColumnArr,
                siColumn: ["3", "11", "5", "9", "17", "13", "1", "7", "15", "",
                            "4", "10", "2", "16", "18", "6", "14", "8", "12", "", "", ""],
                parColumn: ["5", "4", "4", "3", "4", "3", "4", "4", "5", "36",
                            "5", "4", "4", "3", "4", "3", "5", "3", "5", "36", "36", "72"],
            },
            {
                id: 5,
                name: "Ruiru Sports Club",
                holeColumn: holeColumnArr,
                siColumn: ["6", "16", "14", "2", "12", "18", "4", "8", "10", "",
                            "7", "13", "3", "17", "1", "15", "5", "11", "9", "", "", ""],
                parColumn: ["4", "5", "3", "4", "4", "3", "4", "4", "5", "36",
                            "5", "3", "4", "4", "5", "3", "5", "4", "4", "37", "36", "73"],
            },
            {
                id: 6,
                name: "Thika Sports Club",
                holeColumn: holeColumnArr,
                siColumn: ["6", "18", "8", "16", "2", "4", "12", "10", "14", "",
                            "3", "15", "7", "13", "9", "11", "17", "1", "5", "", "", ""],
                parColumn: ["5", "4", "4", "3", "4", "3", "4", "4", "5", "36",
                            "5", "3", "4", "4", "4", "5", "3", "4", "4", "36", "36", "72"],
            }
        ]

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
                    <div className="col-4">
                            <div className="dropdown">
                                <button type="button" className="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                    Select Card
                                </button>
                                <ul className="dropdown-menu">
                                    {[...cardData].map((e, i) => (
                                        <li key={i}><button type="button" className="dropdown-item" style={{cursor: "pointer"}} onClick={()=>{this.setCard(e)}}>{e.name}</button></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="col-8 text-center">
                            {this.state.cardOptions.name}
                        </div>
                    </div>

                    <div className="bg-dark my-3" style={{height: "2px"}}></div>

                    {/* Player Number input section */}
                    <div className="row my-2 align-items-center">
                        <div className="col-sm-4">
                            <div className="dropdown">
                                <button type="button" className="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                    Select the number of players
                                </button>
                                <ul className="dropdown-menu">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((e, i) => (
                                        <li key={i} num={i}><button type="button" className="dropdown-item text-center" style={{cursor: "pointer"}} key={i} num={i} onClick={()=>{this.setPlayers(e)}}>{e}</button></li>
                                    ))}
                                </ul>
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