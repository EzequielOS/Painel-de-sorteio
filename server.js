const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/payload', (req,res)=>{
  const data = req.body;
  if(!Array.isArray(data)) return res.status(400).json({error:'esperado array de participantes'});
  // opcional: salvar em arquivo
  try{ fs.writeFileSync(path.join(__dirname,'last_payload.json'), JSON.stringify(data,null,2)); }catch(e){}
  return res.json({received: data.length});
});

app.listen(PORT, ()=>console.log(`Servidor rodando em http://localhost:${PORT}`));
