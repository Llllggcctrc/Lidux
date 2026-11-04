const mongoose = require("mongoose"); 
// biblioteca que permite trabalhar com mongoDB.ao

async function conectarBanco() {
    try { //estabelece a conecxão com o banco de dados
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB conectado com sucesso!");
    } catch (erro) {// ele traz uma mensagem se tiver algum erro
        console.error("Erro ao conectar ao MongoDB:", erro.message);
        throw erro;
    }
}
//ele conecta ao banco
module.exports = conectarBanco;