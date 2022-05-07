import React from "react";
import { Container } from "react-bootstrap";
import useFolder from "../hooks/useFolder";
import AddFolderBtn from "./AddFolderBtn";
import Folder from "./Folder";
import NavbarComp from "./Navbar";
import { useParams, useLocation } from "react-router-dom";
import FolderBreadCrum from "./FolderBreadCrum";
import AddFileBtn from "./AddFileBtn";
import File from "./File";

const Dashboard = () => {
  const { folderId } = useParams();
  const { state = {} } = useLocation();
  const { folder, childFolders, childFiles } = useFolder(
    folderId,
    state?.folder
  );

  return (
    <>
      <NavbarComp />
      <Container className="mt-3" expand="sm">
        <div className="d-flex align-items-center">
          <FolderBreadCrum currentFolder={folder} />
          <AddFileBtn currentFolder={folder} />
          <AddFolderBtn currentFolder={folder} />
        </div>

        {/* {folder && <Folder folder={folder} />} */}
        {childFolders.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFolders.map((child) => (
              <div
                key={child.id}
                style={{ maxWidth: "250px", paddingRight: "8px" }}
                className="pt-2"
              >
                <Folder folder={child} />
              </div>
            ))}
          </div>
        )}
        {childFolders.length > 0 && childFiles.length > 0 && <hr />}
        {childFiles.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFiles.map((child) => (
              <div
                key={child.id}
                style={{ maxWidth: "250px", paddingRight: "8px" }}
                className="pt-2"
              >
                <File file={child} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </>
  );
};

export default Dashboard;
