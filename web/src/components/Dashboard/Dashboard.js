import { useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { getFiles } from '../../actions/files.action.js';
import './Dashboard.css';

const Dashboard = () => {
  const store = useStore();
  const dispatch = useDispatch();
  const filesState = useSelector((state = store.getState()) => state.files);
  const { all, loading } = filesState;

  useEffect(() => {
    dispatch(getFiles())
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
                {all.length ? all.map(fileData =>
                  fileData.lines.map(line => (
                    <tr>
                      <td>{fileData.file}</td>
                      <td>{line.text}</td>
                      <td>{line.number}</td>
                      <td>{line.hex}</td>
                    </tr>
                  ))
                )
                  : null}
              </tbody>
            </Table>
          </div>
        </Row>
      </Container>
    </>
  )
};

export default Dashboard;
