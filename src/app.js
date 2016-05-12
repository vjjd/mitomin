'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import jQuery from 'jquery';
import Dropzone from 'react-dropzone';
import request from'superagent';

let clientFiles = [];
let statusIcons = {
    'done': 'fa fa-check',
    'pending': 'fa fa-hourglass',
    'unsupported file': 'fa fa-ban'
};

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
                <center>
                    <Dropzone onDrop={this.onDrop}>
                        <div>
                            <br/>
                            Перетащите ваши файлы сюда или кликните по этой области мышкой, чтобы загрузить файлы на сервер.
                        </div>
                    </Dropzone>
                </center>
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
            <table class="table-responsive">
                <tbody>
                {this.state.files.map((f, i) => (
                    <tr key={i}>
                        <td>{f.name}</td>
                        <td><i className={statusIcons[f.status]} /></td>
                    </tr>
                ))}
                </tbody>
            </table>
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