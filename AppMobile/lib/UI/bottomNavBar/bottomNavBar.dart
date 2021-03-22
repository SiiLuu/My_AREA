import 'package:AppMobile/UI/AppScreen/appNavigation.dart';
import 'package:AppMobile/UI/AppScreen/widgetCreationPage/widgetCreation.dart';
import 'package:AppMobile/UI/AppScreen/widgetPage/userWidgets.dart';
import 'package:AppMobile/Models/userClass.dart';
import 'package:AppMobile/Models/const.dart';
import 'package:AppMobile/UI/ProfilPage/userProfil.dart';
import 'package:flutter/material.dart';
import 'dart:convert';

/// This is the stateful widget that the main application instantiates.
class BottomNavBar extends StatefulWidget {
  BottomNavBar({Key key}) : super(key: key);

  @override
  _BottomNavBar createState() => _BottomNavBar();
}

/// This is the private State class that goes with MyStatefulWidget.
class _BottomNavBar extends State<BottomNavBar> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      resizeToAvoidBottomInset: false,
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: new Center(child: new Text('AREA', textAlign: TextAlign.center)),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.only(
            bottomLeft: Radius.circular(70),
          ),
        ),
        actions: <Widget>[
          Padding(
              padding: EdgeInsets.only(right: 20.0),
              child: GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => UserProfile()),
                  );
                },
                child: new Container(
                  width: 40,
                  height: 40,
                  decoration: new BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: Colors.white,
                        width: 4,
                      ),
                      image: new DecorationImage(
                          fit: BoxFit.fill,
                          image: Image.memory(base64Decode(profilePicture))
                              .image)),
                  alignment: Alignment.center,
                ),
              )),
        ],
      ),
      body: IndexedStack(
        index: _selectedIndex,
        children: [
          for (final tabItem in TabNavigationItem.items) tabItem.page,
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: Colors.blue,
        showSelectedLabels: false,
        showUnselectedLabels: false,
        currentIndex: _selectedIndex,
        onTap: (int index) => setState(() => _selectedIndex = index),
        items: [
          for (final tabItem in TabNavigationItem.items)
            BottomNavigationBarItem(
              icon: tabItem.icon,
              title: tabItem.title,
            )
        ],
      ),
    );
  }
}
