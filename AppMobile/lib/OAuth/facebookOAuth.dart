import 'package:AppMobile/Logic/request.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_facebook_auth/flutter_facebook_auth.dart';
import 'package:AppMobile/UI/Popup/showErrorAlert.dart';

Future<String> facebookOAuth(BuildContext context) async {
  Map<String, dynamic> _userData;
  Map<String, dynamic> jsonVal;
  AccessToken _accessToken;
  try {
    _accessToken = await FacebookAuth.instance.login();
    _userData = await FacebookAuth.instance.getUserData();
    jsonVal = _accessToken.toJson();
  } on FacebookAuthException catch (e) {
    print(e.message);
    switch (e.errorCode) {
      case FacebookAuthErrorCode.OPERATION_IN_PROGRESS:
        print("You have a previous login operation in progress");
        return (null);
      case FacebookAuthErrorCode.CANCELLED:
        print("login cancelled");
        return (null);
      case FacebookAuthErrorCode.FAILED:
        print("login failed");
        return (null);
    }
  } catch (e, s) {
    print(e);
    print(s);
    return (null);
  }
  await sendOAuth("facebook", jsonVal["userId"], jsonVal["token"]);
  return (jsonVal["userId"]);
}
