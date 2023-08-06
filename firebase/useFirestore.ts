import { Auth, db, timeStamp } from "./init";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import GenDate from "../utils/GenDate";
import firestore from "@react-native-firebase/firestore";

export const useFirestore = (collectionNew: string, id: string) => {
  const user = useSelector((state: RootState) => state.user);

  // collection reference
  const ref = db.collection(collectionNew);

  // Add a document
  const addDocument = async (doc: any) => {
    try {
      const createdAt = timeStamp;
      await ref
        .add({
          ...doc,
          createdAt,
          user: user.uid,
        })
        .then(() => {
        });
    } catch (err: any) {
      return err.code;
    }
  };

  // Get a document
  const getDocument = async () => {
    let resp = null;
    try {
      resp = ref.where("user", "==", Auth.currentUser?.uid).get();

      return resp;
    } catch (err: any) {
      // console.log(err);
    }

    return resp;
  };

  // Update a document
  const updateDocument = async (newdoc: any, id: string) => {
    try {
      const updatedAt = GenDate();
      const updatedDocument = ref
        .doc(id)
        .update({ ...newdoc, updatedAt })
        .then(() => {
          // console.log("document updated");
        });

      // console.log(updatedDocument);
    } catch (err: any) {
      return err.code;
    }
  };

  // Delete a document
  const deleteDocument = async (id: string) => {
    try {
      //signle doc ref
      const docRef = ref.doc(id).delete();
      // console.log(docRef);
    } catch (err: any) {
      return err.code;
    }
  };

  return { addDocument, getDocument, updateDocument, deleteDocument };
};
