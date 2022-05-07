import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useAuth } from "../../Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { database, db, storage } from "../../firebase";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { ROOT_FOLDER } from "../hooks/useFolder";
import {
  addDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { v4 as uuidV4 } from "uuid";

import { ProgressBar, Toast } from "react-bootstrap";
const AddFileBtn = ({ currentFolder }) => {
  const { currentUser } = useAuth();
  const [uploadingFiles, setUploadingFiles] = useState([]);

  const handleUpload = (e) => {
    const file = e.target.files[0];

    if (currentFolder == null || file == null) return;
    const id = uuidV4();
    setUploadingFiles((prev) => {
      return [...prev, { id: id, name: file.name, progress: 0, error: false }];
    });

    const fullPath = currentFolder.path.map((e) => e.name).join("/");
    const filePath =
      currentFolder === ROOT_FOLDER
        ? `${fullPath}/${file.name}`
        : `${fullPath}/${currentFolder.name}/${file.name}`;

    const uploadTask = ref(storage, `/files/${currentUser.uid}/${filePath}`);
    //uploading files
    const uploadRef = uploadBytesResumable(uploadTask, file);

    //creating upload progress
    uploadRef.on(
      "state_changed",
      (snapshot) => {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes;
        setUploadingFiles((prevUploadingFiles) => {
          return prevUploadingFiles.map((uploadFile) => {
            if (uploadFile.id === id) {
              return { ...uploadFile, progress: progress };
            }

            return uploadFile;
          });
        });
      },
      () => {
        setUploadingFiles((prevUploadingFiles) => {
          return prevUploadingFiles.map((uploadFile) => {
            if (uploadFile.id === id) {
              return { ...uploadFile, error: true };
            }
            return uploadFile;
          });
        });
      },
      () => {
        setUploadingFiles((prevUploadingFiles) => {
          return prevUploadingFiles.filter((uploadFile) => {
            return uploadFile.id !== id;
          });
        });
        getDownloadURL(uploadTask)
          .then(async (url) => {
            const q = query(
              database.files,
              where("name", "==", file.name),
              where("userId", "==", currentUser.uid),
              where("folderId", "==", currentFolder.id)
            );
            const filesData = await getDocs(q);

            if (filesData.docs.length > 0) {
              const id = filesData.docs[0].id;
              const fileRef = doc(db, "files", id);
              updateDoc(fileRef, { url: url })
                .then(() => {
                  console.log("file updated");
                })
                .catch((e) => console.log(e.message));
            } else {
              await addDoc(database.files, {
                url,
                name: file.name,
                userId: currentUser.uid,
                folderId: currentFolder.id,
                createdAt: serverTimestamp(),
              })
                .then(() => {
                  console.log("fliles added");
                })
                .catch((err) => {
                  console.log(err.message);
                });
            }
          })
          .catch((error) => {
            console.log(error.message);
          });
      }
    );
  };

  return (
    <>
      <label
        className="btn btn-outline-success btn-md"
        style={{ marginRight: "8px" }}
      >
        <FontAwesomeIcon icon={faFileUpload} />
        <input
          type="file"
          onChange={handleUpload}
          style={{
            opacity: 0,
            position: "absolute",
            left: "-9999px",
          }}
        />
      </label>
      {uploadingFiles.length > 0 &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "absolute",
              bottom: "1rem",
              right: "1rem",
              maxWidth: "250px",
            }}
          >
            {uploadingFiles.map((file) => (
              <Toast
                key={file.id}
                onClose={() => {
                  setUploadingFiles((prevUploadingFiles) => {
                    return prevUploadingFiles.filter((uploadFile) => {
                      return uploadFile.id !== file.id;
                    });
                  });
                }}
              >
                <Toast.Header
                  closeButton={file.error}
                  className="text-truncate w-100 d-block"
                >
                  {file.name}
                </Toast.Header>
                <Toast.Body>
                  <ProgressBar
                    animated={!file.error}
                    variant={file.error ? "danger" : "primary"}
                    now={file.error ? 100 : file.progress * 100}
                    label={
                      file.error
                        ? "Error"
                        : `${Math.round(file.progress * 100)}%`
                    }
                  />
                </Toast.Body>
              </Toast>
            ))}
          </div>,
          document.body
        )}
    </>
  );
};

export default AddFileBtn;
