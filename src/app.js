'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import jQuery from 'jquery';
import Dropzone from 'react-dropzone';
import request from'superagent';

let clientFiles = [];

class Step1Dropzone extends React.Component {
    onDrop(files) {
        let req = request.post('/api/v1/files');

        files.forEach((file)=> {
            req.attach(file.name, file);
        });

        req.end((err, res) => {
            clientFiles = clientFiles.concat(JSON.parse(res.text).files);
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
        this.state = { files: clientFiles }
    }

    componentWillMount() {
        setInterval(() => this._fetchFiles(), 5000);
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
        clientFiles.forEach((file, i) => {
            if (file.status == 'pending') {
                jQuery.ajax({
                    method: 'GET',
                    url: `/api/v1/files/${file.key}`,
                    success: response => {
                        clientFiles[i].status = response.status;
                        console.log(response);
                    }
                })
            }
        });

        this.setState({ files: clientFiles });
    }
}

jQuery(() => {
    ReactDOM.render(
        <Step1Dropzone />,
        document.getElementById('dropzone')
    );

    ReactDOM.render(
        <Step2List />,
        document.getElementById('files')
    );
});