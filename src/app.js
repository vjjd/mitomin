'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import jQuery from 'jquery';
import Dropzone from 'react-dropzone';

var request = require('superagent');

class Step1Dropzone extends React.Component {
    onDrop(files) {
        console.log('Received files: ', files);

        var req = request.post('/api/v1/files');
        files.forEach((file)=> {
            req.attach(file.name, file);
        });
        req.end((err, res) => {
            console.log(res);
        });
    }

    render() {
        return (
            <div>
                <Dropzone onDrop={this.onDrop}>
                    <div>Try dropping some files here, or click to select files to upload.</div>
                </Dropzone>
            </div>
        );
    }
}

class Step2List extends React.Component {
    constructor() {
        super();
        this.state = { files: [] }
    }

    componentWillMount() {
        //setInterval(() => this._fetchFiles(), 5000);
    }

    render() {
        return (
            <ul>
                {this.state.files.map((f, i) => (
                    <li key={i}>{f.name} {f.status}</li>
                ))}
            </ul>
        );
    }

    _fetchFiles() {
        jQuery.ajax({
            method: 'GET',
            url: '/api/v1/files',
            success: files => {
                this.setState({ files });
            }
        })
    }
}

jQuery(() => {
    ReactDOM.render(
        <Step2List />,
        document.getElementById('files')
    );
    
    ReactDOM.render(
        <Step1Dropzone />,
        document.getElementById('dropzone')
    );
});