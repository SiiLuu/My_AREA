import 'dart:convert';

import 'package:AppMobile/Logic/UserWidgets/userWidgets.dart';
import 'package:AppMobile/Models/const.dart';
import 'package:AppMobile/Models/userClass.dart';
import 'package:AppMobile/Models/widgetClass.dart';
import 'package:AppMobile/UI/Popup/showErrorAlert.dart';
import 'package:flutter/material.dart';

class WidgetPage extends StatefulWidget {
  WidgetPage({Key key}) : super(key: key);

  @override
  _WidgetPage createState() => _WidgetPage();
}

class _WidgetPage extends State<WidgetPage> {
  Future<List<Widgets>> getLocalWidgets(BuildContext context) async {
    WidgetServices widgetsServ = WidgetServices();
    List<Widgets> userWidgets = await widgetsServ.getWidgets(context);
    return (userWidgets);
  }

  String getService(String fctId) {
    if (fctId == "21" || fctId == "22")
      return ("Facebook");
    else if (fctId == "31" || fctId == "32")
      return ("Google");
    else if (fctId == "41" || fctId == "42")
      return ("GitHub");
    else if (fctId == "51" || fctId == "52")
      return ("Spotify");
    else if (fctId == "61" || fctId == "62")
      return ("AviationStack");
    else if (fctId == "71" || fctId == "72")
      return ("Football");
    else if (fctId == "81") return ("OpenWeather");
  }

  String getAction(String fctId) {
    switch (fctId) {
      case "21":
        return ("Track a facebook group activity.");
        break;
      case "31":
        return ("Track the last email.");
        break;
      case "32":
        return ("Track the last email.");
        break;
      case "41":
        return ("Track if a user create a repository.");
        break;
      case "42":
        return ("Track the activity of a repository.");
        break;
      case "51":
        return ("check if a user is following a new playlist.");
        break;
      case "52":
        return ("Track a user when he create a playlist.");
        break;
      case "61":
        return ("Follow an airport activity.");
        break;
      case "62":
        return ("Follow a flight activity.");
        break;
      case "71":
        return ("Live's scores.");
        break;
      case "72":
        return ("Live scores of a particular league.");
        break;
      case "81":
        return ("Track a city temperature.");
        break;
      default:
        return ("An error occured.");
    }
  }

  String getReaction(String fctId) {
    switch (fctId) {
      case "21":
        return ("Send an email when there is a new activity.");
        break;
      case "31":
        return ("Reply to the email that we are unavailable .");
        break;
      case "32":
        return ("Put the last mail in the trash.");
        break;
      case "41":
        return ("Star the new repository.");
        break;
      case "42":
        return ("Notify the user when there is a new push.");
        break;
      case "51":
        return ("Add to your library all the sounds of your top artists in the playlist.");
        break;
      case "52":
        return ("Add the top tracks of a specified artist to the playlist.");
        break;
      case "61":
        return ("Send an email when there is a new data.");
        break;
      case "62":
        return ("Send an email when there is a new data.");
        break;
      case "71":
        return ("Send a notification as soon as there is a goal.");
        break;
      case "72":
        return ("Sends an email if a match changes status in a particular division.");
        break;
      case "81":
        return ("Send a notification if the temperature drops under 10°c.");
        break;
      default:
        return ("An error occured.");
    }
  }

  Widget userWidgetsList(BuildContext context) {
    return FutureBuilder(
      future: getLocalWidgets(context),
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          if (snapshot.data.length == 0) {
            return (Container(
              child: Text('You don\'t have widgets'),
            ));
          } else {
            return ListView.builder(
              itemCount: snapshot.data.length,
              itemBuilder: (context, index) {
                return Container(
                  child: WidgetCard(
                    name: snapshot.data[index].name,
                    service: getService(snapshot.data[index].fctId),
                    timer: snapshot.data[index].timer,
                    id: snapshot.data[index].fctId,
                    action: getAction(snapshot.data[index].fctId),
                    reaction: getReaction(snapshot.data[index].fctId),
                  ),
                );
              },
            );
          }
        } else if (snapshot.hasError) {
          return Text("${snapshot.error}");
        } else {
          return (Container(
            child: Text('You don\'t have widgets'),
          ));
        }
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: userWidgetsList(context),
      ),
    );
  }
}

class WidgetCard extends StatefulWidget {
  final String name;
  final String service;
  final int timer;
  final String id;
  final String action;
  final String reaction;
  WidgetCard(
      {Key key,
      @required this.name,
      @required this.service,
      @required this.timer,
      @required this.id,
      @required this.action,
      @required this.reaction})
      : super(key: key);

  @override
  _WidgetCardState createState() => _WidgetCardState(
      name: name,
      service: service,
      timer: timer,
      id: id,
      action: action,
      reaction: reaction);
}

class _WidgetCardState extends State<WidgetCard> {
  final String name;
  final String service;
  final int timer;
  final String id;
  final String action;
  final String reaction;
  _WidgetCardState(
      {@required this.name,
      @required this.service,
      @required this.timer,
      @required this.id,
      @required this.action,
      @required this.reaction});

  void unsubscribeComposant(String id) async {
    WidgetServices widgetsServ = WidgetServices();
    final response = await widgetsServ.unsubscribe(
        'http://' + requestUrl + ':8080/api/composant/unsubscribe_composant',
        User.getInstance().token,
        {'fctId': id});
    if (response.first == 200) {
      showSuccessAlert(context, 'Your widget has been succesfuly deleted !');
    } else {
      showErrorAlert(context, 'An error occured...');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(15.0),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.only(
            bottomLeft: Radius.circular(12.0),
            bottomRight: Radius.circular(12.0)),
        border: Border.all(color: Colors.blue, width: 2),
      ),
      child: Column(
        children: <Widget>[
          Container(
            decoration: BoxDecoration(
              color: Colors.lightBlue,
              border: Border(bottom: BorderSide(color: Colors.blue, width: 2)),
            ),
            padding: const EdgeInsets.only(left: 15),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text(
                        name,
                        textAlign: TextAlign.left,
                        style: TextStyle(
                            fontSize: 20, fontWeight: FontWeight.bold),
                      ),
                      Text('from $service\' service'),
                    ],
                  ),
                ),
                IconButton(
                  padding: const EdgeInsets.only(right: 15, top: 10, bottom: 0),
                  icon: Icon(Icons.delete),
                  onPressed: () {
                    unsubscribeComposant(id);
                  },
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.all(15),
            child: Column(
              children: <Widget>[
                Container(
                  alignment: Alignment.centerLeft,
                  padding: EdgeInsets.only(bottom: 10),
                  child: Row(
                    children: <Widget>[
                      Container(
                        height: MediaQuery.of(context).size.height * 0.05,
                        alignment: Alignment.topLeft,
                        child: Text(
                          'Widget action : ',
                          textAlign: TextAlign.left,
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ),
                      Container(
                        width: MediaQuery.of(context).size.width * 0.5,
                        height: MediaQuery.of(context).size.height * 0.05,
                        child: Text(
                          '$action',
                          textAlign: TextAlign.left,
                        ),
                      )
                    ],
                  ),
                ),
                Container(
                  alignment: Alignment.centerLeft,
                  padding: EdgeInsets.only(bottom: 10),
                  child: Row(
                    children: <Widget>[
                      Container(
                        height: MediaQuery.of(context).size.height * 0.05,
                        alignment: Alignment.topLeft,
                        child: Text(
                          'Widget reaction : ',
                          textAlign: TextAlign.left,
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ),
                      Container(
                        width: MediaQuery.of(context).size.width * 0.5,
                        height: MediaQuery.of(context).size.height * 0.05,
                        child: Text(
                          '$reaction',
                          textAlign: TextAlign.left,
                        ),
                      )
                    ],
                  ),
                ),
                Container(
                  alignment: Alignment.centerLeft,
                  padding: EdgeInsets.only(bottom: 10),
                  child: Row(
                    children: <Widget>[
                      Text(
                        'This widget is refreshed each ',
                        textAlign: TextAlign.left,
                      ),
                      Text(
                        '$timer sec',
                        textAlign: TextAlign.left,
                        style: TextStyle(fontWeight: FontWeight.bold),
                      )
                    ],
                  ),
                )
              ],
            ),
          ),
        ],
      ),
    );
  }
}
