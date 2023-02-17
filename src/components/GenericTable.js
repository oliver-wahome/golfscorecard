import {exportComponentAsPNG} from 'react-component-export-image';
import React, {useRef} from 'react';
import localStorage from 'local-storage';

//the sets colours for certain rows
function rowColour(x){
    if(x===9 || x===19 || x===20){
        return "table-info";
    }
    else if(x===21){
        return "table-primary";
    }
    else{
        return "";
    }
}

//the function outputs each row
function rowOutput(i, j, players){
    var index = i;

    /*if(i>9){
        index-=1;
    }*/

    if(i===9 || i>=19 ){
        return(
            <td key={j} id={players[j].name+i}>{players[j].strokes[i]}</td>
        );
    }
    else{
        return(
            <td key={j}>
                <input type="text" defaultValue={players[j].strokes[index]} onChange={()=>{handleStrokesChange(i, j, players)}} style={{width: "70px", border:"none", borderBottom:"3px solid black", textAlign:"center"}} id={players[j].name+i}/>
            </td>
        );
    }
}

//the function is run when strokes input or removed from card
function handleStrokesChange(i, j, players){
    //var j_index = Math.trunc(Math.floor(j/2));
    var index=i, total=0, firstNine=0, secondNine=0;
    /*if(index>9){
        index-=1;
    }*/
    players[j].strokes[index] = document.getElementById(players[j].name+i).value;

    for(var a=0; a<players[j].strokes.length; a++){
        if(!isNaN(parseInt(players[j].strokes[a]))){
            if(a<9){
                firstNine+=parseInt(players[j].strokes[a]);
            }
            else if(a > 9 && a < 19){
                secondNine+=parseInt(players[j].strokes[a]);
            }
            total = firstNine + secondNine;
        }
    }

    players[j].strokes[9] = firstNine;
    players[j].strokes[19] = secondNine;
    players[j].strokes[20] = firstNine;
    players[j].strokes[21] = total;

    localStorage.set("players", players);
    //console.log("players in strokes change :", players);

    document.getElementById(players[j].name+21).innerHTML = total;
    document.getElementById(players[j].name+9).innerHTML = firstNine;
    document.getElementById(players[j].name+20).innerHTML = firstNine;
    document.getElementById(players[j].name+19).innerHTML = secondNine;
}

//function to output the whole table
const CardSection = React.forwardRef((props, ref) =>(
    <div id="generic_card" ref={ref}>
        <div className="text-center">
            <h5>
                <strong>{props.event}</strong>
            </h5>
            <p>{props.eventDate}</p>
        </div>
        <div id="gentableID" className="table-responsive">
            <table className="table">
                <thead className="table-dark text-center">
                    <tr>
                        <th scope="col">Hole No.</th>
                        {[...Array(props.playerNum)].map((e, i) => (
                            <th scope="col" key={i}>{props.players[i].name+" ("+props.players[i].handicap+")"}</th>
                        ))}
                    </tr>
                    <tr>
                        <th></th>
                        {[...Array(props.playerNum)].map((e, i) => (
                            <th scope="col" key={i}>Strokes</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[...Array(22)].map((e, i) => (
                        <tr key={i} className={"text-center "+rowColour(i)}>
                            <th scope="row">{props.cardOptions.holeColumn[i]}</th>
                            {[...Array(props.playerNum)].map((e, j) => (
                                rowOutput(i, j, props.players)
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
));

function GenericTable(props){
    const componentRef = useRef();
    const {cardOptions, playerNum, players, tournament} = props;
    

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
                event={event} eventDate={eventDate} ref={componentRef} 
                playerNum={playerNum} players={players} cardOptions={cardOptions}
            />
            
            <div className="row mt-3">
                <div className="col-6">
                    <a href="/" className="btn btn-dark btn-sm">Back</a>
                </div>
                <div className="col-6 text-end">
                    <button onClick={()=> {
                        document.getElementById("gentableID").classList.remove("table-responsive");
                        const scoreWidth = (165*(playerNum-1)) + document.getElementById("generic_card").clientWidth;
                        //find a way to get the actual width of the scorecard element
                        exportComponentAsPNG(componentRef, {
                            fileName: "scorecard",
                            html2CanvasOptions:{
                                width: scoreWidth,
                            }
                        });
                        document.getElementById("gentableID").classList.add("table-responsive");
                    }} className="btn btn-primary btn-sm">Download Scorecard</button>
                </div>
            </div>
        </div>
    );
}

export default GenericTable;