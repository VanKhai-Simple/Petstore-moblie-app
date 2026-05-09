# Tactile Sanctuary Pet Shop

Premium Pet Shop mobile app built with Expo Go + React Native.

## Structure

- `src/`: Expo React Native frontend.
- `assets/`: product images used by the UI.
- No local backend project is required. The app consumes the existing remote API only.

## Remote API

Swagger:

```text
http://157.66.100.48:5000/swagger/index.html
```

Frontend API base URL:

```text
http://157.66.100.48:5000/api
```

Implemented frontend calls:

- `GET /api/Product/Search`
- `GET /api/Product/{id}`
- `GET /api/Category`

## Run Expo Go

```bash
npm install
npm run typecheck
npm start
```

Open the QR code with Expo Go on Android or iPhone.

## Flow

- App starts with the original app flow: Splash while loading app state.
- First launch opens Onboarding.
- If the user is not logged in, the app opens Login/Register.
- After login, the app opens MainTabs with the original tabs: Home, Shop, Favorite, Cart, Profile.
- Shop tab renders Product List.
- Product card press opens Product Detail from the root stack.
- Add to Cart from Product List updates the shared cart and stays in Shop.
- Add to Cart from Product Detail updates the shared cart and opens MainTabs > Cart.
- Cart tab renders Cart.
- Product Detail keeps a bottom tab shortcut back to Home, Shop, Favorite, Cart, and Profile.

If the remote API is unavailable, the app keeps rendering with curated local assets so Expo Go does not open a blank screen.
