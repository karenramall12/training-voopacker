let acaoAtual = '';
let videoParaExcluir = null;

document.addEventListener("DOMContentLoaded", async function () {
    await carregarVideos(); // Carrega os vídeos ao iniciar
});

function abrirModal(acao, videoCard = null, link = null) {
    acaoAtual = acao;
    videoParaExcluir = { videoCard, link };
    document.getElementById('senhaModal').style.display = 'block';
}

function fecharModal() {
    document.getElementById('senhaModal').style.display = 'none';
}

async function verificarSenha() {
    const senha = document.getElementById('senhaInput').value;
    const senhaCorreta = "lua123"; // Defina a senha correta aqui

    if (senha === senhaCorreta) {
        fecharModal();
        if (acaoAtual === 'adicionar') {
            await adicionarVideo();
        } else if (acaoAtual === 'excluir' && videoParaExcluir) {
            await excluirVideo(videoParaExcluir.videoCard, videoParaExcluir.link);
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
        const videoData = { titulo, link };

        // Salvar o vídeo no servidor
        const response = await fetch('http://localhost:3000/videos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(videoData)
        });

        if (response.ok) {
            await carregarVideos(); // Atualiza a lista de vídeos
            document.getElementById('titulo').value = '';
            document.getElementById('link').value = '';
            document.getElementById('senhaInput').value = '';
        } else {
            alert("Erro ao salvar vídeo!");
        }
    } else {
        alert("Preencha todos os campos!");
    }
}

// Função para carregar vídeos
async function carregarVideos() {
    const response = await fetch('http://localhost:3000/videos');
    const videos = await response.json();

    const videoContainer = document.getElementById('videos');
    videoContainer.innerHTML = ''; // Limpa a lista antes de adicionar os vídeos

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

        // Criar botão de excluir
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.textContent = "Excluir";
        deleteButton.onclick = function() {
            abrirModal('excluir', videoCard, video.link);
        };

        // Adicionar elementos ao vídeoCard
        videoCard.appendChild(videoTitle);
        videoCard.appendChild(iframe);
        videoCard.appendChild(deleteButton);

        // Adicionar vídeo à lista
        videoContainer.appendChild(videoCard);
    });
}

// Função para excluir vídeo
async function excluirVideo(videoCard, link) {
    const response = await fetch('http://localhost:4000/videos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link })
    });

    if (response.ok) {
        videoCard.remove(); // Remove o vídeo da tela
    } else {
        alert("Erro ao excluir vídeo!");
    }
}