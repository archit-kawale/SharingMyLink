import React, { Component } from "react";
import RoomJoinPage from "./RoomJoinPage";
import RoomCreatePage from "./RoomCreatePage";
import { 
    BrowserRouter as Router, 
    Switch, 
    Route, 
    Link, 
    Redirect 
} from "react-router-dom";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Room from "./Room";

export default class HomePage extends Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <Router>
                <Switch>
                    <Route exact path="/">
                        <p><h1>SharingMyLink</h1></p>
                        <Button color="primary" to="RoomCreatePage" component={Link}>Create Room</Button>
                        <Button color="secondary" to="RoomJoinPage" component={Link}>Join Room</Button>
                    </Route>
                    <Route path="/RoomJoinPage" component={RoomJoinPage} />
                    <Route path="/RoomCreatePage" component={RoomCreatePage} />
                    <Route path="/room/:roomCode" component={Room} />
                </Switch>
            </Router>
        );
    }
}