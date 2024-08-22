//Metodo de prueba
export const testFollow = (req, res) => {
    return res.status(200).send({
        message: "Test Follow Controller, send from follow.js"
    });
}