import 'package:AppMobile/UI/loginAndRegisterPage/loginPage.dart';
import 'package:AppMobile/UI/Popup/showErrorAlert.dart';
import 'package:AppMobile/Models/userClass.dart';
import 'package:AppMobile/Logic/request.dart';
import 'package:image_picker/image_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:AppMobile/Models/const.dart';
import 'dart:convert';

import 'package:AppMobile/OAuth/facebookOAuth.dart';
import 'package:AppMobile/OAuth/githubOAuth.dart';
import 'package:AppMobile/OAuth/googleOAuth.dart';
import 'package:AppMobile/OAuth/spotifyOAuth.dart';

List oAuthServices = ["facebook", "github", "google", "spotify"];
List oAuthFunctions = [
  facebookOAuth,
  githubOAuth,
  OAuthGoogle().googleOAuth,
  spotifyOAuth
];

class UserProfile extends StatefulWidget {
  UserProfile({Key key}) : super(key: key);

  @override
  _UserProfile createState() => _UserProfile();
}

class _UserProfile extends State<UserProfile> {
  String _profilePicture;
  String _username = "";
  String _email = "";
  String _location = "";
  String _phone = "";
  List _servicesConnected = [];
  List _subscribed = [];
  List _serviceList = [];

  _UserProfile() {
    _profilePicture = profilePicture;
    _serviceList = [
      "football",
      "aviationstack",
      "spotify",
      "openweather",
      "google",
      "facebook",
      "github"
    ];
  }

  @override
  void initState() {
    getUserProfileInformations().then((value) => {setState(() {})});
    getSubscribedServiceList()
        .then((value) => {_subscribed = value, setState(() {})});
    getConnectedServiceList()
        .then((value) => {_servicesConnected = value, setState(() {})});
  }

  void setNewUserInformation() {
    print(_username);
    print(_email);
    print(_location);
    print(_phone);
    sendPOSTRequest("URL", {
      'Content-Type': 'application/json',
      'jwt': User.getInstance().token
    }, {
      'email': _email,
      'username': _username,
      'location': _location,
      'phone': _phone
    });
  }

  Future<List> getConnectedServiceList() async {
    List request = await sendGETRequest(
        "http://" + requestUrl + ":8080/api/service/list_oauth",
        {'Accept': 'application/json', 'jwt': User.getInstance().token});
    if (request.first != 200) {
      showErrorAlert(context, request.last);
      return [];
    }
    print(request.last);
    if (request.last == "[]") return ([]);
    List decoded = jsonDecode(request.last);
    for (var elem in decoded) {
      _servicesConnected.add(elem);
    }
    return (_servicesConnected);
  }

  Future<List> getSubscribedServiceList() async {
    List request = await sendGETRequest(
        "http://" + requestUrl + ":8080/api/service/subscribe_list",
        {'Accept': 'application/json', 'jwt': User.getInstance().token});
    if (request.first != 200) {
      showErrorAlert(context, request.last);
      return [];
    }
    if (request.last == "[]") return ([]);
    Map decoded = jsonDecode(request.last);
    List str = decoded["services"];
    for (var elem in str) {
      _subscribed.add(elem);
    }
    return (_subscribed);
  }

  Future<void> getUserProfileInformations() async {
    List request = await sendGETRequest(
        "http://" + requestUrl + ":8080/api/user/infos",
        {'Accept': 'application/json', 'jwt': User.getInstance().token});
    if (request.first != 200) {
      showErrorAlert(context, request.last);
      return {};
    }
    if (request.last == "[]") return ({});
    Map decoded = jsonDecode(request.last);
    _username = decoded["username"];
    _email = decoded["email"];
    _location = "Toulouse, FR";
    _phone = "06 23 34 34 29";
  }

  Widget build(BuildContext context) {
    if (_username == "")
      return new Container(
        color: Colors.white,
      );
    return Scaffold(
      resizeToAvoidBottomInset: false,
      backgroundColor: Colors.white,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        title: Text('AREA'),
        iconTheme: IconThemeData(
          color: Color.fromRGBO(117, 149, 255, 1),
        ),
        actions: <Widget>[
          IconButton(
            icon: Icon(
              Icons.exit_to_app_sharp,
            ),
            onPressed: () {
              User.setInstance(token: null);
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => LoginPage()),
              );
            },
          )
        ],
      ),
      body: SingleChildScrollView(child: displayUserInformations(context)),
    );
  }

  Column displayUserInformations(BuildContext context) => Column(
        children: <Widget>[
          displayProfilePicture(context),
          servicesSubscribed([""]),
          servicesUnsubscribed(),
          profileInformations(context),
        ],
      );

  Column displayProfilePicture(BuildContext context) => Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Stack(children: [
              Padding(
                  padding: EdgeInsets.fromLTRB(
                      MediaQuery.of(context).size.width / 2 - 90, 10, 10, 30),
                  child: new Column(children: <Widget>[
                    Container(
                        width: 180,
                        height: 180,
                        decoration: new BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: Color.fromRGBO(117, 149, 255, 1),
                              width: 8,
                            ),
                            image: new DecorationImage(
                                fit: BoxFit.fill,
                                image:
                                    Image.memory(base64Decode(_profilePicture))
                                        .image))),
                  ])),
              Padding(
                padding: EdgeInsets.fromLTRB(
                    MediaQuery.of(context).size.width / 2 + 30, 150, 0, 0),
                child: FloatingActionButton(
                  child: Icon(Icons.upload_file),
                  backgroundColor: Color.fromRGBO(117, 149, 255, 1),
                  foregroundColor: Colors.white,
                  onPressed: setProfilePicture,
                ),
              ),
            ]),
            Stack(children: <Widget>[
              Padding(
                padding: EdgeInsets.fromLTRB(0, 10, 0, 0),
                child: Container(
                  width: MediaQuery.of(context).size.width,
                  height: 100,
                  decoration: ShapeDecoration(
                    color: Colors.blue,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.only(
                        bottomLeft: Radius.circular(70),
                      ),
                    ),
                  ),
                ),
              ),
              Container(
                width: MediaQuery.of(context).size.width,
                height: 65,
                decoration: ShapeDecoration(
                  color: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.only(
                      bottomLeft: Radius.circular(120),
                    ),
                  ),
                ),
              ),
              Center(
                child: new Column(children: <Widget>[
                  Text(_username,
                      style: TextStyle(
                          fontSize: 24,
                          color: Color.fromRGBO(117, 149, 255, 1),
                          fontWeight: FontWeight.bold)),
                  Text(_location,
                      style: TextStyle(
                        fontSize: 20,
                        color: Color.fromRGBO(117, 149, 255, 1),
                      )),
                ]),
              ),
            ]),
          ]);

  Column servicesSubscribed(List services) => Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Padding(
              padding: EdgeInsets.fromLTRB(25, 15, 0, 0),
              child: Container(
                width: MediaQuery.of(context).size.width,
                height: 40,
                child: const Text(
                  "Services subscribed to: ",
                  style: TextStyle(fontSize: 25),
                ),
              ),
            ),
            Wrap(
              direction: Axis.horizontal,
              children: loopSubscribedServices(),
            ),
          ]);

  Container subscribedItem(String serviceName) => Container(
        margin: EdgeInsets.fromLTRB(10, 5, 0, 10),
        padding: EdgeInsets.fromLTRB(13, 1, 0, 1),
        width: (serviceName.length * 10 + 85).toDouble(),
        height: 65,
        decoration: BoxDecoration(
            color: Colors.blue,
            borderRadius: BorderRadius.all(Radius.circular(25.0))),
        child: Row(
          children: [
            Text(serviceName, style: TextStyle(fontSize: 20)),
            IconButton(
              icon: Icon(Icons.close_sharp),
              onPressed: () async {
                List request = await sendDELETERequest(
                    "http://" +
                        requestUrl +
                        ":8080/api/service/unsubscribe_service",
                    User.getInstance().token,
                    {
                      'service': serviceName,
                    });
                if (request.first != 200) {
                  showErrorAlert(context, request.last);
                  return;
                }
                _subscribed.remove(serviceName);
                setState(() {});
              },
            )
          ],
        ),
      );

//Icons.favorite
  Column servicesUnsubscribed() => Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Padding(
              padding: EdgeInsets.fromLTRB(25, 15, 0, 0),
              child: Container(
                width: MediaQuery.of(context).size.width,
                height: 40,
                child: const Text(
                  "Services unsubscribed to: ",
                  style: TextStyle(fontSize: 25),
                ),
              ),
            ),
            Padding(
              padding: EdgeInsets.only(bottom: 35),
              child: Wrap(
                direction: Axis.horizontal,
                children: loopUnsubscribedServices(),
              ),
            )
          ]);

  Container unsubscribedItem(String serviceName) => Container(
        margin: EdgeInsets.fromLTRB(10, 5, 0, 10),
        padding: EdgeInsets.fromLTRB(13, 1, 0, 1),
        width: (serviceName.length * 10 + 85).toDouble(),
        height: 65,
        decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.all(Radius.circular(25.0)),
            border: Border.all(color: Colors.black)),
        child: Row(
          children: [
            Text(serviceName, style: TextStyle(fontSize: 20)),
            IconButton(
              icon: Icon(Icons.add_circle_outlined),
              onPressed: () async {
                if (oAuthServices.contains(serviceName) &&
                    !_servicesConnected.contains(serviceName)) {
                  int count = 0;
                  while (count < oAuthServices.length) {
                    if (oAuthServices[count] == serviceName) {
                      oAuthFunctions[count](context);
                    }
                    count += 1;
                  }
                }
                List request = await sendPOSTRequest(
                    "http://" +
                        requestUrl +
                        ":8080/api/service/subscribe_service",
                    {
                      'Accept': 'application/json',
                      'Content-type': 'application/json',
                      'jwt': User.getInstance().token
                    },
                    {
                      'service': serviceName,
                    });
                if (request.first != 200) {
                  showErrorAlert(context, request.last);
                  return;
                }
                _subscribed.add(serviceName);
                setState(() {});
              },
            )
          ],
        ),
      );

  Column profileInformations(BuildContext context) => Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Center(
                child: Text("Profile informations",
                    style: TextStyle(fontSize: 35))),
            Form(
              child: Column(
                children: [
                  formElement(
                      "Username", _username, setUsername, TextInputType.text),
                  formElement(
                      "Email:", _email, setEmail, TextInputType.emailAddress),
                  formElement(
                      "Location:", _location, setLocation, TextInputType.text),
                  formElement(
                      "Phone number:", _phone, setPhone, TextInputType.phone),
                ],
              ),
            ),
            Center(
              child: Padding(
                  padding: EdgeInsets.only(top: 15),
                  child: SizedBox(
                      width: MediaQuery.of(context).size.width / 3,
                      height: 55,
                      child: RaisedButton(
                        child: const Text('Submit'),
                        color: Colors.blue,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(15)),
                        onPressed: setNewUserInformation,
                      ))),
            )
          ]);

  Padding formElement(String elementName, String existingInfo,
          Function setValue, TextInputType inputType) =>
      Padding(
        padding: EdgeInsets.fromLTRB(30, 10, 30, 5),
        child: Column(
          children: [
            Text(elementName, style: TextStyle(fontSize: 20)),
            TextFormField(
              initialValue: existingInfo,
              autofocus: false,
              keyboardType: inputType,
              onChanged: (value) => setValue(value),
              decoration: InputDecoration(
                border: InputBorder.none,
                focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(25),
                    borderSide: BorderSide(color: Colors.blue)),
                enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(25),
                    borderSide: BorderSide(color: Colors.black)),
              ),
            ),
          ],
        ),
      );

  List<Widget> loopUnsubscribedServices() {
    List<Widget> list = new List();
    for (String service in _serviceList) {
      if (!_subscribed.contains(service)) list.add(unsubscribedItem(service));
    }
    return (list);
  }

  List<Widget> loopSubscribedServices() {
    List<Widget> list = new List();
    for (String service in _serviceList) {
      if (_subscribed.contains(service)) list.add(subscribedItem(service));
    }
    return (list);
  }

  void setUsername(String username) {
    _username = username;
  }

  void setEmail(String email) {
    _email = email;
  }

  void setLocation(String location) {
    _location = location;
  }

  void setPhone(String phone) {
    _phone = phone;
  }

  void setProfilePicture() async {
    var image = await ImagePicker.pickImage(source: ImageSource.gallery);
    List<int> imageBytes = image.readAsBytesSync();
    String base64Image = base64Encode(imageBytes);
    _profilePicture = base64Image;
    setState(() {});
  }
}
