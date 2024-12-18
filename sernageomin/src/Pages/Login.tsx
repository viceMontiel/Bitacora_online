import { Form, Button } from "react-bootstrap"
function Login() {
  return (
    <div>
        <h1 className="p-2">Inicio de Sesión</h1>
        <div className="w-100 d-flex flex-col flex-wrap justify-content-center ">
            <Form className="p-50 p-sm-3 w-75 ">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control type="email" placeholder="Ingrese Email" />
                    
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control type="password" placeholder="Ingrese Contraseña" />
                </Form.Group>
                <Button className="w-100" variant="primary" type="submit">
                    Iniciar Sesión
                </Button>
            </Form>
        </div>
        
    </div>
  )
}

export default Login