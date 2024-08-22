//Metodo de prueba
export const testPublication = (req, res) => {
    return res.status(200).send({
        message: "Test Publication Controller, send from publication.js"
    });
}