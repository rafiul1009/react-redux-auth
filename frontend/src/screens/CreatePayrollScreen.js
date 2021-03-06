import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import { createPayroll } from "../store/actions/payrollActions";
import Message from "../components/Message";
import { listOrganization } from "../store/actions/organizationAction";
import { listEmployee } from "../store/actions/employeeActions";
import Select from "react-select";
// import DatePicker from "react-multi-date-picker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import "react-multi-date-picker/styles/colors/red.css";
// import "react-multi-date-picker/styles/layouts/mobile.css";

const CreatePayrollScreen = ({ location, history }) => {
  const [pay, setPay] = useState("");
  const [due, setDue] = useState("");
  const [month, setMonth] = useState(new Date());
  const [employeeId, setEmployeeId] = useState("");
  const [organizationId, setOrganizationId] = useState("");

  const dispatch = useDispatch();

  const addPayroll = useSelector((state) => state.addPayroll);
  const {  error, payroll } = addPayroll;

  const listOfOrganization = useSelector((state) => state.listOfOrganization);
  const { organizations } = listOfOrganization;

  const listOfEmployee = useSelector((state) => state.listOfEmployee);
  const { employees } = listOfEmployee;

  const redirect = location.search
    ? location.search.spilt("=")[1]
    : "/payrolls";

  useEffect(() => {
    if (payroll) {
      history.push(redirect);
    }
    dispatch(listOrganization());
    dispatch(listEmployee());
  }, [dispatch, redirect, history, payroll]);

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("month", month);
    dispatch(createPayroll(pay, due, month, employeeId, organizationId));
  };

  const options = [];
  console.log("organizations", organizations);
  if (organizations) {
    organizations.map((organization) =>
      options.push({ value: organization.id, label: organization.name })
    );
  }

  const handleSelectChange = (options) => {
    console.log("handle", options);
    setOrganizationId(options.value);
  };

  const handleEmployeeChange = (e) => {
    setEmployeeId(e);
  };
  return (
    <FormContainer>
      <h1>Create Payslip</h1>
      {error && <Message variant="danger">{error}</Message>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="pay">
          <Form.Label> Pay Amount</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter pay amount"
            value={pay}
            onChange={(e) => setPay(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="due">
          <Form.Label> Due Amount</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter due amount"
            value={due}
            onChange={(e) => setDue(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="month">
          <Form.Label> Month</Form.Label>
          <br></br>
          <DatePicker
            selected={month}
            onChange={(date) => setMonth(date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            style={{
              backgroundColor: "f0f00f",
              height: "40px",
              width: "520px",
              padding: "20px 20px",
            }}
          />
        </Form.Group>

        {employees && (
          <Form.Group controlId="employeeId">
            <Form.Label> Select Employee</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => handleEmployeeChange(e.target.value)}
            >
              <option> Select Employee</option>
              {employees.map((employee, index) => (
                <option value={employee.id} key={index}>
                  {employee.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        )}

        <Form.Group>
          <Form.Label> Select Organization</Form.Label>
          {organizations && organizations.length > 0 && (
            <Select options={options} onChange={handleSelectChange} />
          )}
        </Form.Group>

        <Button type="submit" variant="primary">
          Create Payroll
        </Button>
      </Form>
    </FormContainer>
  );
};

export default CreatePayrollScreen;
