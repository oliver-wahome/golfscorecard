import React from 'react'

function playerCheck(players, num, text){
    if(players.length <= num){
        return "";
    }
    else{
        if(text === "name"){
            return players[num].name;
        }
        else{
            return players[num].handicap;
        }
        
    }
}

function playerInput (props){

    const {num, players} = props;
    return(
        <div className="form-group row align-items-center">

            {/* Player's detail dynamic listItem input */}
            <p className="col-md-2 mt-2">Player {num+1} </p>
            <div className="col-md-5">
                <div className="row">
                    <label htmlFor={"playerName"+(num+1)} className="col-4 mt-2 form-label">Name:</label>
                    <div className="col-8">
                        <input type="text" className="h-75 w-75 form-control" id={"playerName"+(num+1)} defaultValue={playerCheck(players, num, "name")} required/>
                    </div>
                </div>
            </div>
            
            <div className="col-md-5">
                <div className="row">
                    <label htmlFor={"handicap"+(num+1)} className="col-4 mt-2 form-label">Handicap:</label>
                    <div className="col-8">
                        <input type="text" className="h-75 w-75 form-control" id={"handicap"+(num+1)} defaultValue={playerCheck(players, num, "handicap")} required/>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default playerInput;