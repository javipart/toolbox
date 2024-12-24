import { useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import { useDispatch, useSelector } from 'react-redux';
import { getFiles } from '../../actions/files.action.js';
import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const filesState = useSelector(state => state.files);
  const { all, loading } = filesState;

  useEffect(() => {
    dispatch(getFiles());
  }, [dispatch]);

  return (
    <>
      <Container className='w-100'>
        <Row>
          <div className="table-container table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Text</th>
                  <th>Number</th>
                  <th>Hex</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="4">
                      <ProgressBar animated now={100} />
                    </td>
                  </tr>
                )}
                {!loading && all.map((fileData, fileIndex) =>
                  fileData.lines.map((line, lineIndex) => (
                    <tr key={`${fileIndex}-${lineIndex}`}>
                      <td>{fileData.file}</td>
                      <td>{line.text}</td>
                      <td>{line.number}</td>
                      <td>{line.hex}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Row>
      </Container>
    </>
  )
};

export default Dashboard;
