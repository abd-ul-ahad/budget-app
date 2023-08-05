import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";


//init firesotre
const db = firestore();

//init firebase auth
const Auth = auth();

export { db, Auth };
