import 'dotenv/config'; // Nạp biến môi trường từ file .env

export default {
  "expo": {
    "name": "Petstore_mobile_Blank_template",
    "slug": "Petstore_mobile_Blank_template",
    "version": "1.0.0",
    "scheme": "petstore-mobile",
    "orientation": "portrait",
    "icon": "./assets/paw_icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    
    "facebookAppId": process.env.FACEBOOK_APP_ID, 
    "facebookDisplayName": "Pet Shop App",
    "facebookScheme": `fb${process.env.FACEBOOK_APP_ID}`,
    
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.vankhai.petstore"
    },
    "android": {
      "package": "com.vankhai.petstore",
      "adaptiveIcon": {
        "foregroundImage": "./assets/paw_icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true
    },
    "web": {
      "favicon": "./assets/paw_icon.png"
    },
    "plugins": [
      "expo-web-browser"
    ]
  }
};