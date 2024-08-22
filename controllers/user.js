//Metodo de prueba
export const testUser = (req, res) => {
    return res.status(200).send({
        message: "Test User Controller, send from user.js"
    });
}



