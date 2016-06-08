'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import jQuery from 'jquery';
import Dropzone from 'react-dropzone';
import request from'superagent';

let clientTasks = [];
let statusIcons = {
    'done': 'fa fa-check',
    'pending': 'fa fa-hourglass',
    'unsupported file': 'fa fa-ban'
};

class Step1Dropzone extends React.Component {
    onDrop(tasks) {
        let req = request.post('/api/v1/tasks');

        tasks.forEach(task => req.attach(task.label, task));

        req.end((err, res) => {
            clientTasks = clientTasks.concat(JSON.parse(res.text).tasks);
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
        this.state = { tasks: clientTasks }
    }

    componentWillMount() {
        setInterval(() => this._fetchTasks(), 5000);
    }

    render() {
        // let csvs = 'dummy';
        // let pdfs = 'dummy';
        
        let csvs = this.state.tasks.map((task) => {
            if (task.status == 'done') return (
                <a href={`/results/${task.hash}/${task.bodyName}.csv`} download=''><i className="fa fa-file-text-o" /></a>
            );
            else return "";
        });

        let pdfs = this.state.tasks.map((task) => {
            if (task.status == 'done') return (
                <a href={`/results/${task.hash}/${task.bodyName}.pdf`} download=''><i className="fa fa-file-pdf-o" /></a>
            );
            else return "";
        });

        return (
            <table class="table-responsive">
                <tbody>
                {this.state.tasks.map((task, i) => (
                    <tr key={i}>
                        <td>{task.label}</td>
                        <td><i className={statusIcons[task.status]} /> {csvs[i]} {pdfs[i]}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }

    _fetchTasks() {
        clientTasks.forEach((task, i) => {
            if (task.status == 'pending') {
                jQuery.ajax({
                    method: 'GET',
                    url: `/api/v1/tasks/${task.id}`,
                    success: response => {
                        clientTasks[i] = response;
                    }
                })
            }
        });

        this.setState({ tasks: clientTasks });
    }
}

jQuery(() => {
    ReactDOM.render(
        <Step1Dropzone />,
        document.getElementById('dropzone')
    );

    ReactDOM.render(
        <Step2List />,
        document.getElementById('tasks')
    );
});