import React from 'react';

function inputEvent(props){

    const {event} = props;
    return(
        <div className="form-group row">
            <div className="col-md-4">
                <p><strong>Enter event / tournament name:</strong></p>
            </div>
            <div className="col-md-8 ms-2">
                <div className="row">
                    <input type="text" className="h-75 w-75 form-control" id="eventName" defaultValue={event} required/>
                </div>
            </div>           
        </div>
    );
}

export default inputEvent;