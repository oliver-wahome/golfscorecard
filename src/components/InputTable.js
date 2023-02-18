import {exportComponentAsPNG} from 'react-component-export-image';
import React, {useRef} from 'react';
import localStorage from 'local-storage';

const CardSection = React.forwardRef((props, ref) =>(
    <div id="scorecard" ref={ref}>
        <div className="text-center">
            <h5>
                <strong>{ props.cardOptions.name.split(" ")[0] } {props.event+" "+props.scoringSystem} Format</strong>
            </h5>

            <p className="m-2">{props.eventDate}</p>

            <div className="d-md-flex justify-content-center">
                <div className="col-md-4 p-0 m-0 d-flex justify-content-between">
                    {/* <h4 style={{padding: "7px", margin: "10px 5px", fontWeight: "700"}}>Colour Key : </h4> */}
                    <p className="col-3" style={{backgroundColor: "#ff4d4d", padding: "5px", margin: 0}}>&lt;= Eagle</p>
                    <p className="col-2" style={{backgroundColor: "#ff9900", padding: "5px", margin: 0}}>Birdie</p>
                    <p className="col-2" style={{backgroundColor: "yellow", padding: "5px", margin: 0}}>Par</p>
                    <p className="col-2" style={{backgroundColor: "#85cdfd", padding: "5px", margin: 0}}>Bogey</p>
                    <p className="col-3" style={{backgroundColor: "#d6d6c2", padding: "5px", margin: 0}}>&gt;= D.Bogey</p>
                </div>
            </div>
        </div>
        <div id="tableID" className="table-responsive">
            <table className="table">
                <thead className="table-dark text-center">
                    <tr>
                        <th scope="col">Hole No.</th>
                        <th scope="col">Stroke Index</th> 
                        <th scope="col">Par</th>
                        {[...Array(props.playerNum)].map((e, i) => (
                            <th scope="col" colSpan="2" key={i}>{props.players[i].name+" ("+props.players[i].handicap+")"}</th>
                        ))}
                    </tr>
                    <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        {[...Array(props.playerNum*2)].map((e, i) => (
                                <th scope="col" key={i}>{rowHeader(i)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[...Array(22)].map((e, i) => (
                        <tr key={i} className={"text-center"} style={{backgroundColor: rowColour(i)}}>
                            <th scope="row">{props.cardOptions.holeColumn[i]}</th>
                            <td className="text-center">{props.cardOptions.siColumn[i]}</td>
                            <td>{props.cardOptions.parColumn[i]}</td>
                            {[...Array(props.playerNum*2)].map((e, j) => (
                                rowOutput(i, j, props.players, props.cardOptions.siColumn[i], props.cardOptions.parColumn[i], props.scoringSystem)
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
));

function getInputCellStyle(playerIndex, strokeIndex){
    return {
        backgroundColor: localStorage.get("players")[playerIndex].strokesBg[strokeIndex],
        width: "40px", 
        border:"none",
        borderBottom:"3px solid black", 
        textAlign:"center"
    }
}

// let inputCellStyle = {
//     width: "40px", 
//     border:"none", 
//     borderBottom:"3px solid black", 
//     textAlign:"center"
// }

function changeStrokesBg(parScore, playerScore, inputCellId, players, playerIndex, strokeIndex){
    //console.log(inputCellId);
    var scoreCalc = playerScore - parScore;

    if(scoreCalc <= -2 && scoreCalc > (parScore*-1)){
        //console.log("red eagle");
        document.getElementById(inputCellId).style.backgroundColor = "#ff4d4d";
        players[playerIndex].strokesBg[strokeIndex] = "#ff4d4d";
        localStorage.set("players", players);
    }
    else if(scoreCalc === -1){
        //console.log("orange birdie");
        document.getElementById(inputCellId).style.backgroundColor = "#ff9900";
        players[playerIndex].strokesBg[strokeIndex] = "#ff9900";
        localStorage.set("players", players);
    }
    else if(scoreCalc === 0){
        //console.log("yellow par ");
        document.getElementById(inputCellId).style.backgroundColor = "yellow";
        players[playerIndex].strokesBg[strokeIndex] = "yellow";
        localStorage.set("players", players);
    }
    else if(scoreCalc === 1){
        //console.log("blue bogey");
        document.getElementById(inputCellId).style.backgroundColor = "#85cdfd";
        players[playerIndex].strokesBg[strokeIndex] = "#85cdfd";
        localStorage.set("players", players);
    }
    else if(scoreCalc >= 2){
        //console.log("grey double bogey or higher");
        document.getElementById(inputCellId).style.backgroundColor = "#d6d6c2";
        players[playerIndex].strokesBg[strokeIndex] = "#d6d6c2";
        localStorage.set("players", players);
    }
    else {
        //console.log("transparent");
        document.getElementById(inputCellId).style.backgroundColor = "transparent";
        players[playerIndex].strokesBg[strokeIndex] = "transparent";
        localStorage.set("players", players);
    }
}

//the function is run when strokes input or removed from card
function handleStrokesChange(i, j, players){
    var currCardOptions = localStorage.get("cardOptions");
    var parScore = currCardOptions.parColumn;
    var j_index = Math.trunc(Math.floor(j/2));
    var index=i, total=0, firstNine=0, secondNine=0;
    /*if(index>9){
        index-=1;
    }*/
    players[j_index].strokes[index] = document.getElementById(players[j_index].name+i).value;

    for(var a=0; a<players[j_index].strokes.length; a++){
        if(!isNaN(parseInt(players[j_index].strokes[a]))){
            if(a<9){
                firstNine+=parseInt(players[j_index].strokes[a]);
            }
            else if(a > 9 && a < 19){
                secondNine+=parseInt(players[j_index].strokes[a]);
            }
            total = firstNine + secondNine;
        }
    }

    players[j_index].strokes[9] = firstNine;
    players[j_index].strokes[19] = secondNine;
    players[j_index].strokes[20] = firstNine;
    players[j_index].strokes[21] = total;

    localStorage.set("players", players);
    //console.log("players in strokes change :", players);
    var inputCellId = players[j_index].name+index;

    changeStrokesBg(parScore[index], players[j_index].strokes[index], inputCellId, players, j_index, index);

    document.getElementById(players[j_index].name+21).innerHTML = total;
    document.getElementById(players[j_index].name+9).innerHTML = firstNine;
    document.getElementById(players[j_index].name+20).innerHTML = firstNine;
    document.getElementById(players[j_index].name+19).innerHTML = secondNine;
}

function handleScoreChange(i, j, players, strokeIndex, par, scoreSystem){
    var j_index = Math.trunc(Math.floor(j/2));
    var index=i, totalScore=0, firstNineScore=0, secondNineScore=0;
    var strokes = document.getElementById(players[j_index].name+i).value;
    var scoreAdd = 0, scoreExtra = 0, parScore=0, actualScore=0;

    /*if(index>9){
        index-=1;
    }*/

    if(parseInt(strokeIndex) <= parseInt(players[j_index].handicap)%18){
        scoreExtra+=1;
    }
    
    scoreAdd = Math.trunc(parseInt(players[j_index].handicap) / 18) + scoreExtra;
    parScore = 2+scoreAdd;

    if(scoreSystem === "StableFord"){
        actualScore = (parseInt(par)-strokes)+parScore;
    }
    else{
        actualScore = strokes-scoreAdd;
    }
    

    if(actualScore < 0 || strokes==="" || strokes ===0){
        actualScore = 0;
    }

    players[j_index].score[index] = actualScore;


    
    for(var a=0; a<players[j_index].score.length; a++){
        if(!isNaN(parseInt(players[j_index].score[a]))){
            if(a<9){
                firstNineScore+=parseInt(players[j_index].score[a]);
            }
            else if(a===9 || a===20){
                players[j_index].score[a] = firstNineScore;
            }
            else if(a === 19){
                players[j_index].score[a] = secondNineScore;
            }
            else if(a===21){
                players[j_index].score[a] = totalScore;
            }
            else{
                secondNineScore+=parseInt(players[j_index].score[a]);
            }

            totalScore = secondNineScore + firstNineScore;
        }
    }

    localStorage.set("players", players);
    //console.log("players in score change :", players);
    
    document.getElementById(players[j_index].name+"Score"+i).innerHTML = actualScore;
    document.getElementById(players[j_index].name+"Score"+21).innerHTML = totalScore;
    document.getElementById(players[j_index].name+"Score"+9).innerHTML = firstNineScore;
    document.getElementById(players[j_index].name+"Score"+20).innerHTML = firstNineScore;
    document.getElementById(players[j_index].name+"Score"+19).innerHTML = secondNineScore;
}

//the sets colours for certain rows
function rowColour(x){
    if(x===9 || x===19 || x===20){
        return "#b3ffcc";
    }
    else if(x===21){
        return "#b3e6ff";
    }
    else{
        return "";
    }
}

//the function is used to select the right sub-header for each player
function rowHeader(i){
    if(i===0 || i%2===0){
        return "Strokes";
    }
    else{
        return "Score";
    }
}

//the function outputs each row
function rowOutput(i, j, players, strokeIndex, par, scoreSystem){
    var jIndex = Math.trunc(Math.floor(j/2));
    var index = i;

    /*if(i>9){
        index-=1;
    }*/

    if(i===9 || i>=19 ){
        if(j===0 || j%2===0){
            return(
                <td key={j} id={players[jIndex].name+i}>{players[jIndex].strokes[i]}</td>
            );
        }
        else{
            return(
                <td key={j} id={players[jIndex].name+"Score"+i}>{players[jIndex].score[i]}</td>
            );
        }
    }
    else{
        if(j===0 || j%2===0){
            return(
                <td key={j}>
                    <input type="text" defaultValue={players[jIndex].strokes[index]} onChange={()=>{handleStrokesChange(i, j, players); handleScoreChange(i, j, players, strokeIndex, par, scoreSystem)}} style={getInputCellStyle(jIndex, index)} id={players[jIndex].name+i}/>
                    {/* { changeStrokesBg(cardOptions.parColumn[index], players[jIndex].strokes[index], `${players[jIndex].name}${i}` ) } */}
                    {/* { console.log(`${players[jIndex].name}${i}`) } */}
                </td>
            );
        }
        else{
            return(
                <td key={j} id={players[jIndex].name+"Score"+i}>{players[jIndex].score[index]}</td>
            );
        }
    }
}

//the main functional component for inputTable
function InputTable(props){
    const componentRef = useRef();
    const {cardOptions, playerNum, players, scoringSystem, tournament} = props;

    //make all the words in tournament begin with capital letter.
    var tList = tournament.split(' ');
    for(var i=0; i<tList.length; i++){
        tList[i] = tList[i].charAt(0).toUpperCase()+tList[i].slice(1);
    }
    var event = tList.join(" ");

    var nDate = new Date();
    var eventDate = nDate.toDateString();

    return(
        <div className="p-4">
            <CardSection 
                cardOptions={cardOptions} event={event} scoringSystem={scoringSystem} eventDate={eventDate} ref={componentRef} 
                playerNum={playerNum} players={players} 
            />
            
            <div className="row mt-3">
                <div className="col-6">
                    <a href="/" className="btn btn-dark btn-sm">Back</a>
                </div>
                <div className="col-6 text-end">
                    <button onClick={()=> {
                        document.getElementById("tableID").classList.remove("table-responsive");
                        const scoreWidth = (165*(playerNum-1)) + document.getElementById("scorecard").clientWidth;
                        //find a way to get the actual width of the scorecard element
                        exportComponentAsPNG(componentRef, {
                            fileName: "scorecard",
                            html2CanvasOptions:{
                                width: scoreWidth,
                            }
                        });
                        document.getElementById("tableID").classList.add("table-responsive");
                    }} className="btn btn-primary btn-sm">Download Scorecard</button>
                </div>
            </div>
        </div>
    );

}

export default InputTable;