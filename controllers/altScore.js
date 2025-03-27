const altScoreRouter = require('express').Router();
const axios = require('axios');
const { ALT_SCORE_API_BASE_URL } = require('../utils/config');
require('dotenv').config();
const api_key = process.env.API_KEY;

// Tabla de sistemas dañados y sus códigos
const systemCodes = {
    navigation: "NAV-01",
    communications: "COM-02",
    life_support: "LIFE-03",
    engines: "ENG-04",
    deflector_shield: "SHLD-05"
};

// Variable para almacenar el sistema dañado
let damagedSystem = null;

// Endpoint 1: GET /status
altScoreRouter.get('/status', (req, res) => {
    // Seleccionar un sistema dañado aleatoriamente
    const systems = Object.keys(systemCodes);
    damagedSystem = systems[Math.floor(Math.random() * systems.length)];

    res.json({ damaged_system: damagedSystem });
});

// Endpoint 2: GET /repair-bay
altScoreRouter.get('/repair-bay', (req, res) => {
    if (!damagedSystem) {
        return res.status(400).send('No damaged system found. Call /status first.');
    }

    // Generar el código correspondiente al sistema dañado
    const code = systemCodes[damagedSystem];

    // Generar la página HTML
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Repair</title>
        </head>
        <body>
            <div class="anchor-point">${code}</div>
        </body>
        </html>
    `;

    res.send(html);
});

// Endpoint 3: POST /teapot
altScoreRouter.post('/teapot', (req, res) => {
    res.status(418).send("I'm a teapot");
});

/**
 * Fetches leaderboard data from the AltScore API.
 * @returns {Promise<Object>} The response data from the API.
 */
async function fetchLeaderboard() {
    try {
        const response = await axios.get(`${ALT_SCORE_API_BASE_URL}/v1/leaderboard`);
        return response.data;
    } catch (error) {
        console.error('Error fetching leaderboard:', error.message);
        throw error;
    }
}

altScoreRouter.post('/register', async (req, res) => {
    try {
        const registerData = await axios.post(`${ALT_SCORE_API_BASE_URL}/v1/register`, req.body);
        res.send(registerData.data)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to register' });
    }
})

// Define a route for the leaderboard
altScoreRouter.get('/leaderboard', async (req, res) => {
    try {
        const leaderboardData = await fetchLeaderboard();
        res.status(200).json(leaderboardData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch leaderboard data' });
    }
});

altScoreRouter.get('/home', async (req, res) => {
    try {
        const homeData = await axios.get(`${ALT_SCORE_API_BASE_URL}`);
        res.send(homeData.data)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch home data' });
    }
})

altScoreRouter.get('/measurement', async (req, res) => {
    console.log('Request URL:', `${ALT_SCORE_API_BASE_URL}/v1/s1/e1/resources/measurement`);
    console.log('Request Headers:', {
        'x-api-key': api_key
    });
    try {
        const measurementData = await axios.get(`${ALT_SCORE_API_BASE_URL}/v1/s1/e1/resources/measurement`, {
            headers: {
                'API-KEY': api_key
                 // Enviar el token como una API-KEY en el encabezado personalizado
            }
        });
        res.send(measurementData.data);
    } catch (error) {
        console.error('Error fetching measurement data:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || 'Failed to fetch measurement data'
        });
    }
});

altScoreRouter.post('/solution1', async (req, res) => {
    try {
        // Obtener la velocidad del cuerpo de la solicitud
        const { speed } = req.body;

        if (!speed || typeof speed !== 'number') {
            return res.status(400).json({ error: 'Speed is required and must be a number' });
        }

        // Enviar la velocidad al endpoint
        const response = await axios.post(`${ALT_SCORE_API_BASE_URL}/v1/s1/e1/solution`, 
            { speed }, // Cuerpo de la solicitud
            {
                headers: {
                    'API-KEY': api_key // Enviar el token como una API-KEY en el encabezado personalizado
                }
            }
        );

        res.send(response.data);
    } catch (error) {
        console.error('Error post speed data:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || 'Failed to post speed data'
        });
    }
});

altScoreRouter.get('/starts', async (req, res) => {
    const { page } = req.query;
    try {
        const starts = await axios.get(`${ALT_SCORE_API_BASE_URL}/v1/s1/e2/resources/stars`, {
            params: {
                page: page || 1 },
            headers: {
                'API-KEY': api_key
                 // Enviar el token como una API-KEY en el encabezado personalizado
            }
        });
        res.send(starts.data);
    } catch (error) {
        
    }
});

altScoreRouter.post('/solution2', async (req, res) => {
    try {
        // Obtener la velocidad del cuerpo de la solicitud
        const { average_resonance } = req.body;

        if (!average_resonance || typeof average_resonance !== 'number') {
            return res.status(400).json({ error: 'Speed is required and must be a number' });
        }

        // Enviar la velocidad al endpoint
        const response = await axios.post(`${ALT_SCORE_API_BASE_URL}/v1/s1/e2/solution`, 
            { average_resonance }, // Cuerpo de la solicitud
            {
                headers: {
                    'API-KEY': api_key // Enviar el token como una API-KEY en el encabezado personalizado
                }
            }
        );

        res.send(response.data);
    } catch (error) {
        console.error('Error post average_resonance data:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || 'Failed to post average_resonance data'
        });
    }
});


altScoreRouter.get('/rolodex', async (req, res) => {
    const { name } = req.query; // Obtener el parámetro 'name' de la consulta
    console.log("name:", name);

    try {
        // Realizar la solicitud GET al endpoint externo
        const rolodexData = await axios.get(`${ALT_SCORE_API_BASE_URL}/v1/s1/e3/resources/oracle-rolodex`, {
            params: { name }, // Pasar el parámetro 'name' en la consulta
            headers: {
                'API-KEY': api_key // Enviar el token como una API-KEY en el encabezado personalizado
            }
        });

        // Enviar la respuesta al cliente
        res.send(rolodexData.data);
    } catch (error) {
        // Manejo de errores mejorado
        console.error('Error fetching rolodex data:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || 'Failed to fetch rolodex data'
        });
    }
});

altScoreRouter.post('/solution3', async (req, res) => {
    try {
        // Obtener la velocidad del cuerpo de la solicitud
        const { planet } = req.body;

        if (!planet || typeof planet !== 'string') {
            return res.status(400).json({ error: 'rrr' });
        }

        // Enviar la velocidad al endpoint
        const response = await axios.post(`${ALT_SCORE_API_BASE_URL}/v1/s1/e3/solution`, 
            { planet }, // Cuerpo de la solicitud
            {
                headers: {
                    'API-KEY': api_key // Enviar el token como una API-KEY en el encabezado personalizado
                }
            }
        );

        res.send(response.data);
    } catch (error) {
        console.error('Error planet data:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || 'Failed to post planet data'
        });
    }
});

module.exports = { 
    altScoreRouter,
    fetchLeaderboard };