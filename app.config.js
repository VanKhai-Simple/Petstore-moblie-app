import 'dotenv/config'; // Nạp biến môi trường từ file .env

export default {
  "expo": {
    "name": "ManaPet Shop",
    "slug": "mana-pet-shop",
    "version": "1.0.0",
    "scheme": "petstore-mobile",
    "orientation": "portrait",
    "icon": "./assets/Manapet-logo.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/Manapet-logo.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    
    "facebookAppId": process.env.FACEBOOK_APP_ID, 
    "facebookDisplayName": "ManaPet Shop",
    "facebookScheme": `fb${process.env.FACEBOOK_APP_ID}`,
    
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.vankhai.petstore"
    },
    "android": {
      "package": "com.vankhai.petstore",
      "adaptiveIcon": {
        "foregroundImage": "./assets/Manapet-logo.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true
    },
    "web": {
      "favicon": "./assets/Manapet-logo.png"
    },
    "plugins": [
      "expo-web-browser"
    ]
  }
};
