import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
const Folder = ({ folder }) => {
  return (
    <Button
      variant="outline-dark"
      className="text-truncate w-100"
      as={Link}
      to={{
        pathname: `/folder/${folder.id}`,
        state: { folder: folder },
      }}
    >
      <FontAwesomeIcon style={{ marginRight: "8px" }} icon={faFolder} />
      {folder?.name}
    </Button>
  );
};

export default Folder;
