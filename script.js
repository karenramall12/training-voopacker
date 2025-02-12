let acaoAtual = '';
let videoParaExcluir = null;

function abrirModal(acao, videoCard = null, link = null) {
    acaoAtual = acao;
    videoParaExcluir = { videoCard, link };
    document.getElementById('senhaModal').style.display = 'block';
}

function fecharModal() {
    document.getElementById('senhaModal').style.display = 'none';
}

function verificarSenha() {
    const senha = document.getElementById('senhaInput').value;
    const senhaCorreta = "lua123"; // Defina a senha correta aqui

    if (senha === senhaCorreta) {
        fecharModal();
        if (acaoAtual === 'adicionar') {
            adicionarVideo();
        } else if (acaoAtual === 'excluir' && videoParaExcluir) {
            excluirVideo(videoParaExcluir.videoCard, videoParaExcluir.link);
            videoParaExcluir = null;
        }
    } else {
        alert("Senha incorreta!");
    }
}

// Função para adicionar vídeo
async function adicionarVideo() {
    const titulo = document.getElementById('titulo').value;
    const link = document.getElementById('link').value;

    if (titulo && link) {
        const videoCard = document.createElement('div');
        videoCard.classList.add('video-card');

        // Criar o título
        const videoTitle = document.createElement('h3');
        videoTitle.classList.add('video-title');
        videoTitle.textContent = titulo;

        // Criar o iframe do vídeo
        const iframe = document.createElement('iframe');
        iframe.src = link.replace("watch?v=", "embed/");
        iframe.height = "200";
        iframe.width = "100%";
        iframe.allowFullscreen = true;

        // Criar o botão de excluir
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.textContent = "Excluir";
        deleteButton.onclick = function() {
            abrirModal('excluir', videoCard, link);  // Abre o modal para excluir
        };

        // Adicionar evento de clique para marcar como assistido
        iframe.addEventListener('load', function() {
            const videoId = link.split('v=')[1];  // Extraímos o ID do vídeo
            if (localStorage.getItem(videoId) === 'assistido') {
                videoCard.classList.add('assistido');  // Adiciona a classe para marcar como assistido
            }
        });

        // Adicionar o título, vídeo e botão ao card
        videoCard.appendChild(videoTitle);
        videoCard.appendChild(iframe);
        videoCard.appendChild(deleteButton);

        // Adicionar o vídeo à lista de vídeos
        document.getElementById('videos').appendChild(videoCard);

        // Salvar o vídeo no servidor
        await salvarVideo({ titulo, link });

        // Limpar os campos de entrada após adicionar o vídeo
        document.getElementById('titulo').value = '';
        document.getElementById('link').value = '';
        document.getElementById('senhaInput').value = '';
    } else {
        alert("Preencha todos os campos!");
    }
}

// Função para salvar vídeo no servidor
async function salvarVideo(video) {
    await fetch('http://localhost:3000/videos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(video)
    });
}

// Função para carregar vídeos ao carregar a página
async function carregarVideos() {
    const response = await fetch('http://localhost:3000/videos');
    const videos = await response.json();

    videos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.classList.add('video-card');

        // Criar o título
        const videoTitle = document.createElement('h3');
        videoTitle.classList.add('video-title');
        videoTitle.textContent = video.titulo;

        // Criar o iframe do vídeo
        const iframe = document.createElement('iframe');
        iframe.src = video.link.replace("watch?v=", "embed/");
        iframe.height = "200";
        iframe.width = "100%";
        iframe.allowFullscreen = true;

        // Adicionar evento para marcar como assistido
        iframe.addEventListener('load', function() {
            const videoId = video.link.split('v=')[1];
            if (localStorage.getItem(videoId) === 'assistido') {
                videoCard.classList.add('assistido');
            }
        });

        // Criar o botão de excluir
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.textContent = "Excluir";
        deleteButton.onclick = function() {
            abrirModal('excluir', videoCard, video.link);  // Abre o modal para excluir
        };

        // Adicionar o título, vídeo e botão ao card
        videoCard.appendChild(videoTitle);
        videoCard.appendChild(iframe);
        videoCard.appendChild(deleteButton);

        // Adicionar o vídeo à lista de vídeos
        document.getElementById('videos').appendChild(videoCard);
    });
}

// Função para excluir vídeo
async function excluirVideo(videoCard, link) {
    videoCard.remove();
    await fetch('http://localhost:3000/videos', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ link })
    });
}

// Função para marcar o vídeo como assistido
function marcarComoAssistido(link) {
    const videoId = link.split('v=')[1];  // Extraímos o ID do vídeo
    localStorage.setItem(videoId, 'assistido');  // Armazenamos no localStorage

    // Atualizar a página para refletir a mudança visual
    carregarVideos();
}

// Carregar vídeos ao carregar a página
window.onload = carregarVideos;