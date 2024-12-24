import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import './NavbarTool.css';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { setFilter } from '../../actions/files.action.js';

const NavbarTool = () => {
  const store = useStore();
  const dispatch = useDispatch();
  const filesState = useSelector((state = store.getState()) => state.files);
  const { filter } = filesState;

  const handleSearch = (e) => {
    const { value } = e.target;
    dispatch(setFilter(value));
  };

  const fileSearch = () => {
    dispatch()
  };

  return (
    <Navbar expand="lg" className="bg-dark">
      <Container fluid>
        <Navbar.Brand href='/'>
          <img src='https://files.toolboxtve.com/wp-content/uploads/2018/03/15145223/logo.png' alt='Logo'/>
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
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                value={filter}
                onChange={handleSearch}
              />
              <Button variant="outline-success" onClick={() => fileSearch()}>Search</Button>
            </Form>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
};

export default NavbarTool;
