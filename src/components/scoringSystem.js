import React from 'react';

function scoringSystem(){
    return(
        <div className="form-group row">
            <div className="col-sm-4">
                <p><strong>Select Scoring System:</strong></p>
            </div>
            <div className="col-sm-8">
                <div className="row mx-auto">
                    <div className="col form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="radioBtn" id="radio1" value="option1" required/>
                        <label className="form-check-label" htmlFor="radio1">Medal / StrokePlay</label>
                    </div>
                    <div className="col form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="radioBtn" id="radio2" value="option2" required/>
                        <label className="form-check-label" htmlFor="radio2">StableFord</label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default scoringSystem;