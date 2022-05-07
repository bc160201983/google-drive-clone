import { async } from "@firebase/util";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useReducer } from "react";
import { useAuth } from "../../Context";
import { database, db } from "../../firebase";

const ACTIONS = {
  SELECT_FOLDER: "select-folder",
  UPDATE_FOLDER: "update-folder",
  SET_CHILD_FOLDER: "set-child-folder",
  SET_CHILD_FILES: "set-child-files",
};
export const ROOT_FOLDER = { name: "root", id: null, path: [] };
const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.SELECT_FOLDER:
      return {
        folderId: payload.folderId,
        folder: payload.folder,
        childFolders: [],
        childFiles: [],
      };
    case ACTIONS.UPDATE_FOLDER:
      return {
        ...state,
        folder: payload.folder,
      };
    case ACTIONS.SET_CHILD_FOLDER:
      return {
        ...state,
        childFolders: payload.childFolders,
      };
    case ACTIONS.SET_CHILD_FILES:
      return {
        ...state,
        childFiles: payload.childFiles,
      };
    default:
      return state;
  }
};

const useFolder = (folderId = null, folder = null) => {
  const { currentUser } = useAuth();
  const [state, dispatch] = useReducer(reducer, {
    folderId,
    folder,
    childFolders: [],
    childFiles: [],
  });

  useEffect(() => {
    dispatch({ type: ACTIONS.SELECT_FOLDER, payload: { folder, folderId } });
  }, [folder, folderId]);
  useEffect(async () => {
    if (folderId === null) {
      dispatch({
        type: ACTIONS.UPDATE_FOLDER,
        payload: { folder: ROOT_FOLDER },
      });
    }

    try {
      const docRef = doc(db, "folders", folderId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists) {
        dispatch({
          type: ACTIONS.UPDATE_FOLDER,
          payload: { folder: database.formatData(docSnap) },
        });
      }
    } catch (error) {
      dispatch({
        type: ACTIONS.UPDATE_FOLDER,
        payload: { folder: ROOT_FOLDER },
      });
    }
  }, [folderId]);

  useEffect(async () => {
    const q = query(
      collection(db, "folders"),
      where("parentId", "==", folderId),
      where("userId", "==", currentUser?.uid),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      dispatch({
        type: ACTIONS.SET_CHILD_FOLDER,
        payload: {
          childFolders: snap.docs.map((docSnap) =>
            database.formatData(docSnap)
          ),
        },
      });
    });
    return () => unsubscribe();
  }, [folderId, currentUser]);

  useEffect(async () => {
    const q = query(
      collection(db, "files"),
      where("folderId", "==", folderId),
      where("userId", "==", currentUser?.uid),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      dispatch({
        type: ACTIONS.SET_CHILD_FILES,
        payload: {
          childFiles: snap.docs.map((docSnap) => database.formatData(docSnap)),
        },
      });
    });
    return () => unsubscribe();
  }, [folderId, currentUser]);

  return state;
};

export default useFolder;
