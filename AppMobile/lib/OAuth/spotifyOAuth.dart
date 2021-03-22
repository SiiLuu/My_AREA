import 'dart:convert';

import 'package:AppMobile/Logic/request.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_web_auth/flutter_web_auth.dart';
import 'package:http/http.dart' as http;

Future<String> spotifyOAuth(BuildContext context) async {
  print("Spotify oAuth");
// Present the dialog to the user
  final result = await FlutterWebAuth.authenticate(
    url:
        "https://accounts.spotify.com/authorize?client_id=e2fdfa4a93c04eb48b41897f5bfc9b63&response_type=code&redirect_uri=area:/&scope=user-read-private%20user-read-email&state=123",
    callbackUrlScheme: "area",
  );

// Extract token from resulting url
  final code = Uri.parse(result).queryParameters['code'];

  String basicAuth = 'Basic ' +
      base64Encode(utf8.encode(
          'e2fdfa4a93c04eb48b41897f5bfc9b63:152ee1f7ec384835af9309a8a7b24a54'));
  final response = await http.post('https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': basicAuth,
        'Content-type': 'application/x-www-form-urlencoded'
      },
      encoding: Encoding.getByName("utf-8"),
      body: {
        'grant_type': "authorization_code",
        'code': code,
        'redirect_uri': 'area:/'
      });
  final accesToken = jsonDecode(response.body)['access_token'];
  final refreshToken = jsonDecode(response.body)['refresh_token'];
  await sendOAuth("spotify", "id", refreshToken);
  return (code);
}
