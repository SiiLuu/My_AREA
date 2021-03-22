class Widgets {
  String name;
  int timer;
  String fctId;

  Widgets(this.name, this.timer, this.fctId);

  factory Widgets.fromJson(dynamic json) {
    return Widgets(
      json['name'] as String,
      json['timer'] as int,
      json['fctId'] as String,
    );
  }
}
