import React from "react";
import { Image } from 'react-bootstrap';
import { useState } from 'react';
import '../App.css';

function EditProfile(props) {
    const [formData, setFormData] = useState({ task: '', taskDesc: '' });
    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const ChangeProfile = () => {
        document.getElementById('trainerName').value = '';
    };
    console.log(formData);
    return (
        <div className="add">
            <div className="input-selection">
                <Image src={props.match.params.img} thumbnail />
                <label>
                    upload picture:
                    <input type="file" id="img" name="img" accept="image/*"></input>
                    {/* <input
                        onChange={(e) => handleChange(e)}
                        id="trainerName"
                        name="trainerName"
                    /> */}
                </label>
            </div>
            <button onClick={ChangeProfile}>Submit</button>
            <button>Cancel</button>
        </div>
    );
}

export default EditProfile;