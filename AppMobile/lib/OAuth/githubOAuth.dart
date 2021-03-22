import 'package:AppMobile/Logic/request.dart';
import 'package:flutter/cupertino.dart';
import 'package:github_sign_in/github_sign_in.dart';

Future<String> githubOAuth(BuildContext context) async {
  final GitHubSignIn gitHubSignIn = GitHubSignIn(
      clientId: "a71f331663d1b4b25208",
      clientSecret: "f611c160f7df21ec83734d6d6aeddeaabc774d1d",
      redirectUrl: "http://localhost:8081/github_callback");
  var result = await gitHubSignIn.signIn(context);
  switch (result.status) {
    case GitHubSignInResultStatus.ok:
      await sendOAuth("github", "", result.token);
      return (result.token);
    case GitHubSignInResultStatus.cancelled:
      return (null);
    case GitHubSignInResultStatus.failed:
      print(result.errorMessage);
      return (null);
  }
  return (null);
}
