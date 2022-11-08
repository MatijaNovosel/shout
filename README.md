<div align="center">
  <img src="https://user-images.githubusercontent.com/36193643/200551153-0bcf74d7-16b5-448e-8987-db0b820fb62a.png" />
</div>

<h1 align=center>Shout</h1>
<p align=center>Messaging service for the web, based on WhatsApp.</p>

<h3 align=center>
⚠️ WIP: Currently transferring the backend from Firebase to Supabase
</h3>

<p align=center>
  📱 <a href="https://github.com/MatijaNovosel/shout-mobile"> Mobile version </a>
</p>

![image](https://user-images.githubusercontent.com/36193643/144072641-3a353892-48ab-4c95-9f27-cbbd3f7e4e4b.png)

## 🚀 Features

- End to end user encryption
- Real time private and group chatting with the option of sending all sorts of multimedia
- User customization

## 🔨 Built With

- [Supabase](https://supabase.com/)
- [Vue 3](https://vuejs.org/)
- [Quasar](https://quasar.dev/)

## ⚙️ Setup

1. Register a new Supabase app
2. Install the dependencies

```bash
npm install
```

3. Define the .env file with the following entries:

```sh
VUE_APP_SUPABASE_URL=
VUE_APP_SUPABASE_ANON_KEY=
```

4. Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
npm run lint
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
