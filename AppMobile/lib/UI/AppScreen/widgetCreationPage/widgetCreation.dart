import 'dart:convert';

import 'package:AppMobile/Logic/UserWidgets/userWidgets.dart';
import 'package:AppMobile/Logic/WidgetsAction/widgetAction.dart';
import 'package:AppMobile/Logic/WidgetsReaction/widgetReaction.dart';
import 'package:AppMobile/Logic/request.dart';
import 'package:AppMobile/Models/const.dart';
import 'package:AppMobile/Models/userClass.dart';
import 'package:AppMobile/UI/Popup/showErrorAlert.dart';
import 'package:carousel_slider/carousel_options.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

final List<String> servicesImg = [
  'assets/images/google.png',
  'assets/images/fb.png',
  'assets/images/github.png',
  'assets/images/openW.jpeg',
  'assets/images/spotify.png',
  'assets/images/Archive_logo.png',
  'assets/images/foot.jpeg',
];

final List<String> servicesName = [
  "google",
  "facebook",
  "github",
  "openWeather",
  "spotify",
  "avionStack",
  "football"
];

final List<String> servicesTimer = [
  "50",
  "100",
  "300",
  "500",
];

class WidgetCreation extends StatefulWidget {
  WidgetCreation({Key key}) : super(key: key);

  @override
  _WidgetCreationState createState() => _WidgetCreationState();
}

class _WidgetCreationState extends State<WidgetCreation> {
  WidgetAction widgetAction = new WidgetAction();
  WidgetReaction widgetReaction = new WidgetReaction();
  WidgetServices userWidgets = new WidgetServices();
  int _serviceIndex = 0;
  int _serviceActionIndex = 0;
  List _servicesConnected = [];
  int _serviceReactionIndex = 0;
  int _serviceTimerIndex = 0;
  bool widgetArgActive = false;
  List<List<String>> widgetsAction;
  List<List<String>> widgetsReaction;
  final widgetName = TextEditingController();
  final widgetArg = TextEditingController();

  @override
  void initState() {
    super.initState();

    widgetsAction = [
      widgetAction.widgetGoogleAction,
      widgetAction.widgetFacebookAction,
      widgetAction.widgetGithubAction,
      widgetAction.widgetOpenWeatherAction,
      widgetAction.widgetSpotifyAction,
      widgetAction.widgetArchiveAction,
      widgetAction.widgetFootAction,
    ];

    widgetsReaction = [
      widgetReaction.widgetGoogleReaction,
      widgetReaction.widgetFacebookReaction,
      widgetReaction.widgetGithubReaction,
      widgetReaction.widgetOpenWeatherReaction,
      widgetReaction.widgetSpotifyReaction,
      widgetReaction.widgetArchiveReaction,
      widgetReaction.widgetFootReaction,
    ];
    getConnectedServiceList().then((value) => {setState(() {})});
  }

  void clearData() {
    widgetName.clear();
    widgetArg.clear();
    _serviceIndex = 0;
    _serviceActionIndex = 0;
    _serviceReactionIndex = 0;
  }

  Future<void> getConnectedServiceList() async {
    List request = await sendGETRequest(
        "http://" + requestUrl + ":8080/api/service/list_oauth",
        {'Accept': 'application/json', 'jwt': User.getInstance().token});

    if (request.first != 200) {
      showErrorAlert(context, request.last);
      return;
    }
    if (request.last == "[]") return;
    List decoded = jsonDecode(request.last);
    for (var elem in decoded) {
      _servicesConnected.add(elem);
    }
    return;
  }

  String googleFctId() {
    if (!_servicesConnected.contains("google")) {
      showErrorAlert(context, 'You need to connect your google account');
      return ("1");
    }
    if (_serviceReactionIndex == 0) {
      return ("31");
    } else if (_serviceReactionIndex == 1) {
      if (widgetArg.text.isEmpty) {
        showErrorAlert(context, 'You need to enter an email target');
        return ("1");
      }
      return ("32");
    }
    return ("1");
  }

  String spotifyFctId() {
    if (!_servicesConnected.contains("spotify")) {
      showErrorAlert(context, 'You need to connect your spotify account');
      return ("1");
    }
    if (_serviceReactionIndex == 0 && _serviceActionIndex == 0) {
      return ("51");
    } else if (_serviceReactionIndex == 1 && _serviceActionIndex == 1) {
      if (widgetArg.text.isEmpty) {
        showErrorAlert(context, 'You need to enter an artist name');
      }
      return ("52");
    } else {
      showErrorAlert(context,
          'Plase change the reaction, it\'s not compatible with this action');
      return ("1");
    }
  }

  String avionStackFctId() {
    if (widgetArg.text.isEmpty) {
      showErrorAlert(
          context,
          (_serviceActionIndex == 0
              ? 'You need to enter an airport name'
              : 'You need to enter a flight number'));
      return ("1");
    } else {
      if (_serviceActionIndex == 0) {
        return ("61");
      } else if (_serviceActionIndex == 1) {
        return ("62");
      }
    }
    return ("1");
  }

  String footballFctId() {
    if (_serviceReactionIndex == 0 && _serviceActionIndex == 0) {
      return ("71");
    } else if (_serviceReactionIndex == 1 && _serviceActionIndex == 1) {
      if (widgetArg.text.isEmpty) {
        showErrorAlert(context,
            'You need to enter a league code. Example:\n\n    Ligue 1 = 46\n    Premier League = 25\n    Bundesligua = 114\n    Liga = 74\n    Serie A = 73');
        return ("1");
      }
      return ("72");
    } else {
      showErrorAlert(context,
          'Plase change the reaction, it\'s not compatible with this action');
      return ("1");
    }
  }

  String facebookFctId() {
    if (!_servicesConnected.contains("facebook")) {
      showErrorAlert(context, 'You need to connect your facebook account');
      return ("1");
    }
    if (widgetArg.text.isEmpty) {
      return ("21");
    } else {
      showErrorAlert(context, 'You need to enter a facebook group name');
      return ("1");
    }
  }

  String githubFctId() {
    if (!_servicesConnected.contains("github")) {
      showErrorAlert(context, 'You need to connect your github account');
      return ("1");
    }
    if (_serviceActionIndex == 0 && _serviceReactionIndex == 0) {
      return ("41");
    } else if (_serviceActionIndex == 1 && _serviceReactionIndex == 1) {
      if (widgetArg.text.isEmpty) {
        showErrorAlert(context, 'You need to enter a github repository name');
        return ("1");
      }
      return ("42");
    } else {
      showErrorAlert(context,
          'Plase change the reaction, it\'s not compatible with this action');
      return ("1");
    }
  }

  String openWeatherFctId() {
    if (widgetArg.text.isEmpty) {
      showErrorAlert(context, 'You need to enter the city of your choice');
      return ("1");
    } else {
      return ("81");
    }
  }

  void saveWidget() async {
    if (widgetName.text.isEmpty) {
      showErrorAlert(context, 'You need to enter a widget name');
      return;
    }
    String fctId = "1";
    switch (_serviceIndex) {
      case 0:
        fctId = googleFctId();
        if (fctId == "1") return;
        break;
      case 1:
        fctId = facebookFctId();
        if (fctId == "1") return;
        break;
      case 2:
        fctId = githubFctId();
        if (fctId == "1") return;
        break;
      case 3:
        fctId = openWeatherFctId();
        if (fctId == "1") return;
        break;
      case 4:
        fctId = spotifyFctId();
        if (fctId == "1") return;
        break;
      case 5:
        fctId = avionStackFctId();
        if (fctId == "1") return;
        break;
      case 6:
        fctId = footballFctId();
        if (fctId == "1") return;
        break;
      default:
        print('Error');
    }
    final _body = (widgetArg.text.isEmpty
        ? {
            "name": widgetName.text,
            "service": servicesName[_serviceIndex],
            "fctId": fctId,
            "timer": int.parse(servicesTimer[_serviceTimerIndex])
          }
        : {
            'name': widgetName.text,
            'service': servicesName[_serviceIndex],
            'fctId': fctId,
            'timer': int.parse(servicesTimer[_serviceTimerIndex]),
            'args': [widgetArg.text]
          });
    print(_body);
    final response = await sendPOSTRequest(
      'http://' + requestUrl + ':8080/api/composant/subscribe_composant',
      {'Content-type': 'application/json', 'jwt': User.getInstance().token},
      _body,
    );
    if (response.first == 200) {
      showSuccessAlert(context, 'The widget has been successfuly created !');
    } else {
      showErrorAlert(context, 'An error occured...');
    }
    print('Response: $response');
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Container(
      child: Center(
        child: SingleChildScrollView(
          child: Column(
            children: <Widget>[
              Container(
                child: Column(
                  children: <Widget>[
                    Container(
                      alignment: Alignment.bottomLeft,
                      margin:
                          EdgeInsets.only(top: 40.0, bottom: 15.0, left: 20.0),
                      child: Text(
                        'Select a service :',
                        textAlign: TextAlign.left,
                        style: TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 20.0),
                      ),
                    ),
                    Container(
                      child: Column(
                        children: <Widget>[
                          CarouselSlider(
                            options: CarouselOptions(
                              onPageChanged: (index, imageSliders) {
                                setState(() {
                                  _serviceIndex = index;
                                  widgetArgActive = false;
                                  if (_serviceIndex == 5) {
                                    widgetArgActive = true;
                                  } else if (_serviceIndex == 1) {
                                    widgetArgActive = true;
                                  } else if (_serviceIndex == 2) {
                                    widgetArgActive = true;
                                  } else if (_serviceIndex == 3) {
                                    widgetArgActive = true;
                                  }
                                });
                              },
                              height: 200,
                              autoPlay: false,
                              aspectRatio: 2.0,
                              enlargeCenterPage: true,
                              viewportFraction: 0.8,
                            ),
                            items: imageSliders,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                child: Column(
                  children: <Widget>[
                    Container(
                      alignment: Alignment.bottomLeft,
                      margin:
                          EdgeInsets.only(top: 15.0, bottom: 15.0, left: 20.0),
                      child: Text(
                        'Enter a widget name :',
                        textAlign: TextAlign.left,
                        style: TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 20.0),
                      ),
                    ),
                    Container(
                      width: size.width * 0.8,
                      margin: EdgeInsets.only(top: 15.0, bottom: 15.0),
                      child: TextField(
                        controller: widgetName,
                        decoration: new InputDecoration(
                          border: OutlineInputBorder(
                            borderRadius: const BorderRadius.all(
                              const Radius.circular(30.0),
                            ),
                          ),
                          hintText: 'Widget Name',
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                child: Column(
                  children: <Widget>[
                    Container(
                      alignment: Alignment.bottomLeft,
                      margin:
                          EdgeInsets.only(top: 15.0, bottom: 15.0, left: 20.0),
                      child: Text(
                        'Select a widget action :',
                        textAlign: TextAlign.left,
                        style: TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 20.0),
                      ),
                    ),
                    Container(
                      child: Column(
                        children: <Widget>[
                          CarouselSlider(
                            options: CarouselOptions(
                              onPageChanged: (index, textSilder) {
                                setState(() {
                                  _serviceActionIndex = index;
                                });
                              },
                              height: 65,
                              autoPlay: false,
                              aspectRatio: 2.0,
                              enlargeCenterPage: true,
                              enableInfiniteScroll: false,
                              viewportFraction: 0.8,
                            ),
                            items: textSlider(
                              context,
                              widgetsAction[_serviceIndex],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                child: Column(
                  children: <Widget>[
                    Container(
                      alignment: Alignment.bottomLeft,
                      margin:
                          EdgeInsets.only(top: 15.0, bottom: 15.0, left: 20.0),
                      child: Text(
                        'Select a widget reaction :',
                        textAlign: TextAlign.left,
                        style: TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 20.0),
                      ),
                    ),
                    Container(
                      child: Column(
                        children: <Widget>[
                          CarouselSlider(
                            options: CarouselOptions(
                              onPageChanged: (index, textSilder) {
                                setState(
                                  () {
                                    _serviceReactionIndex = index;
                                    if (_serviceIndex == 0) {
                                      widgetArgActive =
                                          (_serviceReactionIndex == 1
                                              ? true
                                              : false);
                                      if (widgetArgActive == false) {
                                        widgetArg.clear();
                                      }
                                    } else if (_serviceIndex == 4) {
                                      widgetArgActive =
                                          (_serviceReactionIndex == 1
                                              ? true
                                              : false);
                                      if (widgetArgActive == false) {
                                        widgetArg.clear();
                                      }
                                    } else if (_serviceIndex == 6) {
                                      widgetArgActive =
                                          (_serviceReactionIndex == 1
                                              ? true
                                              : false);
                                      if (widgetArgActive == false) {
                                        widgetArg.clear();
                                      }
                                    }
                                  },
                                );
                              },
                              height: 65,
                              autoPlay: false,
                              aspectRatio: 2.0,
                              enlargeCenterPage: true,
                              enableInfiniteScroll: false,
                              viewportFraction: 0.8,
                            ),
                            items: textSlider(
                              context,
                              widgetsReaction[_serviceIndex],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              Visibility(
                visible: widgetArgActive,
                child: Container(
                  child: Column(
                    children: <Widget>[
                      Container(
                        alignment: Alignment.bottomLeft,
                        margin: EdgeInsets.only(
                            top: 15.0, bottom: 15.0, left: 20.0),
                        child: Text(
                          'Enter a widget argument :',
                          textAlign: TextAlign.left,
                          style: TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 20.0),
                        ),
                      ),
                      Container(
                        width: size.width * 0.8,
                        margin: EdgeInsets.only(top: 15.0, bottom: 15.0),
                        child: TextField(
                          controller: widgetArg,
                          decoration: new InputDecoration(
                            border: OutlineInputBorder(
                              borderRadius: const BorderRadius.all(
                                const Radius.circular(30.0),
                              ),
                            ),
                            hintText: 'Widget arg',
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Container(
                child: Column(
                  children: <Widget>[
                    Container(
                      alignment: Alignment.bottomLeft,
                      margin:
                          EdgeInsets.only(top: 15.0, bottom: 15.0, left: 20.0),
                      child: Text(
                        'Select a widget timer in secondes :',
                        textAlign: TextAlign.left,
                        style: TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 20.0),
                      ),
                    ),
                    Container(
                      child: Column(
                        children: <Widget>[
                          CarouselSlider(
                            options: CarouselOptions(
                              onPageChanged: (index, textSilder) {
                                setState(() {
                                  _serviceTimerIndex = index;
                                });
                              },
                              height: 50,
                              autoPlay: false,
                              aspectRatio: 2.0,
                              enlargeCenterPage: true,
                              enableInfiniteScroll: false,
                              viewportFraction: 0.8,
                            ),
                            items: textSlider(context, servicesTimer),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                margin: EdgeInsets.only(top: 35.0, bottom: 25.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    Container(
                      height: 40.0,
                      width: 100.0,
                      margin: EdgeInsets.only(right: 10.0),
                      child: RaisedButton(
                        onPressed: () {
                          clearData();
                        },
                        shape: RoundedRectangleBorder(
                            borderRadius: new BorderRadius.circular(30.0)),
                        child:
                            const Text('Clear', style: TextStyle(fontSize: 20)),
                      ),
                    ),
                    Container(
                      height: 40.0,
                      width: 120.0,
                      margin: EdgeInsets.only(left: 10.0),
                      child: RaisedButton(
                        onPressed: () {
                          saveWidget();
                        },
                        shape: RoundedRectangleBorder(
                            borderRadius: new BorderRadius.circular(30.0)),
                        color: Colors.blue,
                        child: Container(
                          decoration: const BoxDecoration(),
                          child: const Text('Create',
                              style:
                                  TextStyle(fontSize: 20, color: Colors.white)),
                        ),
                      ),
                    ),
                  ],
                ),
              )
            ],
          ),
        ),
      ),
    );
  }

  final List<Widget> imageSliders = servicesImg
      .map((item) => Container(
            child: Container(
              margin: EdgeInsets.all(5.0),
              child: ClipRRect(
                  borderRadius: BorderRadius.all(Radius.circular(5.0)),
                  child: Stack(
                    children: <Widget>[
                      Image(
                        image: AssetImage(item),
                        fit: BoxFit.cover,
                        width: 1000.0,
                      ),
                      Positioned(
                        bottom: 0.0,
                        left: 0.0,
                        right: 0.0,
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                Color.fromARGB(200, 0, 0, 0),
                                Color.fromARGB(0, 0, 0, 0)
                              ],
                              begin: Alignment.bottomCenter,
                              end: Alignment.topCenter,
                            ),
                          ),
                          padding: EdgeInsets.symmetric(
                              vertical: 10.0, horizontal: 20.0),
                          child: Text(
                            '${servicesName[servicesImg.indexOf(item)]}',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 20.0,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ],
                  )),
            ),
          ))
      .toList();

  List<Widget> textSlider(context, List<String> contentList) {
    return (contentList
        .map((item) => Container(
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.blue,
                  borderRadius: const BorderRadius.all(
                    const Radius.circular(30.0),
                  ),
                ),
                padding: EdgeInsets.symmetric(vertical: 10.0, horizontal: 20.0),
                child: Text(
                  '$item',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20.0,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ))
        .toList());
  }
}
