import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { Image } from "react-bootstrap";
import { ImageViewer } from "react-image-viewer-dv";
const File = ({ file }) => {
  return (
    <a
      href={file.url}
      target="_blank"
      className="btn btn-outline-dark text-truncate w-100"
    >
      <FontAwesomeIcon icon={faFile} style={{ marginRight: "8px" }} />
      {file.name}
    </a>
    // <ImageViewer>
    //   <Image src={file.url} thumbnail />
    // </ImageViewer>
  );
};

export default File;
