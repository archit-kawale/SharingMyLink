import React, { Component } from "react";
// import { useEffect } from "react";
import {client, w3cwebsocket as W3Cwebsocket} from "websocket"
import moment from "moment";
import axios from "axios";
import {CircularProgress} from '@material-ui/core';
import { TextField, Button, Grid, Typography, DialogActions, Dialog, DialogContent, DialogTitle, Paper, Box } from "@material-ui/core";



/*
Sasta WhatsApp
Kya bola?



*/
export default class Room extends Component
{
    //const messagesEnd = React.createRef()

    constructor(props)
    {
        super(props);
        this.state = {
            isHost: false,
            RoomExist: true,
            name: "",
            nameError: "",
            chatText: "",
            disabled: false,
            file: null,
            fileProgress: 0,
            fileURL: [],
            destroyed: false,
            chatBox: [],
        };

        this.inputRef = React.createRef()

        this.roomCode = this.props.match.params.roomCode;
        this.getRoomDetails = this.getRoomDetails.bind(this);
        this.onChatButtonPressed = this.onChatButtonPressed.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
        this.getCookie = this.getCookie.bind(this);
        this.getRoomFiles = this.getRoomFiles.bind(this);
        this.destroyRoom = this.destroyRoom.bind(this);
        this.updateName = this.updateName.bind(this);
        this.updateChat = this.updateChat.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.getRoomDetails();
        this.getRoomFiles();
        // console.log(this.roomCode)

        
        client = new W3Cwebsocket('ws://'+ window.location.host +'/ws/room/' + this.roomCode)
        client.onmessage = (message) => {
            var json_message_data = JSON.parse(message.data);
            // console.log(json_message_data);
            if (json_message_data.message)
            {
                // var temp = { chatName: json_message_data.message.name, chatMessage: json_message_data.message.message, chatTime: json_message_data.message.time}
                // this.setState({chatBox: [...chatBox, temp]})
                // console.log(chatBox);

                this.updateChat(json_message_data)
                // console.log(json_message_data.message.name);
                // console.log(json_message_data.message.message);
                // console.log(json_message_data.message.time);
            }

            if (json_message_data.destroy)
            {
                this.setState({destroyed: true});
            }

            // console.log(json_message_data.message.name);
            // console.log(json_message_data.message.message);
            // console.log(json_message_data.message.time);

            if (json_message_data.file)
            {
                console.log(json_message_data.file)
                this.setState(previousState => ({
                    fileURL: [...previousState.fileURL, json_message_data.file]
                }))

                // this.getRoomFiles()
            }
        };

        
    }


    
    
    scrollToBottom = () => {
        this.el?.scrollIntoView({ behavior: "smooth" });
      }
      
      componentDidMount() {
        this.scrollToBottom();
      }
      
      componentDidUpdate() {
        this.scrollToBottom();
      }


    updateName()
    {
        if(this.state.name && this.state.name.trim())
        {
            this.setState({disabled: true})
        }
        else
        {
            this.setState({nameError: "Kindly enter your name."})

        }
    }

    updateChat(json_message_data)
    {
        var temp = { chatName: json_message_data.message.name, chatMessage: json_message_data.message.message, chatTime: json_message_data.message.time}
        this.setState(previousState => ({
            chatBox: [...previousState.chatBox, temp]
        }))
        console.log(this.state.chatBox);
    }
    
    // componentWillmount()
    // {
    //     client.onopen = () => {
    //         console.log('WebSocket Client Connected');
    //     };
    // }

    getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // appendFile(URL)
    // {
    //     this.setState(previousFiles => {
    //                 fileURL: [...previousFiles, URL]
    //             })
    // }
    
    onChatButtonPressed()
    {
        var now = new moment()
        if(this.state.chatText && this.state.chatText.trim())
        {

            client.send(JSON.stringify({
                message: {
                    name: this.state.name,
                    message: this.state.chatText,
                    time: now.format("HH:mm"),
                }
            }));
            this.setState({chatText: ""})
            //this.setState({disabled: true})
        }
    }

    getRoomDetails()
    {
        fetch("/api/get-room/" + "?code=" + this.roomCode).then((response) => 
        {
            // console.log(response)
            if (response.status == 404)
            {
                this.setState({
                    RoomExist: false,
                })
            }
            return response.json()
        }
         ).then((data) => {
            // console.log(data);
            this.setState({
                isHost: data.is_host,
            });
        });
    }

    fileUpload()
    {
        var csrftoken = this.getCookie('csrftoken');

        const config = {
            onUploadProgress: progressEvent => {
                var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                this.setState({fileProgress: percentCompleted})

            },
            headers: {
                'content-type': 'multipart/form-data', 'X-CSRFToken': csrftoken
            }
        }

        var formData = new FormData();
        formData.append('file', this.state.file, this.state.file.name);
        axios.post('/api/file-upload/?code=' + this.roomCode, formData, config).then(response => {
            console.log(response);
            this.setState({fileProgress: 0});
            this.setState({file: null})
            this.inputRef.current.value = '';
        }).catch(response => {
            console.log(response)
            this.setState({fileProgress: 0});
            this.setState({file: null})
            this.inputRef.current.value = '';
        })
            
    }

    getRoomFiles()
    {
        fetch("/api/file-fetch/?code=" + this.roomCode).then(response => response.json()).then(data => {
            this.setState({
                fileURL: data.files
            }
        )
        }).catch(response => console.error(response))
    }

    destroyRoom()
    {
        fetch("/api/room-destroy/").then(response => response.json()).then(data => {
        console.log(data);
        }).catch(response => console.error(response))
    }

    render()
    {
        if (!this.state.RoomExist)
        {
            return (
                <div>
                    <h3>{this.roomCode}</h3>
                    <p>This Room does NOT exist</p>
                </div>
            );
        
        }
        if (this.state.destroyed)
        {
            return (
                <div>
                <h3>{this.roomCode}</h3>
                <p>Room was destroyed...</p>
                </div>
            )
        }
        if(!this.state.disabled)
        {
            return(
                <Dialog open={!this.state.disabled}>
                <DialogTitle>Enter Name</DialogTitle>
                <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    fullWidth
                    variant="standard"
                    value={this.state.name}
                    onChange={e => this.setState({name: e.target.value})}
                    error={this.state.nameError}
                    helperText={this.state.nameError}
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={this.updateName}>Ok</Button>
                </DialogActions>
            </Dialog>
            )
        }
        return (
            <div style={{textAlign: "center"}}> 
                
                


                <h3>{this.roomCode}</h3>
                <p>Host: {this.state.isHost.toString()}</p>
                <p>Hello, {this.state.name}!</p>

                <div>
                    <Grid container style={{height: "60vh", maxHeight: "60vh", minWidth: "70vw"}}>
                        <Grid component={Paper} item xs={8}>
                            <Box style={{textAlign: "left", overflow: "auto", maxHeight: "50vh", height: "50vh"}}> 
                            { 
        
                                this.state.chatBox.map((chat,  i = 0) => 
                                    <div>
                                        <p>{chat.chatName}</p>
                                        <p>{chat.chatMessage}</p>
                                        <p>{chat.chatTime}</p>
                                    </div>
                                )
                            }
                            
                            <div ref={el => { this.el = el; }} />

                            </Box>
                            <Box style={{textAlign: "left", overflow: "auto", maxHeight: "10vh"}}>
                            <TextField style={{maxWidth: "40vw", width:"40vw", paddingRight: "1vw"}} type="Text" value={this.state.chatText} onChange={e => this.setState({chatText: e.target.value})} />
                            <Button variant="contained" color="primary" style={{width: "3vw"}} onClick={this.onChatButtonPressed}>Send</Button>
                            </Box>
                        </Grid>
                        <Grid component={Paper} item xs={4}>
                            <Box style={{textAlign: "left", overflow: "auto", maxHeight: "50vh", height: "50vh"}}>
                            {
                                this.state.fileURL.map((file,  i = 0) => file && 
                                <li> 
                                    <a href = {file} target = "_blank" download> 
                                        {file.substring(14)}
                                    </a>
                                </li> 
                                )           
                            }
                            </Box>

                            <Box style={{textAlign: "center", overflow: "auto", maxHeight: "20vh"}}>
                                <p><input type='file' /*value={this.state.file}*/ ref={this.inputRef} onChange={e => this.setState({file: e.target.files[0]})}></input></p>
                                <p><Button variant="contained" color="primary" onClick={this.fileUpload}>Upload</Button></p>
                                {this.state.fileProgress != 100 && this.state.fileProgress!=0 && <p><CircularProgress size = {25} variant = "determinate" value = {this.state.fileProgress} /></p>}
                                {this.state.fileProgress== 100 && <p><CircularProgress size = {25} /></p>}
                                {this.state.fileProgress!=0 && <p>{this.state.fileProgress}%</p>}
                            </Box>


                        </Grid>
                        
                    </Grid>
                </div>

               
                {/* <p><input type='file' value={this.state.file} ref={this.inputRef} onChange={e => this.setState({file: e.target.files[0]})}></input></p>
                <p><button onClick={this.fileUpload}>Upload</button></p>
                {this.state.fileProgress != 100 && this.state.fileProgress!=0 && <p><CircularProgress size = {25} variant = "determinate" value = {this.state.fileProgress} /></p>}
                {this.state.fileProgress== 100 && <p><CircularProgress size = {25} /></p>}
                {this.state.fileProgress!=0 && <p>{this.state.fileProgress}%</p>} */}

                <div>
               
                {this.state.isHost && <Button variant="outlined" color="primary"  onClick={this.destroyRoom}>Destroy Room</Button>}
                {!this.state.isHost && <Button variant="outlined" color="primary" onClick={() => this.props.history.push("/")}>Leave Room</Button>}

                </div>


            </div>
            
        );
    }
}