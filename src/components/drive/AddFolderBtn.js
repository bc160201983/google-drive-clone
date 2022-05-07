import { Button, Form, Modal, Spinner } from "react-bootstrap";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { database } from "../../firebase";
import { useAuth } from "../../Context";
import { ROOT_FOLDER } from "../hooks/useFolder";

const AddFolderBtn = ({ currentFolder }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const openModal = () => {
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentFolder === null) return;
    const path = [...currentFolder.path];
    if (currentFolder !== ROOT_FOLDER) {
      path.push({ name: currentFolder.name, id: currentFolder.id });
    }
    //create folder
    setLoading(true);
    try {
      await addDoc(database.folders, {
        name,
        parentId: currentFolder.id,
        userId: currentUser.uid,
        path: path,
        createdAt: serverTimestamp(),
      });
      setName("");
      closeModal();
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <Button onClick={openModal} variant="outline-success" size="md">
        <FontAwesomeIcon icon={faFolderPlus} />
      </Button>
      <Modal show={open} onHide={closeModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Folder Name</Form.Label>
              <Form.Control
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Folder Name"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
            {loading ? (
              <Button variant="success" disabled>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Loading...
              </Button>
            ) : (
              <Button variant="success" type="submit">
                Add Folder
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AddFolderBtn;
