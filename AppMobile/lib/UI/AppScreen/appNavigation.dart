import 'package:AppMobile/UI/AppScreen/servicesInfoPage/serviceInfo.dart';
import 'package:AppMobile/UI/AppScreen/widgetCreationPage/widgetCreation.dart';
import 'package:AppMobile/UI/AppScreen/widgetPage/userWidgets.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class TabNavigationItem {
  final Widget page;
  final Widget title;
  final Container icon;

  TabNavigationItem({
    @required this.page,
    @required this.title,
    @required this.icon,
  });

  static List<TabNavigationItem> get items => [
        TabNavigationItem(
          page: WidgetPage(),
          icon: Container(
            child: Icon(
              Icons.home,
              color: Colors.white,
            ),
          ),
          title: Text("widgets"),
        ),
        TabNavigationItem(
          page: WidgetCreation(),
          icon: Container(
            height: 40,
            width: 40,
            child: Icon(
              Icons.add,
              color: Colors.blue,
            ),
            decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.all(Radius.circular(40)),
                border: Border.all(
                    width: 3, color: Colors.white, style: BorderStyle.solid)),
          ),
          title: Text("creation"),
        ),
        TabNavigationItem(
          page: ServiceInfo(),
          icon: Container(
            child: Icon(
              Icons.folder,
              color: Colors.white,
            ),
          ),
          title: Text("services"),
        ),
      ];
}
