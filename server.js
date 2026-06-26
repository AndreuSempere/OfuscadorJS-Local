const express = require('express');
const JsConfuser = require('js-confuser');
const path = require('path');

const app = express();
const PORT = 3000;

// Permitir leer JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir la interfaz gráfica estática
app.use(express.static(path.join(__dirname, 'public')));

app.post('/ofuscar', async (req, res) => {
    try {
        const { codigo, nivel } = req.body;

        if (!codigo) {
            return res.status(400).json({ error: 'No se proporcionó ningún código' });
        }

        const configuraciones = {
            bajo: {
                target: "browser",
                compact: false,
                renameVariables: true,
                deadCode: 0.1,
                minify: true
            },

            medio: {
                target: "browser",
                compact: true,
                renameVariables: true,
                renameGlobals: true,
                deadCode: 0.25,
                stringConcealing: true,
                controlFlowFlattening: 0.3,
                calculator: true,
                minify: true
            },

            alto: {
                target: "browser",
                compact: true,
                renameVariables: true,
                renameGlobals: true,
                controlFlowFlattening: 0.75,
                stringConcealing: true,
                stringSplitting: 0.5,
                objectExtraction: true,
                deadCode: 0.3,
                calculator: true,
                dispatcher: true,
                opaquePredicates: true,
                flatten: true,
                movedDeclarations: true,
                minify: true
            }
        };

        const config = configuraciones[nivel] || configuraciones.medio;
        const resultado = await JsConfuser.obfuscate(codigo, config);

        res.json({
            resultado: resultado.code,
            nivelUsado: nivel || 'medio'
        });

    } catch (error) {
        res.status(500).json({
            error: 'Error al ofuscar el código: ' + error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor web corriendo en http://localhost:${PORT}`);
});
