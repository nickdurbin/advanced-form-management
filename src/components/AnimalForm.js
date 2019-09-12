import React, { useState, useEffect } from 'react'
import { withFormik, Form, Field } from 'formik'
import * as yup from 'yup'
import axios from 'axios'

// errors === form validation errors that come from formik
// touched === an object with true/false for each input field, whether the user has touched it yet or not
// status === an object coming from formik containing a new animal (from when we call setStatus)
const AnimalForm = ({ errors, touched, status }) => {
  // hold our animals in state, since the api doesn't save anything yet
  const [animals, setAnimals] = useState([])

  // any time the "status" prop changes, it will contain a new animal from our axios call.
  // simply add it to our animals array as new state.
  useEffect(() => {
    // make sure status is not undefined first (which it will be on page load)
    if (status) {
      setAnimals([ ...animals, status ])
    }
  }, [status])

  return (
    <Form>
      {touched.species && errors.species && <p className="error">{errors.species}</p>}
      <Field type="text" name="species" placeholder="Species" />
      
      {touched.age && errors.age && <p className="error">{errors.age}</p>}
      <Field type="number" name="age" placeholder="Age" />
      
      {touched.diet && errors.diet && <p className="error">{errors.diet}</p>}
      <Field component="select" name="diet">
        <option value="" disabled>Select Diet:</option>
        <option value="carnivore">Carnivore</option>
        <option value="herbivore">Herbivore</option>
        <option value="omnivore">Omnivore</option>
      </Field>
      
      {touched.vaccinations && errors.vaccinations && <p className="error">{errors.vaccinations}</p>}
      <label>
        <Field type="checkbox" name="vaccinations" />
        <span>Vaccinations</span>
      </label>

      <Field component="textarea" name="notes" placeholder="Notes" />

      <button type="submit">Submit</button>

      {animals.map((animal) => (
        <div>Species: {animal.species}</div>
      ))}
      {animals.map((animal) => {
        return <div>Species: {animal.species}</div>
      })}
    </Form>
  )
}

// Export our Formik HOC - which takes our AnimalForm component, and returns a new component
export default withFormik({
  // Values come from formik automatically --- magic!
  mapPropsToValues: (values) => {
    // this makes these inputs "controlled", sets the values automatically for us
    return {
      // these keys line up with the "name" attribute on our Fields
      species: values.species || '',
      age: values.age || '',
      diet: values.diet || '',
      vaccinations: values.vaccinations || false,
      notes: values.notes || ''
    }
  },
  // Formik won't allow our form to submit if any of these validation errors don't pass
  validationSchema: yup.object().shape({
    species: yup.string().required('Species is required!'),
    age: yup.number().required('Age is required!').positive(),
    diet: yup.string().required('Diet is required!'),
    vaccinations: yup.boolean().oneOf([true], 'Animal must be vaccinated!')
  }),
  // Formik hooks this up to our form automatically. Runs when all validations pass and the form is submitted
  handleSubmit: (values, { setStatus }) => {
    // Send our data to an outside API
    axios.post('https://reqres.in/api/animals', values)
      .then((res) => {
        // Result came back succecssfully. We need to send the data back to our component
        // (since we're in an HOC), so Formik uses `setStatus` for that. Which will send the res.data
        // object back to the component as a prop (accessed with props.status, as seen above)
        setStatus(res.data)
      })
      .catch((err) => {
        console.log('Error:', err)
      })
  }
})(AnimalForm)