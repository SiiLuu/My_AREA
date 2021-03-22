import 'dart:async';

import 'package:http/http.dart' as http;
import 'package:AppMobile/UI/Popup/showErrorAlert.dart';
import 'package:AppMobile/Models/userClass.dart';
import 'package:AppMobile/Models/const.dart';
import 'dart:convert';

Future<List> sendGETRequest(String url, var _header) async {
  final response = await http.get(url, headers: _header);
  return ([response.statusCode, response.body]);
}

Future<List> sendPOSTRequest(String url, var _header, var _body) async {
  final response =
      await http.post(url, headers: _header, body: jsonEncode(_body));
  return ([response.statusCode, response.body]);
}

Future<List> sendDELETERequest(String url, var _token, var _body) async {
  final client = http.Client();
  final response = await client.send(http.Request("DELETE", Uri.parse(url))
    ..headers["Accept"] = "application/json"
    ..headers["Content-type"] = "application/json"
    ..headers["jwt"] = _token
    ..body = json.encode(_body));
  client.close();
  return ([response.statusCode, response.stream]);
}

Future sendOAuth(String oauth, String id, String refreshToken) async {
  var header;
  var body;
  if (User.getInstance() == null || User.getInstance().token == null)
    header = {'Content-Type': 'application/json'};
  else
    header = {
      'Content-Type': 'application/json',
      'jwt': User.getInstance().token
    };
  if (id == "id") {
    body = {'oauth': oauth, 'id': '', 'refresh_token': refreshToken};
  } else {
    body = {'oauth': oauth, 'id': id, 'refresh_token': refreshToken};
  }
  print("HEADER");
  print(header);
  print("BODY");
  print(body);
  final response = await sendPOSTRequest(
      "http://" + requestUrl + ":8080/api/user/oauth", header, body);
  print("RESPONSE OAUTH");
  print(response.first);
  print(response.last);
  if (response.first != 200) {
    return false;
  } else {
    if (response.last != "")
      User.setInstance(token: jsonDecode(response.last)["token"]);
  }
  return (User.getInstance().token);
}
