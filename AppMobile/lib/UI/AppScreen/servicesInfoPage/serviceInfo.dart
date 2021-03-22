import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

class ServiceInfo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return _buildList(context);
  }

  // #docregion list
  Widget _buildList(BuildContext context) => ListView(
        children: [
          Padding(
              padding: EdgeInsets.fromLTRB(30, 10, 10, 20),
              child: Text(
                "Services information",
                style: TextStyle(fontSize: 30),
                textAlign: TextAlign.center,
              )),
          serviceContainer('Facebook', "assets/images/fb.png",
              ["Track activity for a Facebook group"]),
          serviceContainer(
              'Google', "assets/images/google.png", ["Track the last email"]),
          serviceContainer('Github', "assets/images/github.png", [
            "Track if user creates a repository",
            "Track push activity for a repository"
          ]),
          serviceContainer('Spotify', "assets/images/spotify.png", [
            "Track user following a playlist",
            "Track user creating a playlist"
          ]),
          serviceContainer('AeroData', "assets/images/aeroData.png", [
            "Follow the activity of an airport",
            "Follow the activity of a flight"
          ]),
          serviceContainer('Football', "assets/images/foot.jpeg",
              ["Game live score", "Lives scores in a particular league"]),
          serviceContainer('Weather', "assets/images/openW.jpeg",
              ["Track temperature of a city"]),
        ],
      );

  Container serviceContainer(String serviceName, String icon, List widgets) =>
      Container(
        margin: EdgeInsets.all(10),
        padding: EdgeInsets.all(10),
        alignment: Alignment.center,
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey, width: 3.0),
          borderRadius: BorderRadius.all(Radius.circular(10.0)),
        ),
        child: widgetDisplay(serviceName, icon, widgets),
      );

  Column widgetDisplay(String service, String icon, List widgets) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Row(children: <Widget>[
            Image.asset(icon, width: 80),
            Padding(
                padding: EdgeInsets.fromLTRB(30, 30, 10, 20),
                child: Text(service, style: TextStyle(fontSize: 40))),
          ]),
          Padding(
              padding: EdgeInsets.fromLTRB(10, 10, 10, 5),
              child: Text(
                  "By subscribing to this service you will be able to: ",
                  style: TextStyle(fontSize: 18))),
          widget(widgets[0]),
          if (widgets.length >= 2) widget(widgets[1]),
          if (widgets.length == 3) widget(widgets[2]),
        ],
      );

  Container widget(String widgetName) => Container(
        margin: EdgeInsets.all(10),
        padding: EdgeInsets.all(10),
        alignment: Alignment.center,
        decoration: BoxDecoration(
            color: Colors.lightBlue,
            border: Border.all(color: Colors.blue, width: 3.0),
            borderRadius: BorderRadius.all(Radius.circular(10.0)),
            boxShadow: [
              BoxShadow(
                  blurRadius: 5, color: Colors.black, offset: Offset(1, 3))
            ]),
        child: Text(widgetName),
      );
}
