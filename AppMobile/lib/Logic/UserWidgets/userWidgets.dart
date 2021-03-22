import 'dart:convert';
import 'package:AppMobile/Logic/request.dart';
import 'package:AppMobile/Models/const.dart';
import 'package:AppMobile/Models/userClass.dart';
import 'package:AppMobile/Models/widgetClass.dart';
import 'package:http/http.dart' as http;

class WidgetServices {
  Future<List<Widgets>> getWidgets(context) async {
    var widgetsArrayObjsJson = await http.get(
        'http://' + requestUrl + ':8080/api/composant/composant_list',
        headers: {
          'Accept': 'application/json',
          'jwt': User.getInstance().token
        });
    var widgetsObjsJson =
        jsonDecode(widgetsArrayObjsJson.body)['composant'] as List;
    List<Widgets> widgetsObjs = widgetsObjsJson
        .map((widgetsJson) => Widgets.fromJson(widgetsJson))
        .toList();
    return (widgetsObjs);
  }

  Future<List<dynamic>> unsubscribe(
      String url, String _token, var _body) async {
    final result = await sendDELETERequest(url, _token, _body);
    return (result);
  }
}
