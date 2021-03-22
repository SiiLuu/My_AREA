import 'dart:convert';

import 'package:AppMobile/UI/bottomNavBar/bottomNavBar.dart';
import 'package:AppMobile/UI/loginAndRegisterPage/pageComponent.dart';

import 'package:AppMobile/UI/Popup/showErrorAlert.dart';

import 'package:AppMobile/Models/const.dart';
import 'package:AppMobile/Models/userClass.dart';
import 'package:AppMobile/Logic/request.dart';

import 'package:AppMobile/OAuth/facebookOAuth.dart';
import 'package:AppMobile/OAuth/googleOAuth.dart';
import 'package:AppMobile/OAuth/githubOAuth.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class LoginPage extends StatefulWidget {
  LoginPage({Key key}) : super(key: key);

  @override
  _LoginPage createState() => _LoginPage();
}

class _LoginPage extends State<LoginPage> {
  OAuthGoogle googleOAuth = OAuthGoogle();
  bool _signInActive = true;
  bool _signUpActive = false;
  TextEditingController _emailController,
      _firstnameController,
      _lastnameController,
      _password1Controller,
      _password2Controller;

  @override
  void initState() {
    super.initState();
    _firstnameController = TextEditingController();
    _lastnameController = TextEditingController();
    _emailController = TextEditingController();
    _password1Controller = TextEditingController();
    _password2Controller = TextEditingController();
  }

  @override
  void dispose() {
    _firstnameController.dispose();
    _lastnameController.dispose();
    _emailController.dispose();
    _password1Controller.dispose();
    _password2Controller.dispose();
    super.dispose();
  }

  void changeToSignUp() {
    setState(() {
      _signInActive = false;
      _signUpActive = true;
    });
  }

  void changeToSignIn() {
    _signInActive = true;
    _signUpActive = false;
  }

  Future<dynamic> _showMailSend(String email) {
    return showGeneralDialog(
      barrierLabel: "Label",
      barrierDismissible: true,
      barrierColor: Colors.black.withOpacity(0.5),
      transitionDuration: Duration(milliseconds: 300),
      context: context,
      pageBuilder: (context, anim1, anim2) {
        return Align(
          alignment: Alignment.center,
          child: Container(
            height: 300,
            child: SizedBox.expand(
                child: Center(
                    child: Text(
              "We sent an email to " + email + " to validate your account",
              style: TextStyle(
                  fontSize: 20,
                  color: Colors.black,
                  decoration: TextDecoration.none),
              textAlign: TextAlign.center,
            ))),
            margin: EdgeInsets.only(top: 50, left: 12, right: 12, bottom: 50),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(40),
            ),
          ),
        );
      },
      transitionBuilder: (context, anim1, anim2, child) {
        return SlideTransition(
          position:
              Tween(begin: Offset(0, 1), end: Offset(0, 0)).animate(anim1),
          child: child,
        );
      },
    );
  }

  void register(String firstname, String lastname, String email,
      String password1, String password2) async {
    if (password1 != password2) {
      showErrorAlert(context, "The passwords entered are different");
      return;
    }
    List request = await sendPOSTRequest(
        "http://" + requestUrl + ":8080/api/user/register", {
      'Content-Type': 'application/json'
    }, {
      'username': firstname + " " + lastname,
      'email': email,
      'password': password1
    });
    if (request.first != 200) {
      showErrorAlert(context, request.last);
      return;
    }
    _showMailSend(email);
  }

  void login(String email, String password) async {
    List request = await sendPOSTRequest(
        "http://" + requestUrl + ":8080/api/user/login",
        {'Content-Type': 'application/json'},
        {'email': email, 'password': password});
    if (request.first != 200) {
      showErrorAlert(context, request.last);
      return;
    }
    Map decoded = jsonDecode(request.last);
    String token = decoded["token"];
    User.setInstance(name: email, token: token);
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => BottomNavBar()),
    );
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Container(
        decoration: BoxDecoration(
            gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Colors.blue[700], Colors.lightBlue[300]])),
        child: Scaffold(
          resizeToAvoidBottomInset: false,
          backgroundColor: Colors.transparent,
          body: Center(
            child: Column(
              children: [
                Container(
                  alignment: Alignment.center,
                  height: size.height * 0.20,
                  child: Text(
                    'AREA',
                    style: TextStyle(
                        fontSize: 25,
                        fontWeight: FontWeight.bold,
                        color: Colors.white),
                  ),
                ),
                Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(25),
                    color: Colors.white,
                  ),
                  width: size.width * 0.80,
                  height: size.height * 0.75,
                  child: Column(
                    children: [
                      Container(
                        child: Padding(
                          padding: EdgeInsets.only(
                              left: 25.0, right: 25.0, top: 15.0),
                          child: IntrinsicWidth(
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: <Widget>[
                                DecoratedBox(
                                  decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(20),
                                      color: _signInActive
                                          ? Colors.blue
                                          : Colors.white),
                                  child: OutlineButton(
                                    onPressed: () =>
                                        setState(() => {_signInActive = true}),
                                    borderSide: BorderSide(
                                      style: BorderStyle.none,
                                    ),
                                    child: new Text('Sign In',
                                        style: _signInActive
                                            ? TextStyle(
                                                fontSize: 20,
                                                color: Colors.white,
                                                fontWeight: FontWeight.bold)
                                            : TextStyle(
                                                fontSize: 20,
                                                color: Colors.blue,
                                                fontWeight: FontWeight.normal)),
                                  ),
                                ),
                                DecoratedBox(
                                  decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(20),
                                      color: _signInActive
                                          ? Colors.white
                                          : Colors.blue),
                                  child: OutlineButton(
                                    onPressed: () =>
                                        setState(() => {_signInActive = false}),
                                    borderSide: BorderSide(
                                      style: BorderStyle.none,
                                    ),
                                    child: new Text('Sign Up',
                                        style: _signInActive
                                            ? TextStyle(
                                                fontSize: 20,
                                                color: Colors.blue,
                                                fontWeight: FontWeight.normal)
                                            : TextStyle(
                                                fontSize: 20,
                                                color: Colors.white,
                                                fontWeight: FontWeight.bold)),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      Container(
                          child: _signInActive
                              ? _showSignIn(context)
                              : _showSignUp(context)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ));
  }

  Widget _showSignIn(context) {
    Size size = MediaQuery.of(context).size;
    ThemeData _myTheme = Theme.of(context);
    return Container(
      child: Column(
        children: <Widget>[
          InputEmail(controller: _emailController),
          InputPassword(controller: _password1Controller),
          SizedBox(height: size.height * 0.05),
          RoundedButton(
            text: 'CONTINUE',
            padding: EdgeInsets.symmetric(horizontal: size.width * 0.10),
            color: Colors.blue,
            textColor: Colors.white,
            press: () {
              login(_emailController.text, _password1Controller.text);
            },
          ),
          SizedBox(height: size.height * 0.01),
          Container(
            alignment: Alignment.center,
            child: GestureDetector(
              onTap: () {},
              child: Text(
                'Forgot password ?',
                style: _myTheme.textTheme.button.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          Container(
              width: size.width * 0.5,
              margin: EdgeInsets.only(top: 25.0),
              child: FlatButton(
                child: Text(
                  'Sign in using Facebook',
                  style: TextStyle(fontSize: 15.0),
                ),
                color: Color.fromRGBO(47, 71, 122, 1.0),
                textColor: Colors.white,
                onPressed: () {
                  facebookOAuth(context).then((result) {
                    print(result);
                    if (result != null) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => BottomNavBar()),
                      );
                    } else {
                      showErrorAlert(context,
                          "An error occured with the oAuth, please try again");
                    }
                  });
                },
              )),
          Container(
            width: size.width * 0.5,
            child: FlatButton(
              child: Text(
                'Sign in using Google',
                style: TextStyle(fontSize: 15.0),
              ),
              color: Colors.white,
              textColor: Colors.black,
              shape: Border.all(width: 1.5, color: Colors.black),
              onPressed: () {
                googleOAuth.googleOAuth(context).then((result) {
                  if (result != null) {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => BottomNavBar()),
                    );
                  } else {
                    showErrorAlert(context,
                        "An error occured with the oAuth, please try again");
                  }
                });
              },
            ),
          ),
          Container(
            width: size.width * 0.5,
            child: FlatButton(
              child: Text(
                'Sign in using Github',
                style: TextStyle(fontSize: 15.0),
              ),
              color: Colors.black,
              textColor: Colors.white,
              onPressed: () {
                githubOAuth(context).then(
                  (result) {
                    print(result);
                    if (result != null) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => BottomNavBar()),
                      );
                    } else {
                      showErrorAlert(context,
                          "An error occured with the oAuth, please try again");
                    }
                  },
                );
                print("Sign in with Github");
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _showSignUp(context) {
    Size size = MediaQuery.of(context).size;
    ThemeData _myTheme = Theme.of(context);
    return Container(
      child: Column(
        children: <Widget>[
          InputFirstName(controller: _firstnameController),
          InputLastName(controller: _lastnameController),
          InputEmail(controller: _emailController),
          InputPassword(controller: _password1Controller),
          InputPassword(controller: _password2Controller),
          SizedBox(height: size.height * 0.05),
          RoundedButton(
            text: 'REGISTER',
            padding: EdgeInsets.symmetric(horizontal: size.width * 0.10),
            color: Colors.blue,
            textColor: Colors.white,
            press: () {
              register(
                  _firstnameController.text,
                  _lastnameController.text,
                  _emailController.text,
                  _password1Controller.text,
                  _password2Controller.text);
            },
          ),
          SizedBox(height: size.height * 0.01),
        ],
      ),
    );
  }
}
