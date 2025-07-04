function showTab(tab) {
  // Tabs
  document.getElementById('page-thumb').classList.add('hide');
  document.getElementById('page-converter').classList.add('hide');
  document.getElementById('tab-thumb').classList.remove('active');
  document.getElementById('tab-converter').classList.remove('active');

  if(tab === 'thumb') {
    document.getElementById('page-thumb').classList.remove('hide');
    document.getElementById('tab-thumb').classList.add('active');
  } else {
    document.getElementById('page-converter').classList.remove('hide');
    document.getElementById('tab-converter').classList.add('active');
  }
}


let currentVid = "";

function getVideoId(url) {
  let regex = /(?:youtu\.be\/|youtube\.com.*(?:v=|\/embed\/|\/v\/))([a-zA-Z0-9_-]{11})/;
  let match = url.match(regex);
  return match ? match[1] : null;
}

function showThumbs() {
  let url = document.getElementById('ytlink').value;
  let vid = getVideoId(url);
  if(!vid) {
    alert("Link inválido!");
    return;
  }
  currentVid = vid;
  const maxres = `https://img.youtube.com/vi/${vid}/maxresdefault.jpg`;
  const sd = `https://img.youtube.com/vi/${vid}/sddefault.jpg`;

  // Esconde a barra de pesquisa e botão
  document.getElementById('search-group').classList.add('hide');

  // Gera os previews das duas thumbs
  document.getElementById('thumb').innerHTML = `
  <div class="thumb-block" id="block-maxres">
    <img src="${maxres}" alt="Thumb HD" class="thumb-img" id="thethumb-maxres">
    <div class="thumb-info" id="info-maxres">
      <div class="thumb-title">Thumb HD</div>
      <button onclick="downloadThumb('${maxres}','thumb_${vid}_maxres.jpg', 'block-maxres')">Baixar Thumb HD</button>
    </div>
  </div>
  <div class="thumb-block" id="block-sd">
    <img src="${sd}" alt="Thumb SD" class="thumb-img" id="thethumb-sd">
    <div class="thumb-info" id="info-sd">
      <div class="thumb-title">Thumb SD</div>
      <button onclick="downloadThumb('${sd}','thumb_${vid}_sd.jpg', 'block-sd')">Baixar Thumb SD</button>
    </div>
  </div>
`;

  document.getElementById('thumb').innerHTML += `
  <button class="btn-reset" onclick="resetApp()">Baixar outra thumb</button>
`;

}

async function downloadThumb(url, filename, blockId) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Mostra status de sucesso
    const block = document.getElementById(blockId);
    if (block) {
      let oldStatus = block.querySelector('.status');
      if (oldStatus) oldStatus.remove();
      const status = document.createElement('div');
      status.className = 'status';
      status.style.color = '#fff'; // Cor branca
      status.innerText = 'Download concluído!';
      block.querySelector('.thumb-info').appendChild(status);
    }
  } catch (err) {
    const block = document.getElementById(blockId);
    if (block) {
      let oldStatus = block.querySelector('.status');
      if (oldStatus) oldStatus.remove();
      const status = document.createElement('div');
      status.className = 'status';
      status.style.color = '#f44';
      status.innerText = 'Erro ao baixar a imagem.';
      block.querySelector('.thumb-info').appendChild(status);
    }
  }
  
}

function resetApp() {
  document.getElementById('thumb').innerHTML = '';
  document.getElementById('search-group').classList.remove('hide');
  document.getElementById('ytlink').value = '';
  document.getElementById('ytlink').focus();
}

function converterLink() {
  const input = document.getElementById('shorts-link').value.trim();
  const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/;
  const match = input.match(regex);

  if (match && match[1]) {
    const normalLink = `https://youtube.com/watch?v=${match[1]}`;
    document.getElementById('converted-link').innerHTML =
      `<span style="color:#fff;">Link convertido:</span> <a href="${normalLink}" style="color:#00A03C;" target="_blank">${normalLink}</a>
       <div style="text-align:center; margin-top: 0.2em;">
         <button class="btn-copy" onclick="copiarConvertido('${normalLink}')">Copiar link</button>
         <span id="copy-status" style="margin-left: 10px; color: #00A03C;"></span>
         <br>
         <button class="btn-reset2" style="margin-top:1em;" onclick="resetApp2()">Converter outro link</button>
       </div>`;
  } else {
    document.getElementById('converted-link').innerHTML =
      `<span style="color:#f44;">Link inválido de Shorts!</span>`;
  }
}

// Função auxiliar para copiar para a área de transferência
function copiarConvertido(link) {
  // Copia o link usando a API moderna do navegador
  navigator.clipboard.writeText(link)
    .then(() => {
      document.getElementById('copy-status').textContent = 'Copiado!';
      
    })
    .catch(() => {
      document.getElementById('copy-status').textContent = 'Erro ao copiar!';
    });
    
}

function resetApp2() {
  document.getElementById('thumb').innerHTML = '';
  document.getElementById('search-group').classList.remove('hide');
  document.getElementById('ytlink').value = '';
  document.getElementById('ytlink').focus();


  document.getElementById('shorts-link').value = '';
  document.getElementById('converted-link').innerHTML = '';
}
