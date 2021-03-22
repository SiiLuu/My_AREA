import 'package:AppMobile/Logic/request.dart';
import 'package:flutter_web_auth/flutter_web_auth.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/cupertino.dart';

class OAuthGoogle {
  Future<String> googleOAuth(BuildContext context) async {
    final redirectUri =
        'com.googleusercontent.apps.566470595427-qfoaa5mgoa2i0h6qlps36m5n3r0gqhfg';

    final result = await FlutterWebAuth.authenticate(
        url: "https://accounts.google.com/o/oauth2/v2/auth?" +
            'scope=profile%20email%20https://www.googleapis.com/auth/gmail.readonly%20https://www.googleapis.com/auth/gmail.modify%20https://www.googleapis.com/auth/gmail.compose%20https://www.googleapis.com/auth/gmail.send&' +
            'response_type=code&' +
            'redirect_uri=' +
            '$redirectUri:/&' +
            'client_id=' +
            '566470595427-qfoaa5mgoa2i0h6qlps36m5n3r0gqhfg.apps.googleusercontent.com',
        callbackUrlScheme: redirectUri);

    final code = Uri.parse(result).queryParameters['code'];

    print(code);
    await sendOAuth("google", "id", code);
    return (code);
  }
}
