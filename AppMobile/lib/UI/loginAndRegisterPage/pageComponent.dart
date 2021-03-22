import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class RoundedButton extends StatelessWidget {
  final String text;
  final Function press;
  final Color color, textColor;
  final EdgeInsets padding;
  const RoundedButton({
    Key key,
    this.padding,
    this.text,
    this.press,
    this.color,
    this.textColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Container(
      padding: padding,
      width: size.width * 0.7,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(29),
        child: FlatButton(
          padding: EdgeInsets.symmetric(vertical: 15, horizontal: 50),
          color: color,
          onPressed: press,
          child: Text(
            text,
            style: TextStyle(
                color: textColor, fontWeight: FontWeight.bold, fontSize: 15),
          ),
        ),
      ),
    );
  }
}

class InputEmail extends StatefulWidget {
  final TextEditingController controller;
  InputEmail({
    @required this.controller,
    Key key,
  }) : super(key: key);

  @override
  _InputEmailState createState() => _InputEmailState();
}

class _InputEmailState extends State<InputEmail> {
  final FocusNode myFocusNode = FocusNode();

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    ThemeData _myTheme = Theme.of(context);
    return Padding(
      padding: EdgeInsets.only(
          top: size.width * 0.02,
          left: size.width * 0.12,
          right: size.width * 0.12),
      child: Container(
        height: 60,
        width: MediaQuery.of(context).size.width,
        child: TextFormField(
          keyboardType: TextInputType.emailAddress,
          controller: widget.controller,
          focusNode: myFocusNode,
          cursorColor: _myTheme.backgroundColor,
          style: TextStyle(
            color: Colors.black,
          ),
          decoration: InputDecoration(
            focusedBorder: UnderlineInputBorder(
              borderSide: BorderSide(
                color: _myTheme.backgroundColor,
              ),
            ),
            border: UnderlineInputBorder(),
            fillColor: Colors.lightBlueAccent,
            labelText: 'Email',
            labelStyle: TextStyle(
              color: Colors.grey,
            ),
          ),
          validator: (String value) {
            if (value.isEmpty) return 'Please enter your email';
            return value.contains('@') ? null : 'Wrong email format';
          },
        ),
      ),
    );
  }
}

class InputPassword extends StatefulWidget {
  final TextEditingController controller;
  const InputPassword({
    @required this.controller,
    Key key,
  }) : super(key: key);

  @override
  _InputPasswordState createState() => _InputPasswordState();
}

class _InputPasswordState extends State<InputPassword> {
  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    ThemeData _myTheme = Theme.of(context);
    return Padding(
      padding: EdgeInsets.only(
          top: size.width * 0.02,
          left: size.width * 0.12,
          right: size.width * 0.12),
      child: Container(
        height: 60,
        width: MediaQuery.of(context).size.width,
        child: TextFormField(
          keyboardType: TextInputType.visiblePassword,
          controller: widget.controller,
          style: TextStyle(
            color: Colors.black,
          ),
          cursorColor: _myTheme.backgroundColor,
          obscureText: true,
          decoration: InputDecoration(
            border: UnderlineInputBorder(),
            focusedBorder: UnderlineInputBorder(
              borderSide: BorderSide(
                color: _myTheme.backgroundColor,
              ),
            ),
            fillColor: Colors.lightBlueAccent,
            labelText: 'Password',
            labelStyle: TextStyle(
              color: Colors.grey,
            ),
          ),
          validator: (value) {
            if (value.isEmpty) {
              return 'Veuillez entrer votre mot de passe.';
            }
            return null;
          },
        ),
      ),
    );
  }
}

class InputFirstName extends StatefulWidget {
  final TextEditingController controller;
  InputFirstName({
    @required this.controller,
    Key key,
  }) : super(key: key);

  @override
  _InputFirstName createState() => _InputFirstName();
}

class _InputFirstName extends State<InputFirstName> {
  final FocusNode myFocusNode = FocusNode();

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    ThemeData _myTheme = Theme.of(context);
    return Padding(
      padding: EdgeInsets.only(
          top: size.width * 0.02,
          left: size.width * 0.12,
          right: size.width * 0.12),
      child: Container(
        height: 60,
        width: MediaQuery.of(context).size.width,
        child: TextFormField(
          keyboardType: TextInputType.text,
          controller: widget.controller,
          focusNode: myFocusNode,
          cursorColor: _myTheme.backgroundColor,
          style: TextStyle(
            color: Colors.black,
          ),
          decoration: InputDecoration(
            focusedBorder: UnderlineInputBorder(
              borderSide: BorderSide(
                color: _myTheme.backgroundColor,
              ),
            ),
            border: UnderlineInputBorder(),
            fillColor: Colors.lightBlueAccent,
            labelText: 'First name',
            labelStyle: TextStyle(
              color: Colors.grey,
            ),
          ),
          validator: (String value) {
            if (value.isEmpty) return 'Please enter your first name';
            return value.contains('@') ? 'Wrong name format' : null;
          },
        ),
      ),
    );
  }
}

class InputLastName extends StatefulWidget {
  final TextEditingController controller;
  InputLastName({
    @required this.controller,
    Key key,
  }) : super(key: key);

  @override
  _InputLastName createState() => _InputLastName();
}

class _InputLastName extends State<InputLastName> {
  final FocusNode myFocusNode = FocusNode();

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    ThemeData _myTheme = Theme.of(context);
    return Padding(
      padding: EdgeInsets.only(
          top: size.width * 0.02,
          left: size.width * 0.12,
          right: size.width * 0.12),
      child: Container(
        height: 60,
        width: MediaQuery.of(context).size.width,
        child: TextFormField(
          keyboardType: TextInputType.text,
          controller: widget.controller,
          focusNode: myFocusNode,
          cursorColor: _myTheme.backgroundColor,
          style: TextStyle(
            color: Colors.black,
          ),
          decoration: InputDecoration(
            focusedBorder: UnderlineInputBorder(
              borderSide: BorderSide(
                color: _myTheme.backgroundColor,
              ),
            ),
            border: UnderlineInputBorder(),
            fillColor: Colors.lightBlueAccent,
            labelText: 'Last name',
            labelStyle: TextStyle(
              color: Colors.grey,
            ),
          ),
          validator: (String value) {
            if (value.isEmpty) return 'Please enter your last name';
            return value.contains('@') ? 'Wrong name format' : null;
          },
        ),
      ),
    );
  }
}

class InputCity extends StatefulWidget {
  final TextEditingController controller;
  InputCity({
    @required this.controller,
    Key key,
  }) : super(key: key);

  @override
  _InputCity createState() => _InputCity();
}

class _InputCity extends State<InputCity> {
  final FocusNode myFocusNode = FocusNode();

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    ThemeData _myTheme = Theme.of(context);
    return Padding(
      padding: EdgeInsets.only(
          top: size.width * 0.08,
          left: size.width * 0.12,
          right: size.width * 0.12),
      child: Container(
        height: 30,
        width: MediaQuery.of(context).size.width,
        child: TextFormField(
          keyboardType: TextInputType.text,
          controller: widget.controller,
          focusNode: myFocusNode,
          cursorColor: _myTheme.backgroundColor,
          style: TextStyle(
            color: Colors.black,
          ),
          decoration: InputDecoration(
            focusedBorder: UnderlineInputBorder(
              borderSide: BorderSide(
                color: _myTheme.backgroundColor,
              ),
            ),
            border: UnderlineInputBorder(),
            fillColor: Colors.lightBlueAccent,
            labelText: 'City',
            labelStyle: TextStyle(
              color: Colors.grey,
            ),
          ),
          validator: (String value) {
            if (value.isEmpty) return 'Please enter your city name';
            return value.contains('@') ? 'Wrong name format' : null;
          },
        ),
      ),
    );
  }
}
