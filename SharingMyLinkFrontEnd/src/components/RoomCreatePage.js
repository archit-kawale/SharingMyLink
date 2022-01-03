import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { FormControl, FormHelperText } from "@material-ui/core";
import { Link } from "react-router-dom";

export default class RoomCreatePage extends Component
{
    constructor(props)
    {
        super(props);

        this.handleCreateRoomButtonPressed = this.handleCreateRoomButtonPressed.bind(this);
        this.getCookie = this.getCookie.bind(this);
    }

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

    handleCreateRoomButtonPressed() {
        console.log("start")

        var csrftoken = this.getCookie('csrftoken');
        
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", 'X-CSRFToken': csrftoken },
          body: JSON.stringify({})
        };
        fetch("/api/create-room", requestOptions)
          .then((response) => {
            console.log("Responding")  
            return response.json()
          })
          .then((data) => this.props.history.push("/room/" + data.code));
      }

    render()
    {
        return <Grid container spacing={1}>
                    <Grid item xs={12} align="center">
                        <Typography component="h4" variant="h4">
                            Create a Room
                        </Typography>
                    </Grid>
                    {/* <Grid item xs={12} align="center">
                        <FormControl>
                            <TextField
                                required={true}
                                type="text"
                            />
                        
                        <FormHelperText>
                            <div align="center">
                                UserName
                            </div>
                        </FormHelperText>
                        </FormControl>
                    </Grid> */}
                    <Grid item xs={12} align="center">
                        <Button color="primary" onClick={this.handleCreateRoomButtonPressed}>
                            Create Room
                        </Button>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <Button color="secondary" variant="contained" to="/" component={Link}>
                            Back To Home
                        </Button>
                    </Grid>
                </Grid>
    }


    
}