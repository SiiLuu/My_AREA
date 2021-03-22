class User {
  final String name;
  final String token;

  User({this.name, this.token});

  static User _instance;

  static void setInstance({name, token}) {
    _instance = User(name: name, token: token);
  }

  static User getInstance() {
    if (_instance == null) {
      return null;
    }
    return _instance;
  }
}
