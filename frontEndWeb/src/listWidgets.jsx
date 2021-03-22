const tab = [
  {
    title: "Github",
    needoauth: true,
    icon:
      "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    actions: [
      {
        title: "Track if user creates a repository",
        id: "41",
        params: false,
      },
      {
        title: "Track push activity for a repository",
        id: "42",
        params: true,
      },
    ],
    reactions: [
      {
        title: "Star the new repository",
        id: "41",
        params: false,
      },
      {
        title: "notifies the user if there is a new push",
        id: "42",
        params: false,
      },
    ],
  },
  {
    title: "Facebook",
    needoauth: true,
    icon:
      "http://www.grandangouleme.fr/wp-content/uploads/2017/04/Logo-Facebook.png",
    actions: [
      {
        title: "Track activity for a facebook group",
        id: "21",
        params: true,
      },
    ],
    reactions: [
      {
        title:
          "Send an email notification to the user if there is new activity",
        id: "21",
        params: false,
      },
    ],
  },
  {
    title: "Google",
    needoauth: true,
    icon:
      "https://www.impression-graphique.com/wp-content/uploads/2015/09/logo-google-G.jpg",
    actions: [
      {
        title: "Track last email",
        id: "oui",
        params: false,
      },
    ],
    reactions: [
      {
        title: "Reply to the email indicating that we are on holiday",
        id: "31",
        params: false,
      },
      {
        title: "Put the mail in the trash",
        id: "32",
        params: true,
      },
    ],
  },
  {
    title: "OpenWeather",
    needoauth: false,
    icon:
      "https://upload.wikimedia.org/wikipedia/commons/f/f6/OpenWeather-Logo.jpg",
    actions: [
      {
        title: "Track temperature of a city",
        id: "81",
        params: true,
      },
    ],
    reactions: [
      {
        title: "Send a notification if the temperature drops under 10°c",
        id: "81",
        params: false,
      },
    ],
  },
  {
    title: "Spotify",
    needoauth: true,
    icon:
      "https://i0.wp.com/blog.malandra.be/wp-content/uploads/2018/10/spotify-logo-png-7.png?ssl=1",
    actions: [
      {
        title: "Track when a user follow a playlist",
        id: "51",
        params: false,
      },
      {
        title: "Tracker user create a playlist",
        id: "52",
        params: false,
      },
    ],
    reactions: [
      {
        title:
          "Add to your library all the sounds of your top artists in the playlist",
        id: "51",
        params: false,
      },
      {
        title: "Add the top tracks of a specified artist to the playlist",
        id: "52",
        params: true,
      },
    ],
  },
  {
    title: "AviationStack",
    needoauth: false,
    icon:
      "https://image.freepik.com/vecteurs-libre/conception-logo-voyage-avion-jet_8035-9.jpg",
    actions: [
      {
        title: "Follow the activity of an airport",
        id: "61",
        params: true,
      },
      {
        title: "Follow the activity of a flight",
        id: "62",
        params: true,
      },
    ],
    reactions: [
      {
        title: "If a new data arrives send an email",
        id: "61",
        params: false,
      },
      {
        title: "If a new data arrives send an email",
        id: "62",
        params: false,
      },
    ],
  },
  {
    title: "Football",
    needoauth: false,
    icon:
      "https://cdn5.coloritou.com/dessins/peindre/201834/le-ballon-de-football-sports-football-103137.jpg",
    actions: [
      {
        title: "Live scores",
        id: "71",
        params: false,
      },
      {
        title: "Live scores of a particular league",
        id: "72",
        params: true,
      },
    ],
    reactions: [
      {
        title: "Send a mail as soon as there is a goal",
        id: "71",
        params: false,
      },
      {
        title:
          "Send an email if a match changes status in a particular division",
        id: "72",
        params: false,
      },
    ],
  },
];

export default tab;
