import React from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import { CardHeader } from 'material-ui/Card';
import { connect } from 'react-redux'
import * as firebase from 'firebase'
import AuthAction from '../../store/actions/authAction'
import history from "../../container/history";
class Navbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = { open: false };
    }

    handleToggle = () => this.setState({ open: !this.state.open });
    handleClose = () => this.setState({ open: false });

    render() {
        var provider = new firebase.auth.FacebookAuthProvider();
        return (
            <div>
                <AppBar
                    onLeftIconButtonClick={this.props.isLogin ? this.handleToggle : () => { alert('Login First') }}
                    title="User Authentication Boiler Plate"
                    // iconClassNameRight="muidocs-icon-navigation-expand-more"
                    iconElementRight={<FlatButton onClick={this.props.isLogin ? () => {
                        firebase.auth().signOut().then(() => {
                            // alert('Logout Success Full');
                            this.props.logout();
                        }).catch(() => {
                            // alert('Error')
                        })
                    } :
                        () => {
                            firebase.auth().signInWithPopup(provider).then((result) => {
                                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                                var token = result.credential.accessToken;
                                // The signed-in user info.
                                var user = result.user;
                                console.log(token)
                                console.log(user)
                                // ...
                                let userData = {
                                    name: user.displayName,
                                    email: user.email,
                                    phoneNumber: user.phoneNumber,
                                    photoURL: user.photoURL,
                                    address: null,
                                    age: 20
                                }

                                firebase.database().ref('/').child(`users/${user.uid}/`).set(userData).then(() => {

                                    // alert('User Login Successfully')
                                }).catch((e) => {
                                    // alert(e.message)
                                });
                                this.props.loginSuccess();



                            }).catch((error) => {
                                // Handle Errors here.
                                var errorCode = error.code;
                                var errorMessage = error.message;
                                // The email of the user's account used.
                                var email = error.email;
                                // The firebase.auth.AuthCredential type that was used.
                                var credential = error.credential;
                                console.log(error.code)
                                console.log(error.message)
                                // ...
                            });
                        }}

                        label={this.props.isLogin ? 'Logout' : 'Login With Facebook'}
                        iconElementLeft={<FlatButton label="Primary" primary={true} />}

                    />}
                >
                </AppBar>
                <Drawer
                    docked={false}
                    width={260}
                    open={this.state.open}
                    onRequestChange={(open) => this.setState({ open })}
                >
                    {
                        this.props.isLogin ? this.props.allUsers !== undefined ? this.props.allUsers[firebase.auth().currentUser.uid] !== undefined ? 
                            this.props.allUsers[firebase.auth().currentUser.uid].role === 'admin' ?
                                < span >
                                    <CardHeader
                                        title={`${this.props.allUsers !== undefined ? this.props.allUsers[firebase.auth().currentUser.uid].name : null}`}
                                        avatar={'data:image/jpeg;base64,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'}
                                    />
                                    <MenuItem onClick={() => {
                                        history.push('/newquiz');
                                        this.setState({ open: false });
                                    }}>DashBoard</MenuItem>
                                    <MenuItem onClick={() => {
                                        history.push('/addnewquiz');
                                        this.setState({ open: false });
                                    }}>Add Quiz</MenuItem>
                                    <MenuItem onClick={() => {
                                        history.push('/myquiz');
                                        this.setState({ open: false });
                                    }}>My Quiz</MenuItem>
                                    <MenuItem onClick={() => {
                                        history.push('/faq');
                                        this.setState({ open: false });
                                    }}>FAQ</MenuItem>
                                    <MenuItem onClick={() => {
                                        history.push('/report');
                                        this.setState({ open: false });
                                    }}>Report </MenuItem>
                                    <MenuItem onClick={() => {
                                        history.push('/profile');
                                        this.setState({ open: false });
                                    }}>Profile</MenuItem>
                                </span>
                                :
                                <span>
                                    <MenuItem onClick={() => {
                                        history.push('/');
                                        this.setState({ open: false });
                                    }}>Student Dashboard</MenuItem>
                                    <MenuItem onClick={() => {
                                        history.push('/studentResults');
                                        this.setState({ open: false });
                                    }}>Result</MenuItem>
                                 
                                </span>
                            : null : null : null
                    }


                </Drawer>
            </div>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        isLogin: state.AuthReducer.isLogin,
        allUsers: state.AuthReducer.allUsers
    }
}
let mapDispatchToProps = (dispatch) => {
    return {
        loginSuccess: () => { dispatch(AuthAction.loginUserSuccessfully()) },
        logout: () => { dispatch(AuthAction.logout()) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Navbar)
