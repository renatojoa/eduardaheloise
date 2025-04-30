const express = require('express');
const { AuthClientTwoLegged } = require('forge-apis');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const { BucketsApi, ObjectsApi, DerivativesApi } = require('forge-apis');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Configurações do Forge
const FORGE_CLIENT_ID = process.env.FORGE_CLIENT_ID || 'Aek9wpytuKzsIYcsG5V2670cJDIs2hBVMPI6EHahHwco88TY';
const FORGE_CLIENT_SECRET = process.env.FORGE_CLIENT_SECRET || 'JD5iA7ONdnVPvApyQAPTPyFt4cIdAD6a7lhB3PD70fapgdj85fuhwJvphcwh4Al7';
const FORGE_SCOPES = [
  'data:read',
  'data:write',
  'bucket:read',
  'bucket:create'
];

// Nome do bucket para armazenar os arquivos
const BUCKET_KEY = 'eduarda_heloise_portfolio_bucket';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Rota para obter token
app.get('/api/forge/token', async (req, res) => {
  try {
    const oAuth2Client = new AuthClientTwoLegged(
      FORGE_CLIENT_ID,
      FORGE_CLIENT_SECRET,
      FORGE_SCOPES
    );
    
    const credentials = await oAuth2Client.authenticate();
    res.json({
      access_token: credentials.access_token,
      expires_in: credentials.expires_in
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Falha na autenticação' });
  }
});

// Rota para upload de arquivo
app.post('/api/forge/upload', upload.single('fileToUpload'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }
    
    // Autenticar
    const oAuth2Client = new AuthClientTwoLegged(
      FORGE_CLIENT_ID,
      FORGE_CLIENT_SECRET,
      ['data:write', 'data:read', 'bucket:read', 'bucket:create']
    );
    const credentials = await oAuth2Client.authenticate();
    
    // Verificar se o bucket existe, se não, criar
    const bucketsApi = new BucketsApi();
    try {
      await bucketsApi.getBucketDetails(BUCKET_KEY, null, oAuth2Client, credentials);
    } catch (error) {
      if (error.statusCode === 404) {
        await bucketsApi.createBucket(
          { bucketKey: BUCKET_KEY, policyKey: 'transient' },
          {},
          oAuth2Client,
          credentials
        );
      } else {
        throw error;
      }
    }
    
    // Upload do arquivo
    const objectsApi = new ObjectsApi();
    const fileStream = fs.createReadStream(file.path);
    
    const response = await objectsApi.uploadObject(
      BUCKET_KEY,
      file.originalname,
      file.size,
      fileStream,
      {},
      oAuth2Client,
      credentials
    );
    
    // Limpar arquivo temporário
    fs.unlinkSync(file.path);
    
    // Obter URN
    const urn = Buffer.from(response.body.objectId).toString('base64');
    
    // Iniciar conversão
    const derivativesApi = new DerivativesApi();
    
    await derivativesApi.translate(
      {
        input: { urn },
        output: { formats: [{ type: 'svf', views: ['2d', '3d'] }] }
      },
      {},
      oAuth2Client,
      credentials
    );
    
    res.json({
      fileName: file.originalname,
      urn: urn,
      message: 'Arquivo enviado e conversão iniciada com sucesso'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Rota para verificar status da conversão
app.get('/api/forge/status/:urn', async (req, res) => {
  try {
    const { urn } = req.params;
    
    // Autenticar
    const oAuth2Client = new AuthClientTwoLegged(
      FORGE_CLIENT_ID,
      FORGE_CLIENT_SECRET,
      ['data:read']
    );
    const credentials = await oAuth2Client.authenticate();
    
    // Verificar status
    const derivativesApi = new DerivativesApi();
    const response = await derivativesApi.getManifest(urn, {}, oAuth2Client, credentials);
    
    res.json(response.body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Rota para servir a página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Rota para servir a página do visualizador CAD
app.get('/cad-viewer', (req, res) => {
  res.sendFile(path.join(__dirname, '../cad-viewer.html'));
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`Acesse http://localhost:${port} para visualizar o site`);
});