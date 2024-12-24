import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Overlay from 'react-bootstrap/Overlay';
import './NavbarTool.css';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, getFiles, getFilesList } from '../../actions/files.action.js';
import { useEffect, useRef, useState } from 'react';

const NavbarTool = () => {
  const [showError, setShowError] = useState(false);
  const target = useRef(null);
  const dispatch = useDispatch();
  const filesState = useSelector(state => state.files);
  const { filter, list } = filesState;

  const handleSearch = (e) => {
    const { value } = e.target;
    if (!value) {
      dispatch(getFiles());
    }
    dispatch(setFilter(value));
  };

  const fileSearch = () => {
    const isFile = list.filter(file => file === `${filter}.csv`);
    if (isFile.length) {
      dispatch(getFiles(filter));
    } else {
      setShowError(true);
    }
  };

  useEffect(() => {
    dispatch(getFilesList());
  }, [dispatch]);

  return (
    <Navbar expand="lg" className="bg-dark">
      <Container fluid>
        <Navbar.Brand href='/'>
          <img src='https://files.toolboxtve.com/wp-content/uploads/2018/03/15145223/logo.png' alt='Logo' />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Nombre sin extensión"
                className="me-2"
                aria-label="Search"
                value={filter}
                onChange={handleSearch}
                onFocus={() => setShowError(false)}
              />
              <Button
                ref={target}
                variant={"outline-success"}
                onClick={() => fileSearch()}
              >Buscar</Button>
              <Overlay target={target.current} show={showError} placement="right">
                {({
                  placement: _placement,
                  arrowProps: _arrowProps,
                  show: _show,
                  popper: _popper,
                  hasDoneInitialMeasure: _hasDoneInitialMeasure,
                  ...props
                }) => (
                  <div
                    {...props}
                    style={{
                      position: 'absolute',
                      backgroundColor: 'rgba(255, 100, 100, 0.85)',
                      padding: '2px 10px',
                      color: 'white',
                      borderRadius: 3,
                      ...props.style,
                    }}
                  >
                    No existe el archivo con ese nombre
                  </div>
                )}
              </Overlay>
            </Form>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
};

export default NavbarTool;
